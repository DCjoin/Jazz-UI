import React, { Component, PropTypes } from 'react';
import keymirror from 'keymirror';

const RESERVED_STATIC_KEYS = keymirror({
  displayName: null,
  childContextTypes: null,
  contextTypes: null,
  getDefaultProps: null,
  defaultProps: null,
  propTypes: null,
})

export default function createDecoratorComponent(Comp) {
  class DecoratorComponent extends Component {
    render() {
      return this.props.children;
    }
  }
  for( let key in Comp ) {
    if( !RESERVED_STATIC_KEYS[key] ) {
      DecoratorComponent[key] = Comp[key];
    }
  }
  return DecoratorComponent;
};