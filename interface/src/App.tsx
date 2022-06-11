import React, { memo, useCallback, useContext, useRef, useState } from 'react';
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

import { callDalleService } from 'api/backend_api';
import BackendUrlInput from 'components/BackendUrlInput';
import ImagesPerQuerySelect from 'components/Form/ImagesPerQuerySelect';
import GeneratedImageList from 'components/GeneratedImageList';
import Header from 'components/Layout/Header';
import LoadingSpinner from 'components/LoadingSpinner';
import TextPromptInput from 'components/TextPromptInput';
import { FormContext } from 'contexts/FormContext';

const getDalle = async ({ url, query, limit }) => {
  const { generatedImgs } = await callDalleService(url, query, limit);
  return generatedImgs;
};

const useTimer = (initialTime = 0) => {
  const [queryTime, setQueryTime] = useState(initialTime);

  const timer = useRef(null);

  const startTimer = useCallback(() => {
    let time = 0;
    timer.current = setInterval(() => {
      time = time + 100 / 1000;
      setQueryTime(parseInt(time.toFixed(2)));
    }, 100);
  }, [timer, setQueryTime]);

  const stopTimer = useCallback(
    (finalTime = 0) => {
      clearInterval(timer.current);
      setQueryTime(finalTime);
    },
    [timer, setQueryTime],
  );

  return {
    startTimer,
    stopTimer,
    currentTime: queryTime,
  };
};

const App = () => {
  const { backendURL, queryString, validatedBackendURL, isValidURL, imagesPerQuery } =
    useContext(FormContext);

  const { startTimer, stopTimer, currentTime: queryTime } = useTimer();

  const { data, isLoading, isSuccess, refetch, isError } = useQuery(
    ['DALLE', backendURL, queryString, imagesPerQuery],
    () => {
      startTimer();
      setApiError('');
      setIsFetchingImgs(true);
      return getDalle({
        url: backendURL,
        query: queryString,
        limit: imagesPerQuery,
      });
    },
    {
      onSettled: () => {
        stopTimer();
      },
      onSuccess: (response: any) => {
        // Stop timer
        stopTimer(response['executionTime']);
        // Display results
        setGeneratedImages(response['generatedImgs']);
        // Set UI state
        setIsFetchingImgs(false);
      },
      onError: (error: any) => {
        window.console.log('Error querying DALL-E service.', error);
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
    },
  );

  const [isFetchingImgs, setIsFetchingImgs] = useState(false);
  const [apiError, setApiError] = useState('');
  const [generatedImages, setGeneratedImages] = useState([]);

  const handleOnEnter = useCallback(() => refetch(), [refetch]);

  const disableBackendURL = isLoading;
  const disableQueryString = disableBackendURL || !isValidURL;
  const disablePerQuerySelect = disableQueryString || !queryString;
  const disableSubmit = [disableBackendURL, disableQueryString, disablePerQuerySelect].includes(
    true,
  );

  const showError = isError && !!apiError;
  const showResults = isSuccess && generatedImages.length > 0;
  const showGallery = !isLoading && (showError || showResults);

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
              <BackendUrlInput isDisabled={disableBackendURL} />
              <TextPromptInput onEnter={handleOnEnter} isDisabled={disableQueryString} />
              <ImagesPerQuerySelect isDisabled={disablePerQuerySelect} />
            </CardContent>
            <CardActions>
              <Button
                variant="contained"
                onClick={handleOnEnter}
                disabled={disableSubmit}
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
          <Grid item xs={8}>
            {showGallery && (
              <Typography variant="body1" color="textPrimary">
                Results for: &lquot;{queryString}&ldquot;
              </Typography>
            )}
            {showError && (
              <Typography variant="h5" color="error">
                {apiError}
              </Typography>
            )}
            {isFetchingImgs && <LoadingSpinner />}
            {showGallery && <GeneratedImageList generatedImages={generatedImages} />}
          </Grid>
        )}
      </Grid>
    </Container>
  );
};

export default memo(App);
