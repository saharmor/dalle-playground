import {MenuItem, TextField} from "@material-ui/core";
import withStyles from "@material-ui/core/styles/withStyles";
import React from "react";

const useStyles = () => ({
  inputModel: {
    minWidth: '100px',
    marginTop: '20px',
  }
});


const AvailableModelsInput = ({classes, models, selectedModel, onModelSelected, disabled}) => {
  return (
    <TextField className={classes.inputModel} id="models-input" select label="Models" value={selectedModel}
               onChange={onModelSelected} helperText="Pre-trained model to use" disabled={disabled}>
      {models && models.map((model) => {
        return <MenuItem key={model} value={model}>{model}</MenuItem>
      })}></TextField>
  )
}

export default withStyles(useStyles)(AvailableModelsInput);
