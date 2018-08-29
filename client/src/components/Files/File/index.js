import React from 'react';

import Button from '@material-ui/core/Button';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

// Icons
import FileIcon from '@material-ui/icons/Notes';

const File = ({ name, handleFileOpen }) => (
  <ListItem className="files__item">
    <div className="files__summary">
      <ListItemIcon><FileIcon /></ListItemIcon>
      <Button onClick={_ => handleFileOpen(name)}><ListItemText primary={name}/></Button>
    </div>
  </ListItem>
);

export default File;
