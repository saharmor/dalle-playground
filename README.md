<p align="center">
<img src="https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/240/apple/285/woman-artist_1f469-200d-1f3a8.png" width="60" alt="Dali">
  <h2 align="center">DALL-E Playground</h2>
</p>

A playground for DALL-E enthusiasts to tinker with the open-source version of
OpenAI's [DALL-E](https://openai.com/blog/dall-e/).

https://user-images.githubusercontent.com/6180201/124460076-30940180-dd8f-11eb-9bac-10144b17840b.mp4

## Fast usage

You can tinker with the DALL-E playground using a Github-hosted frontend. Follow these steps:

1. Run the DALL-E backend using Google Colab
   and [this notebook](https://github.com/saharmor/dalle-playground/blob/main/backend/dalle_playground_backend.ipynb)
2. Copy the URL from the last executed cell. Look for the line
   having `your url is: https://XXXX.loca.lt`.
3. Browse https://saharmor.github.io/dalle-playground/?backendUrl=https://XXXX.loca.lt where
   the `backendUrl` query parameter should be the url from the previous step.

**General note**: while it's possible to run the DALL-E Mini backend on the free tier of Google Colab,
generating more than 1-2 images would take more than 1min, which will result in a frontend timeout. Consider upgrading to Colab Pro or run the backend notebook on your stronger ML machine (e.g. AWS EC2). 

## Local development

Follow these steps in case you'd like to clone and run the DALL-E playground locally:

1. Clone or fork this repository
2. Create a virtual environment `cd backend && python3 -m venv ENV_NAME`
3. Install requirements `pip install -r requirements.txt`
4. Make sure you have pytorch and its dependencies
   installed _[Installation guide](https://pytorch.org/get-started/locally/)_
5. Run web server `python app.py`
6. In a different terminal, install frontend's modules `cd interface && npm install` and run
   it `npm start`
7. Copy backend's url from step 5 and paste it in the backend's url input within the web app

## Acknowledgements

This repo is a React flavour of [Boris Dayma's](https://github.com/borisdayma) DALL-E Mini
repository. 
