import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import List from '@material-ui/core/List';

// Components
import File from './File';
import Folder from './Folder';

// Styles
import './index.scss';

class TreeView extends PureComponent {
  draw = (
    { name, children, open },
    parent,
    path = parent ? `${parent}${name}${children ? '/' : ''}` : name,
  ) => children
    ? <Folder
      key={path}
      path={path}
      name={name}
      open={open}
      children={children}
      draw={this.draw}
      onContextMenu={this.props.onFolderContextMenu}
      onToggle={this.props.onFolderToggle}
    />
    : <File
      onOpen={this.props.onFileOpen}
      key={path}
      path={path}
      name={name}
      open={this.props.openFilePath === path}
      onContextMenu={this.props.onFileContextMenu}
    />;

  render() {
    const { data } = this.props;

    return (
      <div className="files">
        {
          data
            ? (
              // TODO ::: This list should be virtualized
              <List dense={true}>
                {this.draw(data)}
              </List>
            )
            : 'Empty...'
        }
      </div>
    );
  }
}

TreeView.propTypes = {
  data: PropTypes.object,
  openFilePath: PropTypes.string,
  onFileOpen: PropTypes.func,
  onFolderToggle: PropTypes.func,
  onFolderContextMenu: PropTypes.func.isRequired,
  onFileContextMenu: PropTypes.func.isRequired,
};

TreeView.defaultProps = {
  handleFileOpen: _ => {},
};

export default TreeView;
