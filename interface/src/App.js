import React, { useState } from 'react';
import withStyles from "@material-ui/core/styles/withStyles";
import {
    Card, CardContent, Checkbox, FormControl, FormHelperText,
    InputLabel, MenuItem, Select, Typography
} from "@material-ui/core";
import { callDalleService } from "./backend_api";
import GeneratedImageList from "./GeneratedImageList";
import TextPromptInput from "./TextPromptInput";

import "./App.css";
import BackendUrlInput from "./BackendUrlInput";
import LoadingSpinner from "./LoadingSpinner";
import NotificationCheckbox from './NotificationCheckbox';

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

const NOTIFICATION_ICON = "https://camo.githubusercontent.com/95d3eed25e464b300d56e93644a26c8236a19e04572cf83a95c9d68f8126be83/68747470733a2f2f656d6f6a6970656469612d75732e73332e6475616c737461636b2e75732d776573742d312e616d617a6f6e6177732e636f6d2f7468756d62732f3234302f6170706c652f3238352f776f6d616e2d6172746973745f31663436392d323030642d31663361382e706e67";

const App = ({ classes }) => {
    const [backendUrl, setBackendUrl] = useState('');
    const [promptText, setPromptText] = useState('');
    const [isFetchingImgs, setIsFetchingImgs] = useState(false);
    const [isCheckingBackendEndpoint, setIsCheckingBackendEndpoint] = useState(false);
    const [isValidBackendEndpoint, setIsValidBackendEndpoint] = useState(true);
    const [notificationsOn, setNotificationsOn] = useState(false);

    const [generatedImages, setGeneratedImages] = useState([]);
    const [generatedImagesFormat, setGeneratedImagesFormat] = useState('jpeg');

    const [apiError, setApiError] = useState('')
    const [imagesPerQuery, setImagesPerQuery] = useState(2);
    const [queryTime, setQueryTime] = useState(0);

    const imagesPerQueryOptions = 10
    const validBackendUrl = isValidBackendEndpoint && backendUrl

    function enterPressedCallback(promptText) {
        console.log('API call to DALL-E web service with the following prompt [' + promptText + ']');
        setApiError('')
        setIsFetchingImgs(true)
        callDalleService(backendUrl, promptText, imagesPerQuery).then((response) => {
            setQueryTime(response['executionTime'])
            setGeneratedImages(response['serverResponse']['generatedImgs'])
            setGeneratedImagesFormat(response['serverResponse']['generatedImgsFormat'])
            setIsFetchingImgs(false)

            if (notificationsOn) {
                new Notification(
                    "Your DALL-E image generation is finished!",
                    {
                        body: `Your image generation for "${promptText}" is finished!`,
                        icon: NOTIFICATION_ICON,
                    },
                )
            }
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

        return <GeneratedImageList generatedImages={generatedImages} generatedImagesFormat={generatedImagesFormat} promptText={promptText} />
    }

    function NotificationCheckbox() {
        // Check if the browser doesn't support notifications
        if (!("Notification" in window)) {
            console.log("This browser does not support notifications.");
            return null;
        }

        const handleCheckboxChange = (e, checkboxValue) => {
            if (!notificationsOn) {
                Notification.requestPermission().then(permission => {
                    if (permission === "granted") {
                        setNotificationsOn(true);
                        console.debug("Notifications have been turned on");
                    }
                });
            } else {
                setNotificationsOn(false);
                console.debug("Notifications have been turned off");
            }
        };

        return <div>
            <Typography variant="caption" color="textSecondary">
                <Checkbox
                    label="Notify me when images are generated"
                    checked={notificationsOn}
                    onChange={handleCheckboxChange}
                />
                Notify me when images are generated
            </Typography>
        </div>;
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

                            {/* <NotificationCheckbox isNotificationOn={notificationsOn} setNotifications={setNotificationsOn}/> */}

                            <TextPromptInput enterPressedCallback={enterPressedCallback}
                                             disabled={isFetchingImgs || !validBackendUrl}/>
                            <NotificationCheckbox />

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
