import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

// Third-Party Components
import CircularProgress from '@material-ui/core/CircularProgress';

// Utils
import monaco from 'utils/monaco-editor';

// Config
import { themes } from 'config';

import './index.scss';

class Editor extends PureComponent {

  static defaultProps = {
    width: '100%',
    height: '100%',
    value: '<div>Sample text...</div>',
    language: 'html',
    options: {},
    editorDidMount: _ => {}
  };

  state = {
    isLoading: true,
  };

  componentDidMount() {
    monaco
      .init()
      .then(monaco => (this.monaco = monaco) && this.createEditor());
  }

  componentDidUpdate({ value, language, width, height, theme }) {

    const { editor, monaco } = this;

    if (editor && monaco) {
      if (value !== this.props.value) {
        editor.setValue(this.props.value);
        // `forceTokenization` is unofficial API
        // we have to did it for avoiding flickering of editor
        // content after .setValue
        // See more in this discussion
        // https://github.com/Microsoft/monaco-editor/issues/803
        editor.model.forceTokenization(editor.model.getLineCount());
      }

      if (language !== this.props.language) {
        monaco.editor.setModelLanguage(this.editor.getModel(), this.props.language);
      }

      if (theme !== this.props.theme) {
        monaco.editor.setTheme(this.props.theme);
      }

      if (
        this.props.width !== width ||
        this.props.height !== height
      ) {
        editor.layout();
      }
    }
  }

  updateDimensions = _ => this.editor.layout();

  createEditor() {

    const { value, language, theme, options, editorDidMount } = this.props;

    this.editor = this.monaco.editor.create(this.monacoContainer, {
      value,
      language,
      ...options,
    });

    if (theme) {
      this.monaco.editor.setTheme(theme);
    } else {
      this.monaco.editor.defineTheme('night-dark', themes.monaco['night-dark']);

      this.monaco.editor.setTheme('night-dark');
    }

    editorDidMount && editorDidMount(this.editor.getValue.bind(this.editor), this.editor);

    window.addEventListener('resize', this.updateDimensions);

    this.setState({ isLoading: false });
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateDimensions);
    this.removeEditor();
  }

  removeEditor() {
    this.editor && this.editor.dispose();
  }

  render() {

    const { width, height } = this.props;

    return (
      <section className="monaco-editor__wrapper">
        {this.state.isLoading && <div className="monaco-editor__preloader">
          <CircularProgress
            size={100}
            color="primary"
            className="monaco-editor__preloader--circle"
          />
        </div>}
        <div
          ref={monacoContainer => (this.monacoContainer = monacoContainer)}
          style={{ width, height }}
          className="monaco-editor__content"
        />
      </section>
    );
  }
}

Editor.propTypes = {
  value: PropTypes.string,
  valueGetter: PropTypes.func.isRequired,
  editorDidMount: PropTypes.func.isRequired,
  theme: PropTypes.string,
};

export default Editor;
