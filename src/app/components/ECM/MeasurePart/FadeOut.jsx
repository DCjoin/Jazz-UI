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
        width: spring(this.props.width-30,{stiffness: 150, damping: 26,precision:1}),
        height: spring(150,{stiffness: 150, damping: 26,precision:1}),
      }
    ;
    return (
      <Motion defaultStyle={defaultStyle} style={style} onRest={()=>{this.props.onEnd()}}>
        {interpolatingStyle  => {
          var {width,height}=interpolatingStyle;
          if((Math.abs(width-this.props.width+30)<=1 || Math.abs(height-150)<=1) && !isOver){
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
