import React from 'react';

import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

// Icons
import FileIcon from '@material-ui/icons/Notes';

const File = ({ name }) => (
  <ListItem className="files__item">
    <div className="files__summary">
      <ListItemIcon><FileIcon /></ListItemIcon>
      <ListItemText primary={name}/>
    </div>
  </ListItem>
);

export default File;
