import React, { PureComponent, Fragment } from 'react';

import Splitter from 'm-react-splitters';

// Components
import Editor from './components/Editor';
import SideBar from './components/SideBar';
import StatusBar from './components/StatusBar';

// Config
import { sampleFileStructure, mapExtToLang } from 'config';
import sampleFiles from 'config/sampleFiles';

// Styles
import './index.scss';

class SourceCodeEditor extends PureComponent {

  state = {
    updateLine: 0,
    openFilePath: null,
  };

  handleFileOpen = path =>
    this.setState({
      updateLine: +!this.state.updateLine,
      openFilePath: path,
    });

  preventDefaultContextMenuBehavior = ev => ev.preventDefault();

  render() {
    const {
      openFilePath,
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
          className="source-code-editor fb"
        >
          <Splitter
            position="horizontal"
            primaryPaneMaxHeight="100%"
            primaryPaneMinHeight="50%"
            primaryPaneHeight="95%"
          >
            <Splitter
              position="vertical"
              primaryPaneWidth="15%"
              primaryPaneMinWidth="0"
            >
              <SideBar
                handleFileOpen={this.handleFileOpen}
                data={sampleFileStructure}
                openFilePath={openFilePath}
              />
              <Editor
                className="fb"
                line={this.state.updateLine}
                value={value}
                language={language}
              />
            </Splitter>
            <StatusBar />
          </Splitter>
        </div>
      </Fragment>
    );
  }
}

SourceCodeEditor.propTypes = {
  // This component doesn't expect any props from outside (until nowadays)
};

export default SourceCodeEditor;
