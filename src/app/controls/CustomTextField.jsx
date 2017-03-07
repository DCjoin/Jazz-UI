import React, { Component } from 'react';
import assign from "object-assign";
import {TextField} from 'material-ui';
import CommonFuns from 'util/Util.jsx';
import MeasuresStore from 'stores/ECM/MeasuresStore.jsx';

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
    errorMessage:'',
    value:this.props.value
  }

  componentDidUpdate(){
    if(this.refs.textfield){
      this.refs.textfield.focus()
    }
  }
  render(){
    var {style,width,multiLine,isNumber,regexFn,onChange,displayFn}=this.props;
    var value=this.state.value;
    var newStyle=assign({},defaultStyle.style,style,{width:width})
    var prop={
      ref:'textfield',
      style:newStyle,
      inputStyle:{marginTop:'-10px'},
      multiLine,
      underlineFocusStyle:multiLine?{marginTop:'-50px'}:{},
      errorText:this.state.errorMessage,
      value:isNumber?CommonFuns.toThousands(value):value,
      onChange:(ev,value)=>{
        let realValue=isNumber?CommonFuns.thousandsToNormal(value):value;
        // if(regexFn){
        //   this.setState({
        //     errorMessage:regexFn(realValue)
        //   })
        // }
        this.setState({
          errorMessage:regexFn?regexFn(realValue):null,
          value:realValue
        })
      },
      onBlur:()=>{
        this.setState({isView:true});
        onChange(null,this.state.value);
      },
    }
    if(this.state.isView){
      var v = value;
      if(v===null){
        v='-'
      }else if (this.props.multiLine) {
        var arr = v.split('\n');
        if (arr.length > 1) {
          v = arr.map(item => {
            return <div>{item}</div>;
            });
          }
        }

      return <div className="jazz-customtextfield" onClick={()=>{this.setState({isView:false})}} >
        {isNumber?value==='' || value===null?'-':displayFn(CommonFuns.getLabelData(value*1)):this.props.multiLine?v:displayFn(v)}
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
  multiLine:React.PropTypes.bool,
  displayFn:React.PropTypes.func
};

CustomTextField.defaultProps={
  multiLine:false
}
