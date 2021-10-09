import base64
import random
import sys
from io import BytesIO

import jax
import numpy as np
from PIL import Image
from dalle_mini.model import CustomFlaxBartForConditionalGeneration
from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin
from tqdm.notebook import tqdm
from transformers import BartTokenizer
from vqgan_jax.modeling_flax_vqgan import VQModel

app = Flask(__name__)
CORS(app)

# make sure we use compatible versions
DALLE_REPO = 'flax-community/dalle-mini'
DALLE_COMMIT_ID = '4d34126d0df8bc4a692ae933e3b902a1fa8b6114'

# set up tokenizer and model
tokenizer = BartTokenizer.from_pretrained(DALLE_REPO, revision=DALLE_COMMIT_ID)
model = CustomFlaxBartForConditionalGeneration.from_pretrained(DALLE_REPO, revision=DALLE_COMMIT_ID)

# make sure we use compatible versions
VQGAN_REPO = 'flax-community/vqgan_f16_16384'
VQGAN_COMMIT_ID = '90cc46addd2dd8f5be21586a9a23e1b95aa506a9'

# set up VQGAN
vqgan = VQModel.from_pretrained(VQGAN_REPO, revision=VQGAN_COMMIT_ID)


def decode_images(encoded_images):
    decoded_images = [vqgan.decode_code(encoded_image) for encoded_image in tqdm(encoded_images)]
    # normalize images
    clipped_images = [img.squeeze().clip(0., 1.) for img in decoded_images]
    # convert to image
    images = [Image.fromarray(np.asarray(img * 255, dtype=np.uint8)) for img in clipped_images]

    return images


def generate_images_new(prompt, num_predictions=4):
    tokenized_prompt = tokenizer(prompt, return_tensors='jax', padding='max_length', truncation=True, max_length=128)

    # create random keys
    seed = random.randint(0, 2 ** 32 - 1)
    key = jax.random.PRNGKey(seed)
    subkeys = jax.random.split(key, num=num_predictions)
    # generate sample predictions
    encoded_images = [model.generate(**tokenized_prompt, do_sample=True, num_beams=1, prng_key=subkey) for subkey in tqdm(subkeys)]

    # remove first token (BOS)
    encoded_images = [img.sequences[..., 1:] for img in encoded_images]
    return decode_images(encoded_images)


@app.route('/dalle', methods=['POST'])
@cross_origin()
def generate_images():
    json_data = request.get_json(force=True)
    text_prompt = json_data["text"]
    num_images = json_data["num_images"]
    generated_imgs = generate_images_new(text_prompt, num_images)

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


if __name__ == '__main__':
    app.run(host="0.0.0.0", port=int(sys.argv[1]), debug=False)
