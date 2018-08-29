import React, { PureComponent } from 'react';

import List from '@material-ui/core/List';

import File from './File';
import Folder from './Folder';

import './index.scss';

class Files extends PureComponent {

  static uniqueKey = 0; // There should be an id of file from OS

  drow = ({ name, children }) => {
    return children
      ? <Folder key={Files.uniqueKey++} name={name} children={children} drow={this.drow} />
      : <File handleFileOpen={this.props.handleFileOpen} key={Files.uniqueKey++} name={name} />
  }

  render() {
    return (
      <div className="files">
        <List dense={true}>
          {this.drow(this.props.data)}
        </List>
      </div>
    );
  }
}

export default Files;
