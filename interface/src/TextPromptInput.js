import React from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import { TextField } from "@material-ui/core";

const useStyles = () => ({
    inputPrompt: {
        marginTop: '20px',
    },
})

const TextPromptInput = ({ classes, enterPressedCallback, disabled, promptText, setPromptText }) => {
    function handleTextPromptKeyPressed(event) {
        if (event.key === 'Enter') {
            enterPressedCallback(promptText)
        }
    }

    function onTextChanged(event) {
        setPromptText(event.target.value)
    }

    return (
        <TextField className={classes.inputPrompt} id="prompt-input" label="Text prompt"
            placeholder="e.g. an apple on a table" value={promptText}
            onChange={onTextChanged} fullWidth multiline
            onKeyPress={handleTextPromptKeyPressed} disabled={disabled} />
    )
}

export default withStyles(useStyles)(TextPromptInput);
