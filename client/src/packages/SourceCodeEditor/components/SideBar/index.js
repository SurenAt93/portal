import React, { PureComponent, Fragment } from 'react';

import TreeView from './TreeView';
import ContextMenu from './ContextMenu';

const sideBarStyles = { width: '100%', height: '100%' };

class SideBar extends PureComponent {

  state = {
    anchorElOfOpenedContextMenu: null,
    contextMenuType: 'file',
  };

  // NOTE ::: It's just for demo and should be removed
  commonItems = [
    {
      name: 'Rename',
      action: _ => console.log('Log ::: You want to rename it') &
        this.handleCloseContextMenu(),
    },
    {
      name: 'Remove',
      action: _ => console.log('Log ::: You want to remove it') &
        this.handleCloseContextMenu(),
    },
    {
      name: 'Cut',
      action: _ => console.log('Log ::: You want to cut it') &
        this.handleCloseContextMenu(),
    },
    {
      name: 'Copy',
      action: _ => console.log('Log ::: You want to copy it') &
        this.handleCloseContextMenu(),
    },
    {
      name: 'Copy Name',
      action: _ => console.log('Log ::: You want to copy name of it') &
        this.handleCloseContextMenu(),
    },
    {
      name: 'Copy Path',
      action: _ => console.log('Log ::: You want to copy path of it') &
        this.handleCloseContextMenu(),
    },
  ];

  contextMenuItems = {
    'file': [...this.commonItems, ...[{
      name: 'Copy as Text',
      action: _ => console.log('Log ::: You want to copy as text it') &
        this.handleCloseContextMenu(),
    }]],

    'folder': [...this.commonItems],
  };

  handleContextMenuOpen = (type, target) => this.setState({
    anchorElOfOpenedContextMenu: target,
    contextMenuType: type,
  });

  handleFolderContextMenuOpen = ({ currentTarget }) =>
    this.handleContextMenuOpen('folder', currentTarget);

  handleFileContextMenuOpen = ({ currentTarget }) =>
    this.handleContextMenuOpen('file', currentTarget);

  handleCloseContextMenu = _ => this.setState({ anchorElOfOpenedContextMenu: null });

  render() {
    const { anchorElOfOpenedContextMenu, contextMenuType } = this.state;

    return (
      <Fragment>
        <div style={sideBarStyles}>
          <TreeView 
            {...this.props}
            onFolderContextMenu={this.handleFolderContextMenuOpen}
            onFileContextMenu={this.handleFileContextMenuOpen}
          />
        </div>
        <ContextMenu
          anchorEl={anchorElOfOpenedContextMenu}
          menuItems={this.contextMenuItems[contextMenuType]}
          handleClose={this.handleCloseContextMenu}
        />
      </Fragment>
    );
  }
}

export default SideBar;
