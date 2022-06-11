import React, { FC, memo, useEffect, useState } from 'react';
import { MoonLoader } from 'react-spinners';

import { Grid, Typography } from '@material-ui/core';

import { PROCESSING_STEPS } from 'utils';

const LoadingSpinner: FC = () => {
  const [processIndex, setProcessIndex] = useState(0);

  useEffect(() => {
    const intervalID = setTimeout(() => {
      const currentIndex = processIndex;
      if (currentIndex + 1 < PROCESSING_STEPS.length) {
        setProcessIndex(currentIndex + 1);
      }
    }, 10000);

    return () => clearInterval(intervalID);
  }, [processIndex]);

  const loadingText = PROCESSING_STEPS[processIndex % PROCESSING_STEPS.length];

  return (
    <Grid container spacing={3} justifyContent="center" justify="center">
      <Grid
        item
        xs={12}
        justifyContent="center"
        style={{
          textAlign: 'left',
          display: 'flex',
        }}
      >
        <MoonLoader size="60" loading />
      </Grid>
      <Grid item xs={12}>
        <Typography variant="body1">{loadingText}</Typography>
      </Grid>
    </Grid>
  );
};

LoadingSpinner.displayName = 'LoadingSpinner';

export default memo(LoadingSpinner);
