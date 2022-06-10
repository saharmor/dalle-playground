import React, { FC, useCallback, useContext } from 'react';

import { FormControl, FormHelperText, InputLabel, MenuItem, Select } from '@material-ui/core';

import { FormContext } from 'contexts/FormContext';

import { DEFAULT_MAX_IMAGES_PER_QUERY_OPTIONS } from '../utils.js';

type Props = {
  isDisabled: boolean;
};

const ImagesPerQuerySelect: FC<Props> = ({ isDisabled }) => {
  const { imagesPerQuery, setImagesPerQuery } = useContext(FormContext);

  const options = Array.from(Array(DEFAULT_MAX_IMAGES_PER_QUERY_OPTIONS).keys());

  const handleOnChange = useCallback(
    (newQueryLimit: string) => setImagesPerQuery(parseInt(newQueryLimit)),
    [setImagesPerQuery],
  );

  return (
    <FormControl fullWidth>
      <InputLabel id="images-per-query-label">Images to generate</InputLabel>
      <Select
        labelId="images-per-query-label"
        label="Images per query"
        value={imagesPerQuery}
        onChange={(evt) => handleOnChange(evt.target.value as string)}
        disabled={isDisabled}
      >
        {options.map((num) => {
          return (
            <MenuItem key={num + 1} value={num + 1}>
              {num + 1}
            </MenuItem>
          );
        })}
      </Select>
      <FormHelperText>More images = slower query</FormHelperText>
    </FormControl>
  );
};

ImagesPerQuerySelect.displayName = 'ImagesPerQuerySelect';

export default ImagesPerQuerySelect;
