import React from 'react';
import {Grid} from "@material-ui/core";

const ImageObject = ({imgData, alt}) => <img src={`data:image/png;base64,${imgData}`} alt={alt}/>

const GeneratedImageList = ({generatedImages}) => {
    return (
        <Grid container alignItems="center" spacing={3}>
            {generatedImages.map((generatedImg, index) => {
                return (
                    <Grid item key={index}>
                        <ImageObject imgData={generatedImg} alt={index}/>
                    </Grid>
                )
            })}
        </Grid>
    )
}

export default GeneratedImageList;
