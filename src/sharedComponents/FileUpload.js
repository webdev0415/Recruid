import React, { Component } from "react";

const DEFAULT_UPLOAD_LIMIT = 3 * 1024 * 1024; // 3 MiB

class FileUpload extends Component {
  constructor(props) {
    super(props);

    this._ref = null;
    this._handleChange = this._handleChange.bind(this);
  }

  render() {
    //eslint-disable-next-line
    const { maxSize, onChange, onTooLarge, ...inputProps } = this.props;
    return (
      <input
        ref={(ref) => (this._ref = ref)}
        type="file"
        onChange={this._handleChange}
        {...inputProps}
      />
    );
  }

  open() {
    this._ref.click();
  }

  _handleChange(e) {
    const file = e.target.files[0];
    const maxSize = this.props.maxSize || DEFAULT_UPLOAD_LIMIT;

    let result = null;

    if (file.size <= maxSize) {
      result = this.props.onChange(e);
    } else if (this.props.onTooLarge) {
      result = this.props.onTooLarge(file, maxSize);
    }

    this._resetFileSelection();
    return result;
  }

  _resetFileSelection() {
    this._ref.value = "";
  }
}

export default FileUpload;
