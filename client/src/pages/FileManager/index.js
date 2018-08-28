import React, { PureComponent } from 'react';

// Components
import CodeEditor from 'components/CodeEditor';

import './index.scss';

class FileManager extends PureComponent {
  render() {
    return (
      <div className="file-manager">
        <CodeEditor />
      </div>
    );
  }
}

export default FileManager;
