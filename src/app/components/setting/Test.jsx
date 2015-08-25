
var React = require('react');
import Draggable from 'react-draggable2';

var Test = React.createClass({
  handleStart: function (event, ui) {
        console.log('Event: ', event);
        console.log('Position: ', ui.position);
    },

    handleDrag: function (event, ui) {
        console.log('Event: ', event);
        console.log('Position: ', ui.position);
    },

    handleStop: function (event, ui) {
        console.log('Event: ', event);
        console.log('Position: ', ui.position);
    },

    render: function () {
        return (
            // <Draggable/> transparently adds draggable interactivity
            // to whatever element is supplied as `this.props.children`.
            // Only a single element is allowed or an Error will be thrown.
            //
            // `axis` determines which axis the draggable can move.
            // - 'both' allows movement horizontally and vertically (default).
            // - 'x' limits movement to horizontal axis.
            // - 'y' limits movement to vertical axis.
            //
            // `handle` specifies a selector to be used as the handle that initiates drag.
            //
            // `cancel` specifies a selector to be used to prevent drag initialization.
            //
            // `bound` determines whether to bound the movement to the parent box.
            // - 'top' bounds movement to the top edge of the parent box.
            // - 'right' bounds movement to the right edge of the parent box.
            // - 'bottom' bounds movement to the bottom edge of the parent box.
            // - 'left' bounds movement to the left edge of the parent box.
            // - 'all' bounds movement to all edges (default if not specified).
            // - 'point' to constrain only the top-left corner.
            // - 'box' to constrain the entire box (default if not specified).
            //
            // `constrain` takes a function to constrain the dragging.
            //
            // `start` specifies the x and y that the dragged item should start at
            //
            // `zIndex` specifies the zIndex to use while dragging.
            //
            // `onStart` is called when dragging starts.
            //
            // `onDrag` is called while dragging.
            //
            // `onStop` is called when dragging stops.

            <Draggable
            
                handle=".handle"
                constrain={constrain(25)}
                start={{x: 25, y: 25}}
                bound="all box"
                zIndex={100}
                onStart={this.handleStart}
                onDrag={this.handleDrag}
                onStop={this.handleStop}>
                <div>
                    <div className="handle">Drag from here</div>
                    <div>Lorem ipsum...</div>
                </div>
            </Draggable>
        );
    }
});
function constrain (snap) {
  function constrainOffset (offset, prev) {
    var delta = offset - prev;
    if (Math.abs(delta) >= snap) {
      return prev + parseInt(delta / snap, 10) * snap;
    }
    return prev;
  }
  return function (pos) {
    return {
      top: constrainOffset(pos.top, pos.prevTop),
      left: constrainOffset(pos.left, pos.prevLeft)
    };
  };
}

module.exports = Test;
