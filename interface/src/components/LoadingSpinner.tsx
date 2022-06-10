import React, { FC, useEffect, useState } from 'react';
import { PulseLoader } from 'react-spinners';

import { Typography, createStyles } from '@material-ui/core';
import withStyles, { WithStyles } from '@material-ui/core/styles/withStyles';

const useStyles = () =>
  createStyles({
    root: {
      display: 'flex',
      flexDirection: 'column',
      textAlign: 'center',
      marginTop: '80px',
    },
    loadingText: {
      paddingTop: '20px',
    },
  });

const processingSteps = ['Generating images 👨🏽‍🎨', 'Doing fancy calculations ✨'];

interface Props extends WithStyles<typeof useStyles> {
  isLoading: boolean;
  searchTerm: string;
}

const LoadingSpinner: FC<Props> = ({ classes, isLoading, searchTerm }) => {
  const [textIdx, setTextIdx] = useState(0);

  useEffect(() => {
    const intervalID = setTimeout(() => {
      const currentIdx = textIdx;

      if (currentIdx + 1 < processingSteps.length) {
        setTextIdx(currentIdx + 1);
      }
    }, 10000);

    return () => clearInterval(intervalID);
  }, []);

  const loadingText = processingSteps[textIdx % processingSteps.length];

  return (
    <div className={classes.root}>
      <PulseLoader size={20} loading={isLoading} />
      {searchTerm}
      <Typography className={classes.loadingText} variant={'h6'}>
        {loadingText}
      </Typography>
    </div>
  );
};

export default withStyles(useStyles)(LoadingSpinner);
