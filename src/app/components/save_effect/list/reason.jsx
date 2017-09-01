import React, { Component } from 'react';
import TextField from 'material-ui/TextField';

export default class Reason extends Component {

    constructor(props) {
      super(props);
    }

    state={
      text:""
    }

    componentDidMount(){
      this.setState({
        text:this.props.text
      })
    }

    componentWillReceiveProps(nextProps){
      this.setState({
        text:nextProps.text
      })
    }

    render(){

      return(
        <TextField hintText={I18N.SaveEffect.RecommendReasonHint} value={this.state.text} onChange={this.props.onChange} 
        style={{width:'100%',maxHeight:'162px',marginLeft:'15px'}}
        textareaStyle={{fontSize:'14px',height:'142px'}}
        hintStyle={{color: '#cbcbcb',fontSize:'14px'}}
           multiLine={true} 
           underlineShow={false}/>
      )
    }

}

Reason.propTypes = {
  text:React.PropTypes.string,
  onChange:React.PropTypes.func,
};
