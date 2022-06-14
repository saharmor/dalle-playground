from consts import ModelSize


def parse_arg_boolean(value):
    value = value.lower()

    if value in ["true", "yes", "y", "1", "t"]:
        return True
    elif value in ["false", "no", "n", "0", "f"]:
        return False

    return False

def parse_arg_dalle_version(value):
    value = value.lower()
    return ModelSize[value.upper()]