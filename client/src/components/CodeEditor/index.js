import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

// Components
import Editor from 'components/MonacoEditor';

// Example
const codeExample = `<div>Sample text</div>`;

class CodeEditor extends PureComponent {

  state = {
    isEditorMounted: false,
    theme: 'vs-dark',
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

    const value = this.props.value || codeExample;

    return (
      <Editor
        value={value}
        valueGetter={getEditorValue => (this.getEditorValue = getEditorValue)}
        editorDidMount={this.editorDidMount}
        theme={this.state.theme}
      />
    );
  }
}

CodeEditor.propTypes = {
  value: PropTypes.string,
};

export default CodeEditor;
