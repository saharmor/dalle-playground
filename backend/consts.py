from enum import Enum 

DEFAULT_IMG_OUTPUT_DIR = 'generations'

DALLE_MODEL_MINI = "dalle-mini/dalle-mini/mini-1:v0"  # the original DALL-E Mini. Fastest yet suboptimal results
DALLE_MODEL_MEGA = "dalle-mini/dalle-mini/mega-1-fp16:latest"  # the advanced version of DALL-E Mini. Requires more compute and VRAM
DALLE_MODEL_MEGA_FULL = "dalle-mini/dalle-mini/mega-1:latest"  # DALL-E Mega. Warning: requires significantly more storage and GPU RAM
DALLE_COMMIT_ID = None

# VQGAN model
VQGAN_REPO = "dalle-mini/vqgan_imagenet_f16_16384"
VQGAN_COMMIT_ID = "e93a26e7707683d349bf5d5c41c5b0ef69b677a9"


# We can customize generation parameters (see https://huggingface.co/blog/how-to-generate)
GEN_TOP_K = None
GEN_TOP_P = None
TEMPERATURE  = None
COND_SCALE = 10.0

class ModelSize(Enum):
    MINI = "Mini"
    MEGA = "Mega"
    MEGA_FULL = "Mega_full"