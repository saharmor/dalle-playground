import base64
import random
import sys
from io import BytesIO
import random
from functools import partial

import jax
import numpy as np
import jax.numpy as jnp
from PIL import Image

from dalle_mini import DalleBart, DalleBartProcessor
from vqgan_jax.modeling_flax_vqgan import VQModel

from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin

from PIL import Image
from tqdm.notebook import trange
from flax.jax_utils import replicate
from flax.training.common_utils import shard_prng_key

# type used for computation - use bfloat16 on TPU's
dtype = jnp.bfloat16 if jax.local_device_count() == 8 else jnp.float32

# TODO: fix issue with bfloat16
dtype = jnp.float32

import wandb


app = Flask(__name__)
CORS(app)
print('--> Starting DALL-E Server. This might take up to two minutes.')

# dalle-mini
DALLE_MODEL = "dalle-mini/dalle-mini/model-mheh9e55:latest"  # can be wandb artifact or 🤗 Hub or local folder or google bucket
# 3f0lem84
DALLE_COMMIT_ID = None

# VQGAN model
VQGAN_REPO = "dalle-mini/vqgan_imagenet_f16_16384"
VQGAN_COMMIT_ID = "e93a26e7707683d349bf5d5c41c5b0ef69b677a9"


# We can customize top_k/top_p used for generating samples
gen_top_k = None
gen_top_p = None
temperature = 0.85
cond_scale = 3.0

wandb.init(anonymous="must")


# Load models & tokenizer
model = DalleBart.from_pretrained(DALLE_MODEL, revision=DALLE_COMMIT_ID, dtype=dtype, abstract_init=True)
vqgan = VQModel.from_pretrained(VQGAN_REPO, revision=VQGAN_COMMIT_ID)

# convert model parameters for inference if requested
if dtype == jnp.bfloat16:
    model.params = model.to_bf16(model.params)

model._params = replicate(model.params)
vqgan._params = replicate(vqgan.params)

processor = DalleBartProcessor.from_pretrained(DALLE_MODEL, revision=DALLE_COMMIT_ID)


# model inference
@partial(jax.pmap, axis_name="batch", static_broadcasted_argnums=(3, 4, 5, 6))
def p_generate(tokenized_prompt, key, params, top_k, top_p, temperature, condition_scale):
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
@partial(jax.pmap, axis_name="batch")
def p_decode(indices, params):
    return vqgan.decode_code(indices, params=params)

  
def tokenize_prompt(prompt: str):
  tokenized_prompt = processor([prompt])
  return replicate(tokenized_prompt)

def generate_images(prompt:str, num_predictions: int):
  tokenized_prompt = tokenize_prompt(prompt)
  
  # create a random key
  seed = random.randint(0, 2**32 - 1)
  key = jax.random.PRNGKey(seed)

  # generate images
  images = []
  for i in trange(num_predictions // jax.device_count()):
      # get a new key
      key, subkey = jax.random.split(key)
      
      # generate images
      encoded_images = p_generate(tokenized_prompt, shard_prng_key(subkey),
          model.params,gen_top_k, gen_top_p, temperature, cond_scale,
      )
      
      # remove BOS
      encoded_images = encoded_images.sequences[..., 1:]

      # decode images
      decoded_images = p_decode(encoded_images, vqgan.params)
      decoded_images = decoded_images.clip(0.0, 1.0).reshape((-1, 256, 256, 3))
      for img in decoded_images:
          images.append(Image.fromarray(np.asarray(img * 255, dtype=np.uint8)))
        
  return images

@app.route('/dalle', methods=['POST'])
@cross_origin()
def generate_images_api():
    json_data = request.get_json(force=True)
    text_prompt = json_data["text"]
    num_images = json_data["num_images"]
    generated_imgs = generate_images(text_prompt, num_images)

    generated_images = []
    for img in generated_imgs:
        buffered = BytesIO()
        img.save(buffered, format="JPEG")
        img_str = base64.b64encode(buffered.getvalue()).decode("utf-8")
        generated_images.append(img_str)

    print(f'Created {num_images} images from text prompt [{text_prompt}]')
    return jsonify(generated_images)


@app.route('/', methods=['GET'])
@cross_origin()
def health_check():
    return jsonify(success=True)

with app.app_context():
    generate_images("warm-up", 1)
    print('--> DALL-E Server is ready to go!')

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=int(sys.argv[1]), debug=False)
