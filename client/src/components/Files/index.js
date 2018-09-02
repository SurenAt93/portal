import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import List from '@material-ui/core/List';

// Components
import File from './File';
import Folder from './Folder';

// Styles
import './index.scss';

class Files extends PureComponent {
  drow = (
    { name, children },
    parent,
    path = parent ? `${parent}${name}${children ? '/' : ''}` : name,
  ) => children
    ? <Folder
      key={path}
      path={path}
      name={name}
      children={[...children].sort((a, b) => +!a.children - +!b.children)}
      drow={this.drow}
      handleContextMenuOpen={this.props.handleFolderContextMenuOpen}
    />
    : <File
      handleFileOpen={this.props.handleFileOpen}
      key={path}
      path={path}
      name={name}
      open={this.props.openFilePath === path}
      handleContextMenuOpen={this.props.handleFileContextMenuOpen}
    />;

  render() {
    const { data } = this.props;

    return (
      <div className="files">
        {
          data
            ? (
              <List dense={true}>
                {this.drow(data)}
              </List>
            )
            : 'Empty...'
        }
      </div>
    );
  }
}

Files.propTypes = {
  data: PropTypes.object,
  openFilePath: PropTypes.string,
  handleFileOpen: PropTypes.func,
  handleFolderContextMenuOpen: PropTypes.func.isRequired,
  handleFileContextMenuOpen: PropTypes.func.isRequired,
};

Files.defaultProps = {
  handleFileOpen: _ => {},
};

export default Files;
