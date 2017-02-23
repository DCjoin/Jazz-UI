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
    var style=assign({},defaultStyle.style,this.props.style,
                        {width:this.props.width})
    var prop={
      ref:'textfield',
      style,
      errorText:this.state.errorMessage,
      value:this.props.isNumber?CommonFuns.toThousands(this.props.value):this.props.value,
      onChange:(ev,value)=>{
        let realValue=this.props.isNumber?CommonFuns.thousandsToNormal(value):value;
        if(this.props.regexFn){
          this.setState({
            errorMessage:this.props.regexFn(realValue)
          })
        }
        this.props.onChange(ev,realValue);
      },
      onBlur:()=>{this.setState({isView:true})},
    }
    if(this.state.isView){
      return <div className="jazz-customtextfield" onClick={()=>{this.setState({isView:false})}} >
        {this.props.isNumber?CommonFuns.getLabelData(this.props.value*1):this.props.value}
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
};
