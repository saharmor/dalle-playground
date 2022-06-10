import React from 'react';
import {Grid} from "@material-ui/core";
import withStyles from "@material-ui/core/styles/withStyles";

const useStyles = () => ({
    generatedImg: {
        borderRadius: '8px',
    },
});

const GeneratedImageList = ({classes, generatedImages, textPromptText}) => {
    
    const ImageObject = ({imgData, alt, title}) => <img src={`data:image/png;base64,${imgData}`}
                                                 className={classes.generatedImg} alt={alt} title={title}/>
                                          
    return (
        <Grid container alignItems="center" spacing={3}>
            {generatedImages.map((generatedImg, index) => {
                return (
                    <Grid item key={index}>
                        <a href={generatedImg} alt={"Generated image " + textPromptText + " " + index} title={"Click to download " + textPromptText + " " + index} download={textPromptText + "-" + index + ".png"}>
                           <ImageObject imgData={generatedImg} alt={textPromptText + " " + index} title={textPromptText + " " + index} />
                        <a>   
                    </Grid>
                )
            })}
        </Grid>
    )
}

export default withStyles(useStyles)(GeneratedImageList)
