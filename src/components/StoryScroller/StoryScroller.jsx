import React from 'react';
import Fullpage from 'fullpage.js';
import 'fullpage.js/dist/fullpage.css';

const sameOption = (left, right) => (
  Array.isArray(left) && Array.isArray(right)
    ? left.length === right.length && left.every((value, index) => value === right[index])
    : left === right
);

// Keep the story renderer on the maintained engine without the obsolete global
// polyfills and bundled engine shipped by the old React wrapper. Story frames are
// immutable while displayed: contentKey must change when their structure changes
// so destroy() unwraps engine markup before React reconciles the new frame DOM.
class StoryScroller extends React.Component {
  container = React.createRef();
  fullpageApi = null;
  state = { initialized: false };

  componentDidMount() {
    this.initialize();
  }

  getSnapshotBeforeUpdate(previousProps) {
    // Fullpage wraps section DOM. Restore it before React commits new content;
    // waiting until componentDidUpdate would leave React removing reparented nodes.
    const keys = new Set([...Object.keys(previousProps), ...Object.keys(this.props)]);
    // Reference-drawer renders replace the callback without changing the frames.
    const optionsChanged = [...keys].some((key) => (
      key !== 'render' && !sameOption(previousProps[key], this.props[key])
    ));
    if (optionsChanged) this.destroy();
    return optionsChanged;
  }

  componentDidUpdate(previousProps, previousState, optionsChanged) {
    if (optionsChanged) this.initialize();
  }

  componentWillUnmount() {
    this.destroy();
  }

  initialize() {
    const { render, contentKey, ...options } = this.props;
    // Match the former wrapper's non-animated initial hash navigation.
    const animateAnchor = options.animateAnchor ?? true;
    this.fullpageApi = new Fullpage(this.container.current, {
      ...options,
      animateAnchor: false,
    });
    this.fullpageApi.getFullpageData().options.animateAnchor = animateAnchor;
    this.setState({ initialized: true });
  }

  destroy() {
    // 'all' also restores markup/global styles and removes generated navigation.
    this.fullpageApi?.destroy('all');
    this.fullpageApi = null;
  }

  render() {
    return (
      <div id='fullpage' ref={this.container}>
        {this.props.render({ state: this.state, fullpageApi: this.fullpageApi })}
      </div>
    );
  }
}

// Sections must remain direct children of the engine-owned #fullpage container.
StoryScroller.Wrapper = React.Fragment;

export default StoryScroller;
