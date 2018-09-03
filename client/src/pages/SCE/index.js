import React, { PureComponent } from 'react';

import SourceCodeEditor from 'packages/SourceCodeEditor';

const sceStyles = { width: '100%', height: '100%' };

class SCE extends PureComponent {
  render() {
    return <div style={sceStyles}><SourceCodeEditor /></div>
  }
}

export default SCE;
