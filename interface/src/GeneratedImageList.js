import React from 'react';
import { Grid } from "@material-ui/core";
import withStyles from "@material-ui/core/styles/withStyles";

const useStyles = () => ({
    generatedImg: {
        borderRadius: '8px',
    },
});

const GeneratedImageList = ({ classes, generatedImages, generatedImagesFormat, promptText }) => {
    const ImageObject = ({ imgData, promptText, index }) => {
        const imgSrc = `data:image/${generatedImagesFormat};base64,${imgData}`
        const alt = `${promptText} ${index}`
        const title= "Download image"
        const downloadedFilename = `${promptText}_${index}.${generatedImagesFormat}`
        
        return (
            <a href={imgSrc} alt={alt} title={title} download={downloadedFilename}>
                <img src={imgSrc} className={classes.generatedImg} alt={alt} title={title} />
            </a>
        )
    }


    return (
        <Grid container alignItems="center" spacing={3}>
            {generatedImages.map((generatedImg, index) => {
                return (
                    <Grid item key={index}>
                        <ImageObject imgData={generatedImg} promptText={promptText} index={++index}/>
                    </Grid>
                )
            })}
        </Grid>
    )
}

export default withStyles(useStyles)(GeneratedImageList)