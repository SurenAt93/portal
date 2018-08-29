import React, { Fragment } from 'react';

import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

// Icons
import FileIcon from '@material-ui/icons/Notes';

const File = ({ name }) => (
  <Fragment>
    <ListItemIcon><FileIcon /></ListItemIcon>
    <ListItemText primary={name}/>
  </Fragment>
);

export default File;
