import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';

import createDecoratorComponent from '../decorator/createDecoratorComponent.jsx';

const isDescendant = (el, target) => {
  if (target !== null) {
    return el === target || isDescendant(el, target.parentNode);
  }
  return false;
};

const clickAwayEvents = ['mousedown', 'touchstart'];
const bind = (callback) => clickAwayEvents.forEach((event) => {
	if (document.addEventListener) {
      document.addEventListener(event, callback);
    } else {
      document.attachEvent(`on${event}`, () => {
        callback.call(document);
      });
    }
});
const unbind = (callback) => clickAwayEvents.forEach((event) => {
    if (document.removeEventListener) {
      document.removeEventListener(event, callback);
    } else {
      // IE8+ Support
      document.detachEvent(`on${event}`, callback);
    }
});

function clickAway(Comp) {
  return class extends createDecoratorComponent(Comp) {
    static propTypes = {
      children: PropTypes.node
    };

    componentDidMount() {
      bind(this.handleClickAway);
    }

    componentWillUnmount() {
      unbind(this.handleClickAway);
    }

    handleClickAway = (event) => {
      if (event.defaultPrevented) {
        return;
      }

      const el = ReactDOM.findDOMNode(this);

      if (document.documentElement.contains(event.target) && !isDescendant(el, event.target)) {
        this.refs.comp.onClickAway(event);
      }
    };

    render() {
      return (
        <Comp ref="comp" {...this.props}  />
      )
    }
  }
}
export default clickAway;