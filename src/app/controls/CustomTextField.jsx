import React, { Component } from 'react';
import assign from "object-assign";
import {TextField} from 'material-ui';
import CommonFuns from 'util/Util.jsx'

const defaultStyle={
  style:{
    fontSize:'16px',
    height:'35px'
  }
}
export default class CustomTextField extends Component {
  constructor(props) {
    super(props);
  }
  state={
    isView:true,
    errorMessage:''
  }

  componentDidUpdate(){
    if(this.refs.textfield){
      this.refs.textfield.focus()
    }
  }
  render(){
    var {style,width,multiLine,isNumber,value,regexFn,onChange}=this.props;
    var newStyle=assign({},defaultStyle.style,style,{width:width})
    var prop={
      ref:'textfield',
      style:newStyle,
      multiLine,
      underlineFocusStyle:multiLine?{marginTop:'-50px'}:{},
      errorText:this.state.errorMessage,
      value:isNumber?CommonFuns.toThousands(value):value,
      onChange:(ev,value)=>{
        let realValue=isNumber?CommonFuns.thousandsToNormal(value):value;
        if(regexFn){
          this.setState({
            errorMessage:this.props.regexFn(realValue)
          })
        }
        onChange(ev,realValue);
      },
      onBlur:()=>{this.setState({isView:true})},
    }
    if(this.state.isView){
      return <div className="jazz-customtextfield" onClick={()=>{this.setState({isView:false})}} >
        {isNumber?CommonFuns.getLabelData(value*1):value}
      </div>
    }
    else {
      return <TextField {...prop}/>
    }
  }
}

CustomTextField.propTypes = {
  width:React.PropTypes.number,
  isNumber:React.PropTypes.bool,
  regexFn:React.PropTypes.func,
  onChange:React.PropTypes.func,
  value:React.PropTypes.any,
  style:React.PropTypes.object,
  multiLine:React.PropTypes.bool
};
