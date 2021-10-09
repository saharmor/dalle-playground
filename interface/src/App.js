import React, {useState} from 'react';
import withStyles from "@material-ui/core/styles/withStyles";
import {Card, CardContent, Typography} from "@material-ui/core";
import {callDalleService} from "./backend_api";
import GeneratedImageList from "./GeneratedImageList";
import TextPromptInput from "./TextPromptInput";

import "./App.css";
import BackendUrlInput from "./BackendUrlInput";
import LoadingSpinner from "./LoadingSpinner";

const useStyles = () => ({
    root: {
        display: 'flex',
        flex: '1',
        flexDirection: 'column',
        margin: '60px 0px 60px 0px',
        alignItems: 'center',
        textAlign: 'center',
    },
    title: {
        marginBottom: '20px',
    },
    subtitle: {
        marginBottom: '30px',
    },
    playgroundSection: {
        display: 'flex',
        flex: 1,
        width: '90%'
    },
    settingsSection: {
        display: 'flex',
        flexDirection: 'column',
        padding: '1em',
        maxWidth: '320px',
    },
    searchQueryCard: {
        marginBottom: '20px'
    },
    gallery: {
        display: 'flex',
        flex: '1',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '1rem',
    },
});


const App = ({classes}) => {
    const [backendUrl, setBackendUrl] = useState('');
    const [isFetchingImgs, setIsFetchingImgs] = useState(false);
    const [isCheckingBackendEndpoint, setIsCheckingBackendEndpoint] = useState(false);
    const [isValidBackendEndpoint, setIsValidBackendEndpoint] = useState(true);
    const [generatedImages, setGeneratedImages] = useState([]);
    const [apiError, setApiError] = useState('')
    const maxImagesPerQuery = 4;

    const validBackendUrl = isValidBackendEndpoint && backendUrl

    function enterPressedCallback(promptText) {
        console.log('API call to DALL-E web service with the following prompt [' + promptText + ']');
        setApiError('')
        setIsFetchingImgs(true)
        callDalleService(backendUrl, promptText, maxImagesPerQuery).then((generatedImgs) => {
            setGeneratedImages(generatedImgs)
            setIsFetchingImgs(false)
        }).catch((error) => {
            setIsFetchingImgs(false)
            console.log('Error querying DALL-E service.', error)
            setApiError('Error querying DALL-E service. Check your backend server logs.')
        })
    }

    function getGalleryContent() {
        if (apiError) {
            return <Typography variant="h5" color="error">{apiError}</Typography>
        }

        if (isFetchingImgs) {
            return <LoadingSpinner isLoading={isFetchingImgs}/>
        }

        return <GeneratedImageList generatedImages={generatedImages}/>
    }

    return (
        <div className={classes.root}>
            <div className={classes.title}>
                <Typography variant="h3">
                    DALL-E Playground <span role="img" aria-label="sparks-emoji">✨</span>
                </Typography>
            </div>

            {!validBackendUrl && <div className={classes.subtitle}>
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
                                             isCheckingBackendEndpoint={isCheckingBackendEndpoint}/>
                            <TextPromptInput enterPressedCallback={enterPressedCallback}
                                             disabled={isFetchingImgs || !validBackendUrl}/>
                        </CardContent>
                    </Card>
                </div>
                <div className={classes.gallery}>
                    {getGalleryContent()}
                </div>
            </div>
        </div>
    )
}

export default withStyles(useStyles)(App);
