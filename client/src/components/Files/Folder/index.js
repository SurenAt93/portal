import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Collapse from '@material-ui/core/Collapse';

// Icons
import FolderIcon from '@material-ui/icons/Folder';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';

class Folder extends PureComponent {
  state = { open: false };

  handleClick = _ => this.setState(state => ({ open: !state.open }));

  render() {
    const { name, children, drow } = this.props;

    return (
      <Fragment>
        <ListItem button onClick={this.handleClick} className="files__item">
          <div className="files__summary">
            <ListItemIcon><FolderIcon /></ListItemIcon>
            <ListItemText primary={name}/>
            {
              this.state.open
                ? <ExpandLess className="u-white u-padding-top" />
                : <ExpandMore className="u-white u-padding-top" />
            }
          </div>
        </ListItem>
        <Collapse
          className="files__folder--collapse"
          in={this.state.open}
          timeout="auto"
          unmountOnExit
        >
          <List className="files__folder" dense={true}>
            {children.map(drow)}
          </List>
        </Collapse>
      </Fragment>
    );
  }
}

Folder.propTypes = {
  name: PropTypes.string.isRequired,
  children: PropTypes.array.isRequired,
  drow: PropTypes.func.isRequired,
};

export default Folder;
