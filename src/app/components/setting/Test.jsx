'use strict';

import React from 'react';

import dragula from 'react-dragula';

var Test = React.createClass({
  render: function() {
    return <div className='container'>
      <div>Swap me around</div>
      <div>Swap her around</div>
      <div>Swap him around</div>
      <div>Swap them around</div>
      <div>Swap us around</div>
      <div>Swap things around</div>
      <div>Swap everything around</div>
    </div>;
  },
  componentDidMount: function() {
    var container = React.findDOMNode(this);
    dragula([container], {
      accepts: function(el, target, source, sibling) {
        console.log('accepts');
        console.log(el);
        console.log(target);
        console.log(source);
        console.log(sibling);
        return true;
      },
    });
  }
});

module.exports = Test;
