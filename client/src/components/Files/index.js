import React, { PureComponent } from 'react';

import List from '@material-ui/core/List';

import File from './File';
import Folder from './Folder';

import './index.scss';

class Files extends PureComponent {

  drow = ({ name, children }) => {
    return children
      ? <Folder name={name} children={children} drow={this.drow} />
      : <File name={name} />
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
