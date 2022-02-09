import React, { createRef } from "react";

import './WhitePopUp.css';



// WhitePopUp is a class that wraps information with a white popup and a translucent white background that covers everything but the navbar and footer.
// Has an X-icon prebuilt and closes on out side click.
class WhitePopUp extends React.Component {
  wrapperRef = createRef();

  static ArrayOfWhitePopUps = [];
  constructor(props) {
    super(props);

    this.state = {
      opacity: 0,
      zIndex: -1000
    };

    WhitePopUp.ArrayOfWhitePopUps.push(this);
  }

  componentDidMount() {
    document.addEventListener("mouseup", this.handleClickOutside);
  }

  componentWillUnmount() {
    document.removeEventListener("mouseup", this.handleClickOutside);
  }

  hide() {
    this.setState({
      opacity: 0,
      zIndex: -1000
    });
  }

  show() {
    this.setState({
      opacity: 1,
      zIndex: 1000
    });
  }

  // On outside click, close everything.
  handleClickOutside = (event) => {
    if (
      this.wrapperRef.current &&
      !this.wrapperRef.current.contains(event.target)
    ) {
      this.hide();
    }
  };

  render() {
    const { children } = this.props;

    return (
      <div>
        <div className='TranslucentWhiteBackground' style={{ opacity: this.state.opacity, zIndex: this.state.zIndex }}/>
        <div ref={this.wrapperRef}>
          <div className='SnowWhiteBackground' style={{ opacity: this.state.opacity, zIndex: this.state.zIndex }}> 
          <i
            className='demo-icon icon-x-medium x-icon'
            onClick={(e) => {
              this.hide();
            }}>
            &#xe838;</i>
            <div className='WhitePopUpInnerPadding'>
              {children}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default WhitePopUp;
