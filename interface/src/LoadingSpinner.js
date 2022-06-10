import {PulseLoader} from "react-spinners";
import {Typography} from "@material-ui/core";
import React, {useEffect, useState} from "react";
import withStyles from "@material-ui/core/styles/withStyles";

const useStyles = () => ({
    root: {
        display: 'flex',
        flexDirection: 'column',
        textAlign: 'center',
        marginTop: '80px',
    },
    loadingText: {
        paddingTop: '20px',
    }
});

const processingSteps = ['Generating images 👨🏽‍🎨', 'Doing fancy calculations ✨'];

const LoadingSpinner = ({classes, isLoading}) => {
    const [textIdx, setTextIdx] = useState(0);

    useEffect(() => {
        const intervalID = setTimeout(() => {
            let currentIdx = textIdx;
            if (currentIdx + 1 < processingSteps.length) {
                setTextIdx(currentIdx + 1)
            }

        }, 10000);

        return () => clearInterval(intervalID);
    }, []);

    const loadingText = processingSteps[textIdx % processingSteps.length];
    return (
        <div className={classes.root}>
            <PulseLoader sizeUnit={"px"} size={20} color="purple" loading={isLoading}/>
            <Typography className={classes.loadingText} variant={"h6"}>{loadingText}</Typography>
        </div>
    )
}

export default withStyles(useStyles)(LoadingSpinner)
