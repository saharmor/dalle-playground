import React, { FC, useEffect, useState } from 'react';
import { PulseLoader } from 'react-spinners';
import { Grid, TextField, createStyles } from '@material-ui/core';
import withStyles, { WithStyles } from '@material-ui/core/styles/withStyles';
import qs from 'qs';
import { isValidURL } from 'utils';
import { checkIfValidBackend } from 'api/backend_api.js';

const useStyles = () =>
  createStyles({
    inputBackend: {
      minWidth: '220px',
    },
    loadingSpinner: {
      paddingTop: '20px !important',
    },
  });

interface Props extends WithStyles<typeof useStyles> {
  disabled: boolean;
  setBackendValidUrl: (validURL: string) => void;
  isValidBackendEndpoint: boolean;
  setIsValidBackendEndpoint: (isValid: boolean) => void;
  isCheckingBackendEndpoint: boolean;
  setIsCheckingBackendEndpoint: (isChecking: boolean) => void;
}

const BackendUrlInput: FC<Props> = ({
  classes,
  disabled,
  setBackendValidUrl,
  isValidBackendEndpoint,
  setIsValidBackendEndpoint,
  isCheckingBackendEndpoint,
  setIsCheckingBackendEndpoint,
}) => {
  const [backendUrl, setBackendUrl] = useState('');

  useEffect(() => {
    const qsBackendUrl = qs.parse(window.location.search, {
      ignoreQueryPrefix: true,
    }).backendUrl as string;

    if (qsBackendUrl) {
      onChange(qsBackendUrl);
    }
  }, [setBackendUrl]);

  function onChange(newBackendUrl: string) {
    if (isValidURL(newBackendUrl)) {
      setIsCheckingBackendEndpoint(true);
      checkIfValidBackend(newBackendUrl)
        .then((isValid) => {
          setIsValidBackendEndpoint(isValid);

          if (isValid) {
            setBackendValidUrl(newBackendUrl);
          }

          setIsCheckingBackendEndpoint(false);
        })
        .catch(() => {
          setIsCheckingBackendEndpoint(false);
        });
    } else {
      setIsValidBackendEndpoint(false);
    }

    setBackendUrl(newBackendUrl);
  }

  return (
    <Grid container spacing={1} alignContent="center">
      <Grid item xs={10}>
        <TextField
          className={classes.inputBackend}
          fullWidth
          id="standard-basic"
          label="Backend URL"
          value={backendUrl}
          disabled={disabled}
          error={!isValidBackendEndpoint && backendUrl !== ''}
          helperText={
            !isValidBackendEndpoint && backendUrl !== '' && 'No running DALL-E server with this URL'
          }
          onChange={(event) => onChange(event.target.value)}
        />
      </Grid>
      {isCheckingBackendEndpoint && (
        <Grid item className={classes.loadingSpinner} xs={2}>
          <PulseLoader size={5} loading={isCheckingBackendEndpoint} />
        </Grid>
      )}
    </Grid>
  );
};

export default withStyles(useStyles)(BackendUrlInput);
