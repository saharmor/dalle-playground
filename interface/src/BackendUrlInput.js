import React, {useEffect, useState} from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import {Grid, TextField} from "@material-ui/core";
import {isValidURL} from "./utils";
import {PulseLoader} from "react-spinners";
import qs from "qs";

const useStyles = () => ({
  inputBackend: {
    minWidth: '220px',
  },
  loadingSpinner: {
    paddingTop: '20px !important',
  }
})

const BackendUrlInput = ({classes, setBackendValidUrl, setBackendInvalidUrl, isLoadingModels}) => {
  const [backendUrl, setBackendUrl] = useState('');

  useEffect(() => {
    const qsBackendUrl = qs.parse(window.location.search, {ignoreQueryPrefix: true}).backendUrl
    if (qsBackendUrl) {
      onChange(qsBackendUrl)
    }
  }, [setBackendUrl])

  function onChange(newBackendUrl) {
    setBackendUrl(newBackendUrl)
    if (isValidURL(newBackendUrl)) {
      setBackendValidUrl(newBackendUrl)
    } else {
      setBackendInvalidUrl()
    }
  }

  return (
    <Grid container spacing={1} alignContent="center">
      <Grid item>
        <TextField className={classes.inputBackend} id="standard-basic" label="Backend URL" value={backendUrl}
                   onChange={(event) => onChange(event.target.value)}/>
      </Grid>
      <Grid item className={classes.loadingSpinner}>
        <PulseLoader sizeUnit={"px"} size={5} color="purple" loading={isLoadingModels}/>
      </Grid>
    </Grid>
  )
}

export default withStyles(useStyles)(BackendUrlInput);
