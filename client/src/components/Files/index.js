import React, { PureComponent } from 'react';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';

import File from './File';
import Folder from './Folder';

import './index.scss';

let i = 0;

class Files extends PureComponent {

  drow = ({ name, children }) => {
    return (
      <ListItem className="files__item" key={i++}>
        <div>
          {
            children
              ? <Folder name={name} children={children} drow={this.drow} />
              : <File name={name} />
          }
        </div>
      </ListItem>
    );
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
