import React, { PureComponent } from 'react';

import Splitter from 'm-react-splitters';

// Components
import CodeEditor from 'components/CodeEditor';
import Files from 'components/Files';

import './index.scss';

const data = {
  name: 'root',
  toggled: true,
  children: [
    {
      name: 'parent',
      children: [
        { name: 'child1' },
        { name: 'child2' },
        { name: 'child3' },
        { name: 'child3' },
        { name: 'child3' },
        { name: 'child3' },
        { name: 'child3' },
        { name: 'child3' },
        { name: 'child3' },
        { name: 'child3' },
        { name: 'child3' },
        { name: 'child3' },
        { name: 'child3' },
        { name: 'child3' },
        { name: 'child3' },
        { name: 'child3' },
        { name: 'child3' },
      ]
    },
    {
      name: 'loading parent',
      loading: true,
      children: []
    },
    {
      name: 'parent',
      children: [
          {
            name: 'nested parent',
            children: [
              { name: 'nested child 1' },
              { name: 'nested child 2' },
              { name: 'nested child 2' },
              { name: 'nested child 2' },
              { name: 'nested child 2' },
              { name: 'nested child 2' },
              { name: 'nested child 2' },
              { name: 'nested child 2' },
              { name: 'nested child 2' },
              { name: 'nested child 2' },
              { name: 'nested child 2' },
              { name: 'nested child 2' },
              { name: 'nested child 2' },
              { name: 'nested child 2' },
            ],
          },
      ],
    },
  ],
};

class FileManager extends PureComponent {
  render() {
    return (
      <div className="file-manager">
        <Splitter
          position="vertical"
          primaryPaneWidth="10%"
          primaryPaneMinWidth="168px"
        >
          <Files data={data} />
          <CodeEditor className="code-editor"/>
        </Splitter>
      </div>
    );
  }
}

export default FileManager;
