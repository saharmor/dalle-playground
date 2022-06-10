import React, { FC } from 'react';

import { Typography } from '@material-ui/core';

const Header: FC = () => {
  return (
    <Typography variant="h3" color="textPrimary" component="h1">
      DALL-E Playground
    </Typography>
  );
};

Header.displayName = 'Header';

export default Header;
