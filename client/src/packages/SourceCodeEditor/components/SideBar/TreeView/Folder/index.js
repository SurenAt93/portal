import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';

// Icons
import FolderIcon from '@material-ui/icons/Folder';
import FolderIconOpen from '@material-ui/icons/FolderOpen';

class Folder extends PureComponent {
  state = { open: false };

  handleClick = _ => this.setState(state => ({ open: !state.open }));

  render() {
    const { name, path, children, draw } = this.props;

    return (
      <Fragment>
        <ListItem
          button
          onContextMenu={this.props.onContextMenu}
          onClick={this.handleClick} className="files__item"
        >
          <div className="files__summary">
            <ListItemIcon>
              {
                this.state.open
                  ? <FolderIconOpen />
                  : <FolderIcon />
              }
            </ListItemIcon>
            <ListItemText primary={name}/>
          </div>
        </ListItem>
        {
          this.state.open && <div className="collapse">
            <List className="files__folder" dense={true}>
              {children.map(child => draw(child, path))}
            </List>
          </div>
        }
      </Fragment>
    );
  }
}

Folder.propTypes = {
  name: PropTypes.string.isRequired,
  path: PropTypes.string.isRequired,
  children: PropTypes.array.isRequired,
  draw: PropTypes.func.isRequired,
  onContextMenu: PropTypes.func.isRequired,
};

export default Folder;

