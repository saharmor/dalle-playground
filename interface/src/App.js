import React, { useState } from 'react';
import withStyles from "@material-ui/core/styles/withStyles";
import {
    Card, CardContent, FormControl, FormHelperText,
    InputLabel, MenuItem, Select, Typography
} from "@material-ui/core";
import { callDalleService } from "./backend_api";
import GeneratedImageList from "./GeneratedImageList";
import TextPromptInput from "./TextPromptInput";

import "./App.css";
import BackendUrlInput from "./BackendUrlInput";
import LoadingSpinner from "./LoadingSpinner";

const useStyles = () => ({
    root: {
        display: 'flex',
        width: '100%',
        flexDirection: 'column',
        margin: '60px 0px 60px 0px',
        alignItems: 'center',
        textAlign: 'center',
    },
    title: {
        marginBottom: '20px',
    },
    playgroundSection: {
        display: 'flex',
        flex: 1,
        width: '100%',
        alignItems: 'flex-start',
        justifyContent: 'center',
        marginTop: '20px',
    },
    settingsSection: {
        display: 'flex',
        flexDirection: 'column',
        padding: '1em',
        maxWidth: '300px',
    },
    searchQueryCard: {
        marginBottom: '20px'
    },
    imagesPerQueryControl: {
        marginTop: '20px',
    },
    formControl: {
        margin: "20px",
        minWidth: 120,
    },
    gallery: {
        display: 'flex',
        flex: '1',
        maxWidth: '50%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'flex-start',
        padding: '1rem',
    },
});


const App = ({ classes }) => {
    const [backendUrl, setBackendUrl] = useState('');
    const [isFetchingImgs, setIsFetchingImgs] = useState(false);
    const [isCheckingBackendEndpoint, setIsCheckingBackendEndpoint] = useState(false);
    const [isValidBackendEndpoint, setIsValidBackendEndpoint] = useState(true);
    const [generatedImages, setGeneratedImages] = useState([]);
    const [apiError, setApiError] = useState('')
    const [imagesPerQuery, setImagesPerQuery] = useState(2);
    const [queryTime, setQueryTime] = useState(0);

    const [promptText, setPromptText] = useState('');

    const imagesPerQueryOptions = 10
    const validBackendUrl = isValidBackendEndpoint && backendUrl

    function enterPressedCallback(promptText) {
        console.log('API call to DALL-E web service with the following prompt [' + promptText + ']');
        setApiError('')
        setIsFetchingImgs(true)
        callDalleService(backendUrl, promptText, imagesPerQuery).then((response) => {
            setQueryTime(response['executionTime'])
            setGeneratedImages(response['generatedImgs'])
            setIsFetchingImgs(false)
        }).catch((error) => {
            console.log('Error querying DALL-E service.', error)
            if (error.message === 'Timeout') {
                setApiError('Timeout querying DALL-E service (>1min). Consider reducing the images per query or use a stronger backend.')
            } else {
                setApiError('Error querying DALL-E service. Check your backend server logs.')
            }
            setIsFetchingImgs(false)
        })
    }

    function getGalleryContent() {
        if (apiError) {
            return <Typography variant="h5" color="error">{apiError}</Typography>
        }

        if (isFetchingImgs) {
            return <LoadingSpinner isLoading={isFetchingImgs} />
        }

        return <GeneratedImageList generatedImages={generatedImages} promptText={promptText} />
    }

    return (
        <div className={classes.root}>
            <div className={classes.title}>
                <Typography variant="h3">
                    DALL-E Playground <span role="img" aria-label="sparks-emoji">✨</span>
                </Typography>
            </div>

            {!validBackendUrl && <div>
                <Typography variant="body1" color="textSecondary">
                    Put your DALL-E backend URL to start
                </Typography>
            </div>}

            <div className={classes.playgroundSection}>
                <div className={classes.settingsSection}>
                    <Card className={classes.searchQueryCard}>
                        <CardContent>
                            <BackendUrlInput setBackendValidUrl={setBackendUrl}
                                isValidBackendEndpoint={isValidBackendEndpoint}
                                setIsValidBackendEndpoint={setIsValidBackendEndpoint}
                                setIsCheckingBackendEndpoint={setIsCheckingBackendEndpoint}
                                isCheckingBackendEndpoint={isCheckingBackendEndpoint}
                                disabled={isFetchingImgs} />
                            <TextPromptInput enterPressedCallback={enterPressedCallback} promptText={promptText} setPromptText={setPromptText}
                                disabled={isFetchingImgs || !validBackendUrl} />

                            <FormControl className={classes.imagesPerQueryControl}
                                variant="outlined">
                                <InputLabel id="images-per-query-label">
                                    Images to generate
                                </InputLabel>
                                <Select labelId="images-per-query-label"
                                        label="Images per text prompt" value={imagesPerQuery}
                                        disabled={isFetchingImgs}
                                        onChange={(event) => setImagesPerQuery(event.target.value)}>
                                    {Array.from(Array(imagesPerQueryOptions).keys()).map((num) => {
                                        return <MenuItem key={num + 1} value={num + 1}>
                                            {num + 1}
                                        </MenuItem>
                                    })}
                                </Select>
                                <FormHelperText>More images = More time to generate</FormHelperText>
                            </FormControl>
                        </CardContent>
                    </Card>
                    {queryTime !== 0 && <Typography variant="body2" color="textSecondary">
                        Generation execution time: {queryTime} sec
                    </Typography>}
                </div>
                {(generatedImages.length > 0 || apiError || isFetchingImgs) &&
                    <div className={classes.gallery}>
                        {getGalleryContent()}
                    </div>
                }
            </div>
        </div>
    )
}

export default withStyles(useStyles)(App);
