import React from 'react';

import List from '@material-ui/core/List';
import ListItemText from '@material-ui/core/ListItemText';

import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';

// Icons
import ListItemIcon from '@material-ui/core/ListItemIcon';
import FolderIcon from '@material-ui/icons/Folder';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

const Folder = ({ name, children, drow }) => (
  <ExpansionPanel>
    <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
      <ListItemIcon><FolderIcon /></ListItemIcon>
      <ListItemText primary={name}/>
    </ExpansionPanelSummary>
    <ExpansionPanelDetails>
      <List className="files__folder" dense={true}>
        {children.map(drow)}
      </List>
    </ExpansionPanelDetails>
  </ExpansionPanel>
);

export default Folder;
