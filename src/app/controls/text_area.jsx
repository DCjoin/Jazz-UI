import React, { Component } from 'react';
import TextField from 'material-ui/TextField';

export default class TextArea extends Component {
  state={
    errorText:null
  }

  validate(props=this.props){
    if(props.regexFn && !props.regexFn(errorText)){
      this.setState({
        errorText:this.props.errorText
      })
    }else{
      this.setState({
        errorText:null
      })
    }
  }

  componentDidMount(){
    this.validate(this.props)
  }

  componentWillReceiveProps(nextProps){
    this.validate(nextProps)
  }

  shouldComponentUpdate(nextProps, nextState){
    return nextProps.value!==this.props.value || this.state.errorText!==nextState.errorText
  }

  render(){
    var {width,onChange,value}=this.props;
    var {errorStyle}=this.state;
    var style={
      width,
      height:'28px',
      border:errorStyle?'1px solid #dc0a0a':'1px solid #e6e6e6',
      padding:'0 10px',
      boxSizing: 'border-box'
    },errorStyle={
      color:'#dc0a0a'
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