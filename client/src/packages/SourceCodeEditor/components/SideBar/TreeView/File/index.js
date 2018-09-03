import React from 'react';
import PropTypes from 'prop-types';

import Button from '@material-ui/core/Button';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

import classNames from 'classnames';

// Icons
import FileIcon from '@material-ui/icons/Notes';

const File = ({ name, handleFileOpen, onContextMenu, open, path }) => (
  <ListItem className="files__item file">
    <div className="files__summary">
      <ListItemIcon><FileIcon /></ListItemIcon>
      <Button
        onContextMenu={onContextMenu}
        onClick={_ => handleFileOpen(path)}
        className={classNames({ 'files__file--open': open })}
      >
        <ListItemText primary={name}/>
      </Button>
    </div>
  </ListItem>
);

File.propTypes = {
  name: PropTypes.string.isRequired,
  path: PropTypes.string.isRequired,
  open: PropTypes.bool,
  handleFileOpen: PropTypes.func,
  onContextMenu: PropTypes.func.isRequired,
};

File.defaultProps = {
  handleFileOpen: _ => {},
  open: false,
};

export default File;
