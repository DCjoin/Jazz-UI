'use strict';
import React, {Component,PropTypes} from 'react';
import {TextField} from 'material-ui';

export default class DateTextField extends Component {

  render(){
    let {date,value,disabled,underlineShow}=this.props;
    let props={
      value:value || '',
      floatingLabelText:date,
      disabled,
      underlineShow,
      style:{width:'150px',minWidth:'150px',marginRight:'20px'},
      onChange:(value)=>{
        this.props.onChange(date,value)
      }
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
}
DateTextField.defaultProps = {
	disabled: false,
	underlineShow:true,
};
