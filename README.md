<p align="center">
<img src="https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/240/apple/285/woman-artist_1f469-200d-1f3a8.png" width="60" alt="Dali">
  <h2 align="center">DALL-E Playground</h2>
</p>

A playground for DALL-E enthusiasts to tinker with the open-source version of
OpenAI's [DALL-E](https://openai.com/blog/dall-e/), based on [DALL-E Mini](https://github.com/borisdayma/dalle-mini).

https://user-images.githubusercontent.com/6180201/136710500-8bb01b4c-5741-4007-a8ea-e18ba5895649.mp4


## Fast usage

You can tinker with the DALL-E playground using a Github-hosted frontend. Follow these steps:

1. Run the DALL-E backend using Google Colab [![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/saharmor/dalle-playground/blob/main/backend/dalle_playground_backend.ipynb)
2. Copy the URL from the last executed cell. Look for the line having `your url is: https://XXXX.loca.lt`
3. **Wait for the backend to fully load**, this should take ~2min and you should see `--> DALL-E Server is up and running!`
5. Browse https://saharmor.github.io/dalle-playground/?backendUrl=https://XXXX.loca.lt where the `backendUrl` query parameter should be the url from the previous step

**General note**: while it is possible to run the DALL-E Mini backend on the free tier of Google Colab,
generating more than 1-2 images would take more than 1min, which will result in a frontend timeout. Consider upgrading to Colab Pro or run the backend notebook on your stronger ML machine (e.g. AWS EC2). 

## Using DALL-E Mega
DALL-E Mega is substianlly more capable than DALL-E Mini and therefore generates higher fidelity images. If you have the computing power--either through a Google Colab Pro+ subcription or by having a strong local machine, select the DALL-E Mega model in the colab notebook or run the backend with a `Mega` or `Mega_full` parameter, e.g. `python dalle-playground/backend/app.py 8000 mega`

## Local development

Follow these steps in case you'd like to clone and run the DALL-E playground locally:

1. Clone or fork this repository
2. Create a virtual environment `cd backend && python3 -m venv ENV_NAME`
3. Install requirements `pip install -r requirements.txt`
4. Make sure you have pytorch and its dependencies
   installed _[Installation guide](https://pytorch.org/get-started/locally/)_
5. Run web server `python app.py 8080` (you can change from 8080 to your own port)
6. In a different terminal, install frontend's modules `cd interface && npm install` and run
   it `npm start`
7. Copy backend's url from step 5 and paste it in the backend's url input within the web app

## Local development/use with Windows WSL2

Window's WSL2 Linux layer has some unique issues getting running with GPU support. Nvidia CUDA drivers are installed on the Windows side instead of Linux, but jax does not see the GPU without compiling from source. Here are extra instructions to get jax compiled.

1. Have a recent NVIDIA GeForce Game Ready or NVIDIA RTX Quadro driver installed in Windows 
2. In Linux: Install Nvidia's CUDA toolkit, [WSL instructions](https://docs.nvidia.com/cuda/cuda-installation-guide-linux/index.html#wsl-installation)
3. In Linux: Install Nvidia's CuDNN library: [instructions](https://docs.nvidia.com/deeplearning/cudnn/install-guide/index.html)
4. In Linux: Build and install both `jaxlib` and `jax` from source, remember to enable cuda during compilation with `python3 build/build.py --enable_cuda` [instructions](https://jax.readthedocs.io/en/latest/developer.html)
5. In compiling `jaxlib`, you might hit a broken configuration file, solution here: https://github.com/google/jax/issues/11068
6. Follow local development instructions above

WSL2 installs are fairly bare bones, expect to install packages like `npm`, `python3-pip` and many others to get things working

## Local development with Docker-compose

1. Make sure you have [docker](https://docs.docker.com/get-docker/) and [The NVIDIA Container Toolkit](https://docs.nvidia.com/datacenter/cloud-native/container-toolkit/install-guide.html) installed 
2. Clone or fork this repository
3. start server `docker-compose up`, add `-d` to `docker-compose up` if you'd like to run it in the background
4. The first time will take some time to download the images, models and other dependencies. 
   models and other dependencies are downloaded only once, and then cached.
4. Copy backend's url from step 2 and paste it in the backend's url input within the web app.
   
   webapp at `http://localhost:3000/dalle-playground`

## Acknowledgements

This repo is a full-stack flavour of [Boris Dayma's](https://github.com/borisdayma) DALL-E Mini
repository. 
