import React, { PureComponent } from 'react';

import Splitter from 'm-react-splitters';

// Components
import CodeEditor from 'components/CodeEditor';
import Files from 'components/Files';

import { sampleFileStructure, mapExtToLang } from 'config';
import sampleFiles from 'config/sampleFiles';

import './index.scss';

class FileManager extends PureComponent {

  state = { currentFileName: null, updateLine: 0 };

  handleFileOpen = name =>
    this.setState({ currentFileName: name, updateLine: !this.state.updateLine });

  render() {
    return (
      <div className="file-manager">
        <Splitter
          position="vertical"
          primaryPaneWidth="15%"
          primaryPaneMinWidth="0"
        >
          <Files handleFileOpen={this.handleFileOpen} data={sampleFileStructure} />
          <CodeEditor
            className="code-editor"
            line={this.state.updateLine}
            value={this.state.currentFileName ? sampleFiles[this.state.currentFileName] : ''}
            language={this.state.currentFileName ? mapExtToLang[this.state.currentFileName.split('.')[1]] : 'html'}
          />
        </Splitter>
      </div>
    );
  }
}

export default FileManager;
