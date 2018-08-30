import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import List from '@material-ui/core/List';

// Components
import File from './File';
import Folder from './Folder';

// Styles
import './index.scss';

class Files extends PureComponent {

  static uniqueKey = 0; // There should be an id of file from OS

  drow = ({ name, children }) => children
    ? <Folder key={Files.uniqueKey++} name={name} children={children} drow={this.drow} />
    : <File handleFileOpen={this.props.handleFileOpen} key={Files.uniqueKey++} name={name} />;

  render() {
    return (
      <div className="files">
        {
          this.props.data
            ? (
              <List dense={true}>
                {this.drow(this.props.data)}
              </List>
            )
            : 'Empty...'
        }
      </div>
    );
  }
}

Files.propTypes = {
  data: PropTypes.object,
  handleFileOpen: PropTypes.func,
};

Files.defaultProps = {
  handleFileOpen: _ => {},
};

export default Files;
