import React, {useState} from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import {TextField} from "@material-ui/core";

const useStyles = () => ({
  inputPrompt: {
    minWidth: '450px',
  },
})

const TextPromptInput = ({classes, enterPressedCallback, disabled}) => {
  const [promptText, setPromptText] = useState('');

  function handleTextPromptKeyPressed(event) {
    if (event.key === 'Enter') {
      enterPressedCallback(promptText)
    }
  }

  function onTextChanged(event) {
    setPromptText(event.target.value)
  }

  return (
    <TextField className={classes.inputPrompt} id="prompt-input" label="Text prompt" helperText="hit Enter to search"
               placeholder="e.g. an apple on a table" value={promptText} onChange={onTextChanged}
               onKeyPress={handleTextPromptKeyPressed} disabled={disabled}/>
  )
}

export default withStyles(useStyles)(TextPromptInput);