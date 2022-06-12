import base64
import sys
from io import BytesIO

from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin
from consts import ModelSize
from datetime import datetime

app = Flask(__name__)
CORS(app)
print("--> Starting DALL-E Server. This might take up to two minutes.")

from dalle_model import DalleModel
dalle_model = None


@app.route("/dalle", methods=["POST"])
@cross_origin()
def generate_images_api():
    json_data = request.get_json(force=True)
    text_prompt = json_data["text"]
    num_images = json_data["num_images"]
    generated_imgs = dalle_model.generate_images(text_prompt, num_images)

    generated_images = []
    for img in generated_imgs:
        now = datetime.now().time()
        imgname = f"{text_prompt}_{dalle_version}_{now}.jpeg"
        buffered = BytesIO()
        img.save(imgname, format="JPEG")
        img.save(buffered, format="JPEG")
        img_str = base64.b64encode(buffered.getvalue()).decode("utf-8")
        generated_images.append(img_str)

    print(f"Created {num_images} images from text prompt [{text_prompt}]")
    return jsonify(generated_images)


@app.route("/", methods=["GET"])
@cross_origin()
def health_check():
    return jsonify(success=True)


with app.app_context():
    try:
        dalle_version = ModelSize[sys.argv[2].upper()]
    except (KeyError, IndexError):
        dalle_version = ModelSize.MINI
    dalle_model = DalleModel(dalle_version)
    dalle_model.generate_images("warm-up", 1)
    print("--> DALL-E Server is up and running!")
    print(f"--> Model selected - DALL-E {dalle_version}")


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(sys.argv[1]), debug=False)
