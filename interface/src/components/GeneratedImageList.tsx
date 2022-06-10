import React, { FC } from 'react';
import { Grid, createStyles } from '@material-ui/core';
import withStyles, { WithStyles } from '@material-ui/core/styles/withStyles';
const useStyles = () =>
  createStyles({
    generatedImg: {
      borderRadius: '8px',
    },
  });

interface Props extends WithStyles<typeof useStyles> {
  generatedImages: any[];
}

const GeneratedImageList: FC<Props> = ({ classes, generatedImages }) => {
  const ImageObject = ({ imgData, alt }: { imgData: string; alt: string }) => (
    <img src={`data:image/png;base64,${imgData}`} alt={alt} />
  );

  return (
    <Grid container alignItems="center" spacing={3}>
      {generatedImages.map((generatedImg, index) => {
        return (
          <Grid item key={index} className={classes.generatedImg}>
            <ImageObject imgData={generatedImg} alt={`${index}`} />
          </Grid>
        );
      })}
    </Grid>
  );
};

export default withStyles(useStyles)(GeneratedImageList);
