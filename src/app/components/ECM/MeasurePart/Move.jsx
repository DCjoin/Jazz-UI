import React from 'react';
import {Motion, spring} from 'react-motion';
import FontIcon from 'material-ui/FontIcon';

const leavingSpringConfig = {stiffness: 60, damping: 15};
const Move = React.createClass({
  render() {
    var {destX,destY,originX,originY}=this.props;
    //destX=710;destY=-70;originX=700;originY=90;

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
          // console.log(interpolatingStyle);
          var {x,y}=interpolatingStyle;
          // console.log(originX+destX-x,originY+destY-y);
          return(
            <FontIcon className="icon-to-ecm" style = {{
                position:'fixed',
                transform:`translate3d(${originX+destX-x}px, ${originY+destY-y}px, 0) rotateY(180deg)`,
                WebkitTransform: `translate3d(${originX+destX-x}px, ${originY+destY-y}px, 0) rotateY(180deg)`,
              }} />)
        }}
      </Motion>
      );
  },
});

export default Move;
