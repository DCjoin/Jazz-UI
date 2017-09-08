'use strict';
import React, {Component,PropTypes} from 'react';
import {TextField} from 'material-ui';
export default class DateTextField extends Component {

  getError(value){
    return this.props.regexFn(value);
  }

  _renderView(){
    let {date,value}=this.props;
    return(
      <div style={{width:'80px',minWidth:'80px',marginRight:'30px',marginTop:'15px'}}>
        <div style={{fontSize:'12px',color:"#9fa0a4"}}>{date}</div>
        <div style={{fontSize:'16px',color:'#626469',marginTop:'3px',lineHeight:'22px'}}>{value}</div>
      </div>
    )
  }

  render(){
    let {date,value,disabled,underlineShow,onBlur}=this.props;
    let props={
      value:!isNaN(value) && value!==null?value:value || '',
      floatingLabelText:date,
      floatingLabelStyle:{fontSize:'14px',color:'#9fa0a4'},
      inputStyle:{fontSize:'16px',color:'#626469'},
      disabled,
      underlineShow,
      onBlur,
      errorText:this.getError(value),
      style:{width:'80px',minWidth:'80px',marginRight:'30px'},
      onChange:(event)=>{this.props.onChange(event.target.value)}
    };
    return(
      this.props.isViewStatus?this._renderView():<TextField {...props}/>
    )
  }
}
DateTextField.propTypes={
  date:PropTypes.string,
  value:PropTypes.any,
  disabled:PropTypes.bool,
  underlineShow:PropTypes.bool,
  onChange:PropTypes.func,
  regexFn: React.PropTypes.func,
  onBlur:React.PropTypes.func,
  isViewStatus:React.PropTypes.bool,
}
DateTextField.defaultProps = {
	disabled: false,
	underlineShow:true,
};
