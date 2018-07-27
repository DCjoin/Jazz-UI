import React, { Component } from 'react';
import TextField from 'material-ui/TextField';
import ClickAway from './ClickAwayListener.jsx';

@ClickAway
export default class TextArea extends Component {
  state={
    errorText:null,
    borderStyle:'1px solid #e6e6e6'
  }

  validate(props=this.props){
    if(props.regexFn && !props.regexFn(props.value)){
      this.setState({
        errorText:this.props.errorText,
        borderStyle:'1px solid #dc0a0a',
      })
      return false
    }else{
      this.setState({
        errorText:null,
        borderStyle:'1px solid #e6e6e6',
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
    return nextProps.value!==this.props.value || this.state.errorText!==nextState.errorText || this.state.borderStyle!==nextState.borderStyle
  }

  componentWillReceiveProps(nextProps){
    this.validate(nextProps)
  }

  render(){
    var {width,onChange,value}=this.props;
    var {errorText}=this.state;
    var style={
      width,
      height:'28px',
      border:this.state.borderStyle,
      padding:'0 10px',
      boxSizing: 'border-box',
      borderBottomLeftRadius:'2px',
      borderTopLeftRadius:'2px',
      backgroundColor:'#ffffff'
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
                  inputStyle={{color:'#666666'}}
                  onClick={()=>{if(this.state.borderStyle.indexOf('e6e6e6')!==-1){
                    this.setState({borderStyle:'1px solid #32ad3c'})
                  }
                    }}
                  errorText={this.state.errorText}
                  errorStyle={errorStyle}
                  onChange={(event, newValue)=>{onChange(newValue)}}/>
    )
  }
}