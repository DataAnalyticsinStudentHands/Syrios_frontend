import React, { createRef } from "react";

import './WhitePopUp.css';



// WhitePopUp is a class that wraps information with a white popup and a translucent white background that covers everything but the navbar and footer.
// Has an X-icon prebuilt and closes on out side click.
class WhitePopUp extends React.Component {
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

  hidePopUp() {

  }

  showPopUp() {

  }

  // On outside click, close everything.
  handleClickOutside = (event) => {
    if (
      this.wrapperRef.current &&
      !this.wrapperRef.current.contains(event.target)
    ) {
      this.hidePopUp();
    }
  };

  render() {
    const { children } = this.props;

    return (
      <div>
        <div className='TranslucentWhiteBackground'/>
        <div ref={this.wrapperRef}>
          <div className='SnowWhiteBackground'> 
          <i
            id='x-icon'
            className='demo-icon icon-x-medium'
            onClick={(e) => {
              this.hidePopUp();
            }}>
            &#xe838;</i>
          {children}
          </div>
        </div>
      </div>
    );
  }
}

export default WhitePopUp;
