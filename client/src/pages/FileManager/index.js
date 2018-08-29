import React, { PureComponent } from 'react';

import Splitter from 'm-react-splitters';

// Components
import CodeEditor from 'components/CodeEditor';
import Files from 'components/Files';

// Config
import { sampleFileStructure, mapExtToLang } from 'config';
import sampleFiles from 'config/sampleFiles';

// Styles
import './index.scss';

class FileManager extends PureComponent {

  state = { currentFileName: null, updateLine: 0 };

  handleFileOpen = name =>
    this.setState({ currentFileName: name, updateLine: +!this.state.updateLine });

  render() {
    const { currentFileName } = this.state;

    const language = currentFileName
      ? mapExtToLang[currentFileName.split('.')[1]]
      : 'html';

    const value = currentFileName
      ? sampleFiles[currentFileName]
      : '';

    return (
      <div className="file-manager">
        <Splitter
          position="vertical"
          primaryPaneWidth="15%"
          primaryPaneMinWidth="0"
        >
          <Files
            handleFileOpen={this.handleFileOpen}
            data={sampleFileStructure}
          />
          <CodeEditor
            className="code-editor"
            line={this.state.updateLine}
            value={value}
            language={language}
          />
        </Splitter>
      </div>
    );
  }
}

FileManager.propTypes = {
  // This component doesn't expect any props from outside (until nowadays)
};

export default FileManager;
