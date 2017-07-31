import React from 'react';
import {Motion, spring} from 'react-motion';
import assign from 'object-assign';

const MEASURE_ITEM_HEIGHT=193,
      TOP_PADDING=21,
      LEFT_PADDING=25,
      RIGHT_PADDING=15,
      LEAVING_GAP=30;

const BlankItem=React.createClass({
  render(){
    var styles={
      height:`${MEASURE_ITEM_HEIGHT}px`,
      position:'absolute',
      backgroundColor:'white',
      zIndex:"1000"
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
        width: spring(this.props.width-LEAVING_GAP,{stiffness: 150, damping: 26,precision:1}),
        height: spring(150,{stiffness: 150, damping: 26,precision:1}),
      }
    ;

    return (
      <Motion defaultStyle={defaultStyle} style={style} onRest={()=>{this.props.onEnd()}}>
        {interpolatingStyle  => {
          var {width,height}=interpolatingStyle;
          if((Math.abs(width-this.props.width+LEAVING_GAP)<=1 || Math.abs(height-(MEASURE_ITEM_HEIGHT-LEAVING_GAP))<=1) && !isOver){
              isOver=true;
              this.props.onEcmIconShow();
          }
            return(<div>
              <BlankItem style={{height:height/2,top:TOP_PADDING,left:LEFT_PADDING,width:this.props.width}}/>
              <BlankItem style={{height:height/2,bottom:0,left:LEFT_PADDING,width:this.props.width}}/>
              <BlankItem style={{width:width/2,left:LEFT_PADDING,top:TOP_PADDING}}/>
              <BlankItem style={{width:width/2,right:RIGHT_PADDING,top:TOP_PADDING}}/>
            </div>
              )

        }}
      </Motion>
      );
  },
});

export default FadeOut;
