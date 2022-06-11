import React, { FC, useState, useContext } from 'react';

import {
  Card,
  CardContent,
  Typography,
  Container,
  Grid,
  CardActions,
  Button,
} from '@material-ui/core';

import { callDalleService } from 'api/backend_api';
import BackendUrlInput from 'components/BackendUrlInput';
import ImagesPerQuerySelect from 'components/Form/ImagesPerQuerySelect';
import GeneratedImageList from 'components/GeneratedImageList';
import Header from 'components/Layout/Header';
import LoadingSpinner from 'components/LoadingSpinner';
import TextPromptInput from 'components/TextPromptInput';
import { FormContext } from 'contexts/FormContext';

const App: FC = () => {
  const { queryString } = useContext(FormContext);

  const [backendUrl] = useState('');
  const [isFetchingImgs, setIsFetchingImgs] = useState(false);
  const [isValidBackendEndpoint] = useState(true);
  const [generatedImages, setGeneratedImages] = useState([]);
  const [apiError, setApiError] = useState('');
  const [imagesPerQuery] = useState(2);
  const [queryTime, setQueryTime] = useState(0);

  const validBackendUrl = isValidBackendEndpoint && backendUrl;

  const handleOnEnter = () => {
    window.console.log(`API call to DALL-E web service with the following prompt [${queryString}]`);
    setApiError('');
    setIsFetchingImgs(true);
    callDalleService(backendUrl, queryString, imagesPerQuery)
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
  };

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
              <BackendUrlInput isDisabled={isFetchingImgs} />
              <TextPromptInput
                onEnter={handleOnEnter}
                isDisabled={isFetchingImgs || !validBackendUrl}
              />
              <ImagesPerQuerySelect isDisabled={isFetchingImgs} />
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
          {isFetchingImgs && <LoadingSpinner />}
          {generatedImages.length > 0 && <GeneratedImageList generatedImages={generatedImages} />}
        </Grid>
      </Grid>
    </Container>
  );
};

App.displayName = 'App';

export default App;
