import React, { createRef } from "react";

class OutsideClickHandler extends React.Component {
  wrapperRef = createRef();

  static defaultProps = {
    onOutsideClick: () => {}
  };

  componentDidMount() {
    document.addEventListener("mouseup", this.handleClickOutside);
  }

  componentWillUnmount() {
    document.removeEventListener("mouseup", this.handleClickOutside);
  }

  handleClickOutside = (event) => {
    if (
      this.wrapperRef.current &&
      !this.wrapperRef.current.contains(event.target)
    ) {
      this.props.onOutsideClick();
    }
  };

  render() {
    const { children } = this.props;

    return <div ref={this.wrapperRef}>{children}</div>;
  }
}

export default OutsideClickHandler;
