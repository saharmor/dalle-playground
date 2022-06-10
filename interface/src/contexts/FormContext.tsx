import React, { createContext, FC, useState } from 'react';

import { DEFAULT_BACKEND_URL, DEFAULT_QUERY_STRING, DEFAULT_IMAGES_PER_QUERY } from 'utils';

type ProviderProps = {
  backendURL: string;
  setBackendURL: (url: string) => void;
  queryString: string;
  setQueryString: (url: string) => void;
  isValidURL: boolean;
  setIsValidURL: (isValid: boolean) => void;
  validatedBackendURL: boolean | string;
  imagesPerQuery: number;
  setImagesPerQuery: (limit: number) => void;
};

// Create context
const FormContext = createContext<ProviderProps>({} as ProviderProps);
FormContext.displayName = 'FormContext';

const FormContextProvider: FC<{
  children?: JSX.Element;
}> = ({ children }) => {
  const [backendURL, setBackendURL] = useState<string>(DEFAULT_BACKEND_URL);
  const [imagesPerQuery, setImagesPerQuery] = useState(DEFAULT_IMAGES_PER_QUERY);
  const [queryString, setQueryString] = useState<string>(DEFAULT_QUERY_STRING);

  const [isValidURL, setIsValidURL] = useState(false);

  const value = {
    queryString,
    setQueryString,
    backendURL,
    setBackendURL,
    isValidURL,
    setIsValidURL,
    validatedBackendURL: isValidURL && backendURL,
    imagesPerQuery,
    setImagesPerQuery,
  };

  return <FormContext.Provider value={value}>{children}</FormContext.Provider>;
};

FormContextProvider.displayName = 'FormContextProvider';

export { FormContextProvider, FormContext };
