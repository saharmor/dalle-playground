import React, { memo, FC, useCallback, useContext, useEffect, useState } from 'react';
import { PulseLoader } from 'react-spinners';

import { Grid, TextField } from '@material-ui/core';

import { validateDalleServer } from 'api/backend_api';
import { FormContext } from 'contexts/FormContext';
import { validateURL } from 'utils';

type Props = {
  isDisabled: boolean;
};

const BackendUrlInput: FC<Props> = ({ isDisabled }) => {
  const { backendURL, setBackendURL, isValidURL, setIsValidURL } = useContext(FormContext);

  const [inputValue, setInputValue] = useState(backendURL);
  const [isCheckingURL, setIsCheckingURL] = useState(false);

  const hasError = !isValidURL && !!inputValue;
  const helperText = hasError ? 'No running DALL-E server with this URL' : '';

  const handleOnChange = useCallback(
    async (newURL: string) => {
      setIsCheckingURL(true);
      setInputValue(newURL);

      try {
        if (!validateURL(newURL)) {
          throw Error('Not a valid URL');
        }

        const response = await validateDalleServer(newURL);

        if (!response.ok) {
          throw Error('HTTP error');
        }

        setIsValidURL(true);
        setBackendURL(newURL);
      } catch (err) {
        window.console.error(err);
        setIsValidURL(false);
      } finally {
        setIsCheckingURL(false);
      }
    },
    [setIsCheckingURL, setBackendURL, setIsValidURL, setInputValue],
  );

  useEffect(() => {
    handleOnChange(backendURL);
  }, [handleOnChange, backendURL]);

  return (
    <TextField
      id="standard-basic"
      label="Backend URL"
      value={inputValue}
      disabled={isDisabled}
      error={hasError}
      helperText={helperText}
      onChange={(event) => handleOnChange(event.target.value)}
      InputProps={{
        endAdornment: isCheckingURL && (
          <Grid item xs={2}>
            <PulseLoader size={5} />
          </Grid>
        ),
      }}
      fullWidth
    />
  );
};

BackendUrlInput.displayName = 'BackendUrlInput';

export default memo(BackendUrlInput);
