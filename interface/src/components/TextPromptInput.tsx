import React, { useCallback, useContext, FC, memo, KeyboardEvent } from 'react';

import { TextField } from '@material-ui/core';

import MyFormContext from '../contexts/FormHandling';

type Props = {
  onEnter: () => void;
  isDisabled: boolean;
};

const TextPromptInput: FC<Props> = ({ onEnter, isDisabled }) => {
  const { queryString, setQueryString } = useContext(MyFormContext);

  const handleOnInput = useCallback(
    (event: KeyboardEvent<HTMLInputElement>) =>
      setQueryString((event.target as HTMLInputElement).value as string),
    [setQueryString],
  );

  const handleOnKeyPress = useCallback(
    (event: KeyboardEvent<HTMLInputElement>) => {
      if (event.key === 'Enter') {
        onEnter();
      }
    },
    [onEnter],
  );

  return (
    <TextField
      value={queryString}
      onInput={handleOnInput}
      onKeyPress={handleOnKeyPress}
      disabled={isDisabled}
      id="prompt-input"
      label="Text prompt"
      helperText="hit Enter to generate images"
      placeholder="e.g. an apple on a table"
      fullWidth
    />
  );
};

TextPromptInput.displayName = 'TextPromptInput';

export default memo(TextPromptInput);
