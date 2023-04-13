<p align="center">

<img src="https://user-images.githubusercontent.com/6180201/231755090-4e487da8-a9fa-4d9f-b6e3-4271f7db4ead.png" width="120" alt="Dali">
<h2 align="center">Text-to-image Playground (fka DALL-E Playground)</h2>
</p>

A playground for text-to-image enthusiasts using [Stable Diffusion V2](https://stability.ai/blog/stable-diffusion-v2-release).

*<h3>November 2022, major update</h3>*
The original version of this repository used [DALL-E Mini](https://github.com/borisdayma/dalle-mini). With the recent release of Stable Diffusion (SD) V2 and the ease of implementation - this repository has moved to use SD over DALL-E Mini.

<br>_Also see [Whisper Playground](https://github.com/saharmor/whisper-playground) - a playground for building real-time speech2text web apps using OpenAI's Whisper_


![SD repo demo](https://user-images.githubusercontent.com/6180201/204181184-b257d832-d5f6-460d-8193-aaaf25214015.gif)

## Fast usage

You can tinker with the DALL-E playground using a Github-hosted frontend. Follow these steps:

1. Run the DALL-E backend using Google Colab [![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/saharmor/dalle-playground/blob/main/backend/dalle_playground_backend.ipynb)
2. Copy the URL from the output of the last executed cell. Search for the line stating with `Your url is:`.
3. **Wait for the backend to fully load**, this should take ~2min and you should see `--> Image generation server is up and running!`
5. Browse https://saharmor.github.io/dalle-playground/?backendUrl=https://XXXX.trycloudflare.com where the `backendUrl` query parameter should be the url from the previous step

**General note**: while it is possible to run the backend on the free tier of Google Colab, generating more than ~2 images would take >1min, which will result in a frontend timeout. Consider upgrading to Colab Pro or run the backend notebook on your stronger ML machine (e.g. AWS EC2). 


## Local development

Follow these steps in case you'd like to clone and run the DALL-E Playground locally:

1. Clone or fork this repository
2. Create a virtual environment `cd backend && python3 -m venv ENV_NAME`
3. Run virtual environment `source venv/bin/activate`
4. Install requirements `pip install -r requirements.txt`
5. Make sure you have pytorch and its dependencies
   installed _[Installation guide](https://pytorch.org/get-started/locally/)_
6. Run web server `python3 app.py --port 8080` (you can change from 8080 to your own port)
7. In a different terminal, install frontend's modules `cd interface && npm install` and run
   it `npm start`
8. Copy backend's url from step 5 and paste it in the backend's url input within the web app

## Local development/use with Windows WSL2

Window's WSL2 Linux layer has some unique issues getting running with GPU support. Nvidia CUDA drivers are installed on the Windows side instead of Linux, but jax does not see the GPU without compiling from source. Here are extra instructions to get jax compiled.

1. Have a recent NVIDIA GeForce Game Ready or NVIDIA RTX Quadro driver installed in Windows 
2. In Linux: Install Nvidia's CUDA toolkit, [WSL instructions](https://docs.nvidia.com/cuda/cuda-installation-guide-linux/index.html#wsl-installation)
3. In Linux: Install Nvidia's CuDNN library: [instructions](https://docs.nvidia.com/deeplearning/cudnn/install-guide/index.html)
4. In Linux: Build and install both `jaxlib` and `jax` from source, remember to enable cuda during compilation with `python3 build/build.py --enable_cuda` [instructions](https://jax.readthedocs.io/en/latest/developer.html)
5. In compiling `jaxlib`, you might hit a broken configuration file, solution here: https://github.com/google/jax/issues/11068
6. Follow local development instructions above

WSL2 installs are fairly bare bones, expect to install packages like `npm`, `python3-pip` and many others to get things working. More troubleshooting [here](https://github.com/saharmor/dalle-playground/pull/44)

## Local development with Docker-compose

1. Make sure you have [docker](https://docs.docker.com/get-docker/) and [The NVIDIA Container Toolkit](https://docs.nvidia.com/datacenter/cloud-native/container-toolkit/install-guide.html) installed 
2. Clone or fork this repository
3. start server `docker-compose up`, add `-d` to `docker-compose up` if you'd like to run it in the background
4. The first time will take some time to download the images, models and other dependencies. 
   models and other dependencies are downloaded only once, and then cached.
4. Copy backend's url from step 2 and paste it in the backend's url input within the web app.
   
   webapp at `http://localhost:3000/dalle-playground`

## Acknowledgements
The original reposistory used  @borisdayma's DALL-E Mini.
