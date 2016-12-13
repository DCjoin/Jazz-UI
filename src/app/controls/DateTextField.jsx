'use strict';
import React, {Component,PropTypes} from 'react';
import TextField from './ClickAwayTextField.jsx';
export default class DateTextField extends Component {

  getError(value){
    return this.props.regexFn(value);
  }

  render(){
    let {date,value,disabled,underlineShow,onClickAway}=this.props;
    let props={
      value:!isNaN(value) && value!==null?value:value || '',
      floatingLabelText:date,
      disabled,
      underlineShow,
      onClickAway,
      errorText:this.getError(value),
      style:{width:'150px',minWidth:'150px',marginRight:'20px'},
      onChange:(event)=>{this.props.onChange(event.target.value)}
    };
    return(
      <TextField {...props}/>
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
  onClickAway:React.PropTypes.func,
}
DateTextField.defaultProps = {
	disabled: false,
	underlineShow:true,
};
