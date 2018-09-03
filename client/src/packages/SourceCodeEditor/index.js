import React, { PureComponent, Fragment } from 'react';

import Splitter from 'm-react-splitters';

// Components
import Editor from './components/Editor';
import SideBar from './components/SideBar';
import ContextMenu from './components/SideBar/ContextMenu';

// Config
import { sampleFileStructure, mapExtToLang } from 'config';
import sampleFiles from 'config/sampleFiles';

// Styles
import './index.scss';

class SourceCodeEditor extends PureComponent {

  state = {
    updateLine: 0,
    anchorElOfOpenedContextMenu: null,
    contextMenuType: 'file',
    openFilePath: null,
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

  handleFileOpen = path =>
    this.setState({
      updateLine: +!this.state.updateLine,
      openFilePath: path,
    });

  preventDefaultContextMenuBehavior = ev => ev.preventDefault();

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
    const {
      openFilePath,
      anchorElOfOpenedContextMenu,
      contextMenuType,
    } = this.state;

    const language = openFilePath
      ? mapExtToLang[openFilePath.split('.').pop()]
      : 'python'; // TODO ::: Move to config as default programming language

    const value = openFilePath
      ? sampleFiles[openFilePath.split('/').pop()]
      : '';

    return (
      <Fragment>
        <div
          onContextMenu={this.preventDefaultContextMenuBehavior}
          className="file-manager"
        >
          <Splitter
            position="vertical"
            primaryPaneWidth="15%"
            primaryPaneMinWidth="0"
          >
            <SideBar
              handleFileOpen={this.handleFileOpen}
              handleFolderContextMenuOpen={this.handleFolderContextMenuOpen}
              handleFileContextMenuOpen={this.handleFileContextMenuOpen}
              data={sampleFileStructure}
              openFilePath={openFilePath}
            />
            <Editor
              className="code-editor"
              line={this.state.updateLine}
              value={value}
              language={language}
            />
          </Splitter>
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

SourceCodeEditor.propTypes = {
  // This component doesn't expect any props from outside (until nowadays)
};

export default SourceCodeEditor;
