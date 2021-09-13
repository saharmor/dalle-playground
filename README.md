<p align="center">
  <img width="60px" src="https://user-images.githubusercontent.com/6180201/124396344-45c64d00-dd09-11eb-9a51-b6ffb5d61b3c.png" alt="giant microphone"/><br/>
  <h2 align="center">DALL-E Playground</h2>
</p>

A playground for DALL-E enthusiats to tinker with the [open-source version of DALL-E](https://github.com/lucidrains/DALLE-pytorch).

https://user-images.githubusercontent.com/6180201/124460076-30940180-dd8f-11eb-9bac-10144b17840b.mp4

## Fast usage

You can tinker with the DALL-E playground using a pre-hosted frontend. Follow these steps:
1. Run the DALL-E image generating web server using Google Colab and [this notebook](https://colab.research.google.com/github/rom1504/dalle-service/blob/master/dalle_back.ipynb)
2. Copy the URL from the last executed cell. Look for the line with "_your url is: https://XXXX.loca.lt_".
3. Browse https://rom1504.github.io/dalle-service and put copied url in the `Backend URL` input field.

## Local development

Follow these steps in case you'd like to clone and run the DALL-E playground locally:
1. Clone or fork this repository
2. Create a virtual environment `cd dalle_server && python3 -m venv ENV_NAME`
3. Install requirements `pip install -r requirements.txt`
4. Make sure you have pytorch and its dependies installed _[Installation guide](https://pytorch.org/get-started/locally/)_
5. Download desired models [here](https://github.com/robvanvolt/DALLE-models/tree/main/models/taming_transformer) and put them in the dalle_server directory. Update the `pretrained_models` json file accordingly so it will serve the newly-added models to your web app.
6. Run web server `python app.py`
7. In a different terminal, install frontend's modules `cd front && npm install` and run it `npm start`
8. Copy backend's url from step 6 and paste it in the backend's url input within the web app


## What Dalle models can I use ?

You can either train your model yourself with [DALL-E](https://github.com/lucidrains/DALLE-pytorch) or use a pretrained one from https://github.com/robvanvolt/DALLE-models/tree/main/models/taming_transformer 