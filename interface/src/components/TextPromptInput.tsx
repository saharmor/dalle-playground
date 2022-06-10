import React, { FC, useState } from 'react';
import { TextField, createStyles } from '@material-ui/core';
import withStyles, { WithStyles } from '@material-ui/core/styles/withStyles';
const useStyles = () =>
  createStyles({
    inputPrompt: {
      marginTop: '20px',
    },
  });

interface Props extends WithStyles<typeof useStyles> {
  enterPressedCallback: (query: string) => void;
  disabled: boolean;
}

const TextPromptInput: FC<Props> = ({ classes, enterPressedCallback, disabled }) => {
  const [promptText, setPromptText] = useState('');

  function handleTextPromptKeyPressed(event: any) {
    if (event.key === 'Enter') {
      enterPressedCallback(promptText);
    }
  }

  function onTextChanged(event: any) {
    setPromptText(event.target.value);
  }

  return (
    <TextField
      className={classes.inputPrompt}
      id="prompt-input"
      label="Text prompt"
      helperText="hit Enter to generate images"
      placeholder="e.g. an apple on a table"
      value={promptText}
      onChange={onTextChanged}
      fullWidth
      onKeyPress={handleTextPromptKeyPressed}
      disabled={disabled}
    />
  );
};

export default withStyles(useStyles)(TextPromptInput);
