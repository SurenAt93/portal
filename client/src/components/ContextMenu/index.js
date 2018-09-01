import React from 'react';
import PropTypes from 'prop-types';

import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

import './index.scss';

const contextMenuClasses = { paper: 'context-menu__paper' };

const ContextMenu = ({ anchorEl, menuItems, handleClose }) => (
  <Menu
    anchorEl={anchorEl}
    open={Boolean(anchorEl)}
    onClose={handleClose}
    PopoverClasses={contextMenuClasses}
  >
    {
      menuItems.map(
        ({ name, action }) => <MenuItem key={name} onClick={action}>{name}</MenuItem>
      )
    }
  </Menu>
);

ContextMenu.propTypes = {
  anchorEl: PropTypes.object,
  menuItems: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
    action: PropTypes.func.isRequired,
  })),
  handleClose: PropTypes.func,
};

ContextMenu.defaultProps = {
  menuItems: [],
};

export default ContextMenu;
