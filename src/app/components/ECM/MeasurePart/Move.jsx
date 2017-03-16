import React from 'react';
import {Motion, spring} from 'react-motion';
import FontIcon from 'material-ui/FontIcon';

const leavingSpringConfig = {stiffness: 60, damping: 15};
const Move = React.createClass({
  render() {
    var {destX,destY,originX,originY}=this.props;
    const defaultStyle={
      x: destX,
      y: destY,
    },
      style={
        x: spring(originX,leavingSpringConfig),
        y: spring(originY,leavingSpringConfig),
      }
    ;
    return (
      <Motion defaultStyle={defaultStyle} style={style} onRest={this.props.onEnd}>
        {interpolatingStyle  => {
          var {x,y}=interpolatingStyle;
          return(
            <FontIcon key={`${x}_${y}`} className="icon-to-ecm" style = {{
                position:'fixed',
                left:originX+destX-x,
                top:originY+destY-y,
                transform:'rotateY(180deg)',
                WebkitTransform: 'rotateY(180deg)',
              }} />)
        }}
      </Motion>
      );
  },
});

export default Move;
