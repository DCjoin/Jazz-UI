import React, { Component } from 'react';
import TextField from 'material-ui/TextField';
import ClickAway from './ClickAwayListener.jsx';

@ClickAway
export default class TextArea extends Component {
  state={
    errorText:null
  }

  validate(props=this.props){
    if(props.regexFn && !props.regexFn(props.value)){
      this.setState({
        errorText:this.props.errorText
      })
      return false
    }else{
      this.setState({
        errorText:null
      })
      return true
    }
  }

  onClickAway(){
    this.validate(this.props)
  }

  componentDidMount(){
    this.validate(this.props)
  }

  shouldComponentUpdate(nextProps, nextState){
    return nextProps.value!==this.props.value || this.state.errorText!==nextState.errorText
  }

  render(){
    var {width,onChange,value}=this.props;
    var {errorText}=this.state;
    var style={
      width,
      height:'28px',
      border:errorText!==null?'1px solid #dc0a0a':'1px solid #e6e6e6',
      padding:'0 10px',
      boxSizing: 'border-box'
    },errorStyle={
      color:'#dc0a0a',
      left:'-10px',
      width:'300px',
      bottom:'-6px'
    };
    return(
      <TextField style={style}
                  value={value}
                  underlineShow={false}
                  errorText={this.state.errorText}
                  errorStyle={errorStyle}
                  onChange={(event, newValue)=>{onChange(newValue)}}/>
    )
  }
}