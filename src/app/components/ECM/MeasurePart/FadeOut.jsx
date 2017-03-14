import React from 'react';
import {Motion, spring} from 'react-motion';
import assign from 'object-assign';
const BlankItem=React.createClass({
  render(){
    var styles={
      height:'180px',
      position:'absolute',
      backgroundColor:'white'
    };
    var style=assign({},styles,this.props.style);
    return(
      <div style={style}/>
    )
  }
})
var isOver=false;
const FadeOut = React.createClass({
  componentWillUnmount(){
    if(!isOver){this.props.onEnd()}
  },
  componentWillMount(){
    isOver=false;
  },
  render() {
    const defaultStyle={
      width: 0,
      height: 0,
    },
      style={
        width: spring(this.props.width,{stiffness: 40, damping: 26,precision:1}),
        height: spring(180,{stiffness: 40, damping: 26,precision:1}),
      }
    ;
    return (
      <Motion defaultStyle={defaultStyle} style={style} onRest={()=>{this.props.onEnd()}}>
        {interpolatingStyle  => {
          var {width,height}=interpolatingStyle;
          if((Math.abs(width-1390)<=1 || Math.abs(height-170)<=1) && !isOver){
              isOver=true;
              this.props.onEcmIconShow();
          }
            return(<div>
              <BlankItem style={{height:height/2,top:5,width:this.props.width}}/>
              <BlankItem style={{height:height/2,bottom:5,width:this.props.width}}/>
              <BlankItem style={{width:width/2,left:0,top:15}}/>
              <BlankItem style={{width:width/2,right:0,top:15}}/>
            </div>
              )

        }}
      </Motion>
      );
  },
});

export default FadeOut;
