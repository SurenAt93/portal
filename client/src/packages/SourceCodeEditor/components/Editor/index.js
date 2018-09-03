import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

// Components
import MonacoEditor from './MonacoEditor';

class Editor extends PureComponent {

  state = {
    isEditorMounted: false,
  }

  editorDidMount = (getEditorValue, editor) => {
    this.getEditorValue = getEditorValue;
    this.editor = editor;

    this.editor.onDidChangeModelContent(event => {
      const value = this.editor.getValue();
      this.props.onChange && this.props.onChange(value, event);
    });

    this.setState({ isEditorMounted: true });
  }

  render() {
    return (
      <MonacoEditor
        value={this.props.value}
        language={this.props.language}
        valueGetter={getEditorValue => (this.getEditorValue = getEditorValue)}
        editorDidMount={this.editorDidMount}
        line={this.props.line || 0}
      />
    );
  }
}

Editor.defaultProps = {
  value: '',
  language: 'html',
  line: 0,
};

Editor.propTypes = {
  value: PropTypes.string,
  language: PropTypes.string,
  line: PropTypes.number,
};

export default Editor;
