import React from 'react';
import withStyles from "@material-ui/core/styles/withStyles";
import ImageList from '@material-ui/core/ImageList';
import ImageListItem from '@material-ui/core/ImageListItem';

const useStyles = () => ({
    root: {
        
    },
    generatedImg: {
        borderRadius: '8px',
    },
    imageCell: {
        margin: "0px 5px 10px 5px",
    },
});

const GeneratedImageList = ({ classes, generatedImages, generatedImagesFormat, promptText, index }) => {
    const ImageObject = ({ imgData, promptText, index }) => {
        const imgSrc = `data:image/${generatedImagesFormat};base64,${imgData}`
        const alt = `${promptText} ${index}`
        const title = "Download image"
        const downloadedFilename = `${promptText}_${index}.${generatedImagesFormat}`

        return (
            <ImageListItem className={classes.imageCell} key={index}>
                <a href={imgSrc} alt={alt} title={title} download={downloadedFilename}>
                    <img src={imgSrc} className={classes.generatedImg} alt={alt} title={title} width="300px"/>
                </a>
            </ImageListItem>
        )
    }


    return (
        <div className={classes.root}>
            <ImageList gap={20} cols={3}>
                {generatedImages.map((generatedImg, index) => (
                    <ImageObject imgData={generatedImg} promptText={promptText} key={++index} index={++index}/>
                ))}
            </ImageList>
        </div>
    )
}

export default withStyles(useStyles)(GeneratedImageList)