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
    { name, children },
    parent,
    path = parent ? `${parent}${name}${children ? '/' : ''}` : name,
  ) => children
    ? <Folder
      key={path}
      path={path}
      name={name}
      children={[...children].sort((a, b) => +!a.children - +!b.children)}
      draw={this.draw}
      onContextMenu={this.props.onFolderContextMenu}
    />
    : <File
      handleFileOpen={this.props.handleFileOpen}
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
  handleFileOpen: PropTypes.func,
  onFolderContextMenu: PropTypes.func.isRequired,
  onFileContextMenu: PropTypes.func.isRequired,
};

TreeView.defaultProps = {
  handleFileOpen: _ => {},
};

export default TreeView;
