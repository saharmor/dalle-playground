import React, { memo, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { useQuery } from 'react-query';

import {
  Button,
  Card,
  CardActions,
  CardContent,
  Container,
  Grid,
  Typography,
} from '@material-ui/core';

import { callDalleService } from './backend_api';
import BackendUrlInput from './components/BackendUrlInput';
import Header from './components/Header';
import ImagesPerQuerySelect from './components/ImagesPerQuerySelect';
import LoadingSpinner from './components/LoadingSpinner';
import TextPromptInput from './components/TextPromptInput';
import MyFormContext from './contexts/FormHandling';
import GeneratedImageList from './GeneratedImageList';

const getDalle = async ({ url, query, limit }) => {
  const { generatedImgs } = await callDalleService(url, query, limit);
  return generatedImgs;
};

const App = () => {
  const { backendURL, queryString, validatedBackendURL, isValidURL, imagesPerQuery } =
    useContext(MyFormContext);

  const { data, isLoading, isSuccess, refetch } = useQuery(
    ['DALLE', backendURL, queryString, imagesPerQuery],
    () => getDalle({ url: backendURL, query: queryString, limit: imagesPerQuery }),
  );

  // useEffect(() => {
  //   refetch();
  // }, [refetch, backendURL, queryString, imagesPerQuery]);

  // window.console.log('data', data, 'isLoading', isLoading, 'isSuccess', isSuccess);

  const [isFetchingImgs, setIsFetchingImgs] = useState(false);
  const [apiError, setApiError] = useState('');
  const [generatedImages, setGeneratedImages] = useState([]);
  const [queryTime, setQueryTime] = useState(0);

  const isDisabled = isFetchingImgs || !imagesPerQuery || !isValidURL || !queryString;

  const timer = useRef();

  const runTimer = useCallback(() => {
    let time = 0;
    timer.current = setInterval(() => {
      time = time + 100 / 1000;
      setQueryTime(time.toFixed(2));
    }, 100);
  }, [timer, setQueryTime]);

  const stopTimer = useCallback(
    (finalTime = 0) => {
      clearInterval(timer.current);
      setQueryTime(finalTime);
    },
    [timer, setQueryTime],
  );

  const handleDalleResponse = useCallback(
    (response) => {
      // Stop timer
      stopTimer(response['executionTime']);
      // Display results
      setGeneratedImages(response['generatedImgs']);
      // Set UI state
      setIsFetchingImgs(false);
    },
    [stopTimer, setGeneratedImages, setIsFetchingImgs],
  );

  const handleDalleError = useCallback(
    (error) => {
      console.log('Error querying DALL-E service.', error);
      if (error.message === 'Timeout') {
        setApiError(
          'Timeout querying DALL-E service (>1min). Consider reducing the images per query or use a stronger backend.',
        );
      } else {
        setApiError('Error querying DALL-E service. Check your backend server logs.');
      }
      setIsFetchingImgs(false);
      stopTimer();
    },
    [setApiError, setIsFetchingImgs, stopTimer],
  );

  const handleOnEnter = useCallback(() => {
    refetch();
    // runTimer();
    // setApiError('');
    // setIsFetchingImgs(true);

    // // Perform request
    // callDalleService(backendURL, queryString, imagesPerQuery)
    //   .then(handleDalleResponse)
    //   .catch(handleDalleError);
  }, [
    refetch,
    // runTimer,
    // setApiError,
    // backendURL,
    // handleDalleResponse,
    // handleDalleError,
    // imagesPerQuery,
    // setIsFetchingImgs,
    // queryString,
  ]);

  const showResults = generatedImages.length > 0 || apiError || isFetchingImgs;
  const showGallery = !apiError && !isFetchingImgs;

  return (
    <Container>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Header />
        </Grid>
        {!validatedBackendURL && (
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
                disabled={isFetchingImgs || !validatedBackendURL}
              />
              <ImagesPerQuerySelect isDisabled={isFetchingImgs} />
            </CardContent>
            <CardActions>
              <Button
                variant="contained"
                onClick={handleOnEnter}
                disabled={isDisabled}
                color="primary"
                fullWidth
              >
                Submit
              </Button>
            </CardActions>
          </Card>
          {queryTime !== 0 && (
            <Typography variant="body2" color="textSecondary" align="center">
              Query execution time: {queryTime} sec
            </Typography>
          )}
        </Grid>
        {!isLoading && !!data.length && <GeneratedImageList generatedImages={data} />}
        {showResults && (
          <Grid item xs={8} align="center">
            {showGallery && (
              <Typography variant="body1" color="textPrimary">
                Results for: "{queryString}"
              </Typography>
            )}
            {!!apiError && (
              <Typography variant="h5" color="error">
                {apiError}
              </Typography>
            )}
            {isFetchingImgs && (
              <LoadingSpinner searchTerm={queryString} isLoading={isFetchingImgs} />
            )}
            {showGallery && <GeneratedImageList generatedImages={generatedImages} />}
          </Grid>
        )}
      </Grid>
    </Container>
  );
};

App.displayName = 'App';

export default memo(App);
