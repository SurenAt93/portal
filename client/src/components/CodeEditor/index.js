import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

// Components
import Editor from 'components/MonacoEditor';

class CodeEditor extends PureComponent {

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
      <Editor
        value={this.props.value}
        language={this.props.language}
        valueGetter={getEditorValue => (this.getEditorValue = getEditorValue)}
        editorDidMount={this.editorDidMount}
        line={this.props.line || 0}
      />
    );
  }
}

CodeEditor.propTypes = {
  value: PropTypes.string,
};

export default CodeEditor;
