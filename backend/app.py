import base64
import json
import sys
from io import BytesIO
from pathlib import Path
from typing import Dict

import numpy as np
import torch
from PIL import Image
from dalle_pytorch import VQGanVAE, DALLE
from dalle_pytorch.tokenizer import tokenizer
from einops import repeat
from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin
from flask_restful import Resource
from torchvision.utils import save_image
from tqdm import tqdm

BATCH_SIZE = 4
TOP_K = 0.9

vae = VQGanVAE()
image_size = vae.image_size

app = Flask(__name__)
CORS(app)


def load_dalle_models() -> Dict:
    models = json.load(open("pretrained_models.json"))
    loaded_models = {}
    for name, model_path in models.items():
        assert Path(model_path).exists(), f'Trained DALL-E {model_path} does not exist'
        load_obj = torch.load(model_path)
        dalle_params, _, weights = load_obj.pop('hparams'), load_obj.pop('vae_params'), load_obj.pop('weights')
        dalle_params.pop('vae', None)
        dalle = DALLE(vae=vae, **dalle_params, shift_tokens=False, rotary_emb=False).cuda()
        dalle.load_state_dict(weights)
        loaded_models[name] = dalle

    return loaded_models


dalle_loaded_models = load_dalle_models()


@app.route('/available-models', methods=['GET'])
def get_available_models():
    return jsonify(list(dalle_loaded_models))


@app.route('/dalle', methods=['POST'])
@cross_origin()
def generate_images():
    json_data = request.get_json(force=True)
    text_prompt = json_data["text"]
    num_images = json_data["num_images"]
    model_name = json_data["model_name"]
    model = dalle_loaded_models[model_name]

    text = tokenizer.tokenize([text_prompt], model.text_seq_len).cuda()
    text = repeat(text, '() n -> b n', b=num_images)

    outputs = []
    for text_chunk in tqdm(text.split(BATCH_SIZE), desc=f'generating images for - {text}'):
        output = model.generate_images(text_chunk, filter_thres=TOP_K)
        outputs.append(output)

    outputs = torch.cat(outputs)

    # save all images
    outputs_dir = "testing"
    outputs_dir = Path(outputs_dir) / text_prompt.replace(' ', '_')[:100]
    outputs_dir.mkdir(parents=True, exist_ok=True)

    generated_images = []
    for i, image in tqdm(enumerate(outputs), desc='saving images'):
        np_image = np.moveaxis(image.cpu().numpy(), 0, -1)
        formatted = (np_image * 255).astype('uint8')

        img = Image.fromarray(formatted)

        buffered = BytesIO()
        img.save(buffered, format="JPEG")
        img_str = base64.b64encode(buffered.getvalue()).decode("utf-8")
        generated_images.append(img_str)
        save_image(image, outputs_dir / f'{i}.jpg', normalize=True)

    print(f'Created {num_images} images at "{str(outputs_dir)}"')
    return jsonify(generated_images)


@app.route('/', methods=['GET'])
class Health(Resource):
    def get(self):
        return "ok"


if __name__ == '__main__':
    app.run(host="0.0.0.0", port=int(sys.argv[1]), debug=False)
