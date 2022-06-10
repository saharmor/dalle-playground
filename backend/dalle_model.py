import os
import random
import random
from functools import partial

import jax
import numpy as np
import jax.numpy as jnp
from PIL import Image

from dalle_mini import DalleBart, DalleBartProcessor
from vqgan_jax.modeling_flax_vqgan import VQModel


from flax.jax_utils import replicate
from flax.training.common_utils import shard_prng_key

import wandb

from consts import COND_SCALE, DALLE_COMMIT_ID, DALLE_MODEL_MEGA_FULL, DALLE_MODEL_MEGA, DALLE_MODEL_MINI, GEN_TOP_K, GEN_TOP_P, TEMPERATURE, VQGAN_COMMIT_ID, VQGAN_REPO, ModelSize

os.environ["XLA_PYTHON_CLIENT_ALLOCATOR"] = "platform" # https://github.com/saharmor/dalle-playground/issues/14#issuecomment-1147849318
os.environ["WANDB_SILENT"] = "true"
wandb.init(anonymous="must")

# model inference
@partial(jax.pmap, axis_name="batch", static_broadcasted_argnums=(3, 4, 5, 6, 7))
def p_generate(
    tokenized_prompt, key, params, top_k, top_p, temperature, condition_scale, model
):
    return model.generate(
        **tokenized_prompt,
        prng_key=key,
        params=params,
        top_k=top_k,
        top_p=top_p,
        temperature=temperature,
        condition_scale=condition_scale,
    )


# decode images
@partial(jax.pmap, axis_name="batch", static_broadcasted_argnums=(0))
def p_decode(vqgan, indices, params):
    return vqgan.decode_code(indices, params=params)


class DalleModel:
    def __init__(self, model_version: ModelSize) -> None:
        if model_version == ModelSize.MEGA_FULL:
            dalle_model = DALLE_MODEL_MEGA_FULL
            dtype = jnp.float16
        elif model_version == ModelSize.MEGA:
            dalle_model = DALLE_MODEL_MEGA
            dtype = jnp.float16
        else:
            dalle_model = DALLE_MODEL_MINI
            dtype = jnp.float32
            
            
        # Load dalle-mini
        self.model, params = DalleBart.from_pretrained(
            dalle_model, revision=DALLE_COMMIT_ID, dtype=dtype, _do_init=False
        )

        # Load VQGAN
        self.vqgan, vqgan_params = VQModel.from_pretrained(
            VQGAN_REPO, revision=VQGAN_COMMIT_ID, _do_init=False
        )

        self.params = replicate(params)
        self.vqgan_params = replicate(vqgan_params)

        self.processor = DalleBartProcessor.from_pretrained(dalle_model, revision=DALLE_COMMIT_ID)


    def tokenize_prompt(self, prompt: str):
        tokenized_prompt = self.processor([prompt])
        return replicate(tokenized_prompt)


    def generate_images(self, prompt: str, num_predictions: int):
        tokenized_prompt = self.tokenize_prompt(prompt)

        # create a random key
        seed = random.randint(0, 2 ** 32 - 1)
        key = jax.random.PRNGKey(seed)

        # generate images
        images = []
        for i in range(max(num_predictions // jax.device_count(), 1)):
            # get a new key
            key, subkey = jax.random.split(key)

            encoded_images = p_generate(
                tokenized_prompt,
                shard_prng_key(subkey),
                self.params,
                GEN_TOP_K,
                GEN_TOP_P,
                TEMPERATURE,
                COND_SCALE,
                self.model
            )

            # remove BOS
            encoded_images = encoded_images.sequences[..., 1:]

            # decode images
            decoded_images = p_decode(self.vqgan, encoded_images, self.vqgan_params)
            decoded_images = decoded_images.clip(0.0, 1.0).reshape((-1, 256, 256, 3))
            for img in decoded_images:
                images.append(Image.fromarray(np.asarray(img * 255, dtype=np.uint8)))

        return images
