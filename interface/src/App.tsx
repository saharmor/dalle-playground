import React, { FC, useState } from 'react';

import {
  Card,
  CardContent,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  Typography,
  Container,
  Grid,
  CardActions,
  Button,
} from '@material-ui/core';

import { callDalleService } from 'api/backend_api';
import BackendUrlInput from 'components/BackendUrlInput';
import GeneratedImageList from 'components/GeneratedImageList';
import Header from 'components/Header';
import LoadingSpinner from 'components/LoadingSpinner';
import TextPromptInput from 'components/TextPromptInput';

const App: FC = () => {
  const [backendUrl, setBackendUrl] = useState('');
  const [isFetchingImgs, setIsFetchingImgs] = useState(false);
  const [isCheckingBackendEndpoint, setIsCheckingBackendEndpoint] = useState(false);
  const [isValidBackendEndpoint, setIsValidBackendEndpoint] = useState(true);
  const [generatedImages, setGeneratedImages] = useState([]);
  const [apiError, setApiError] = useState('');
  const [imagesPerQuery, setImagesPerQuery] = useState(2);
  const [queryTime, setQueryTime] = useState(0);

  const imagesPerQueryOptions = 10;
  const validBackendUrl = isValidBackendEndpoint && backendUrl;

  function enterPressedCallback(promptText: string) {
    window.console.log(`API call to DALL-E web service with the following prompt [${promptText}]`);
    setApiError('');
    setIsFetchingImgs(true);
    callDalleService(backendUrl, promptText, imagesPerQuery)
      .then((response: any) => {
        setQueryTime(response.executionTime);
        setGeneratedImages(response.generatedImgs);
        setIsFetchingImgs(false);
      })
      .catch((error: any) => {
        window.console.log('Error querying DALL-E service.', error);

        if (error.message === 'Timeout') {
          setApiError(
            'Timeout querying DALL-E service (>1min). Consider reducing the images per query or use a stronger backend.',
          );
        } else {
          setApiError('Error querying DALL-E service. Check your backend server logs.');
        }

        setIsFetchingImgs(false);
      });
  }

  return (
    <Container>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Header />
        </Grid>
        {!validBackendUrl && (
          <Grid item xs={12}>
            <Typography variant="body1" color="textSecondary">
              Put your DALL-E backend URL to start
            </Typography>
          </Grid>
        )}

        <Grid item xs={4}>
          <Card>
            <CardContent>
              <BackendUrlInput
                setBackendValidUrl={setBackendUrl}
                isValidBackendEndpoint={isValidBackendEndpoint}
                setIsValidBackendEndpoint={setIsValidBackendEndpoint}
                setIsCheckingBackendEndpoint={setIsCheckingBackendEndpoint}
                isCheckingBackendEndpoint={isCheckingBackendEndpoint}
                disabled={isFetchingImgs}
              />
              <TextPromptInput
                enterPressedCallback={enterPressedCallback}
                disabled={isFetchingImgs || !validBackendUrl}
              />
              <FormControl variant="outlined">
                <InputLabel id="images-per-query-label">Images to generate</InputLabel>
                <Select
                  labelId="images-per-query-label"
                  label="Images per query"
                  value={imagesPerQuery}
                  disabled={isFetchingImgs}
                  onChange={(event) => setImagesPerQuery(parseInt(event.target.value as string))}
                >
                  {Array.from(Array(imagesPerQueryOptions).keys()).map((num) => {
                    return (
                      <MenuItem key={num + 1} value={num + 1}>
                        {num + 1}
                      </MenuItem>
                    );
                  })}
                </Select>
                <FormHelperText>More images = slower query</FormHelperText>
              </FormControl>
              <CardActions>
                <Button variant="contained" color="primary" fullWidth>
                  Submit
                </Button>
              </CardActions>
            </CardContent>
          </Card>
          {queryTime !== 0 && (
            <Typography variant="body2" color="textSecondary">
              Query execution time: {queryTime} sec
            </Typography>
          )}
        </Grid>
        <Grid item xs={8}>
          {!!apiError && (
            <Typography variant="h5" color="error">
              {apiError}
            </Typography>
          )}
          {isFetchingImgs && <LoadingSpinner searchTerm={''} isLoading={isFetchingImgs} />}
          {generatedImages.length > 0 && <GeneratedImageList generatedImages={generatedImages} />}
        </Grid>
      </Grid>
    </Container>
  );
};

App.displayName = 'App';

export default App;
