import React, { Component } from 'react';
import TextField from 'material-ui/TextField';

export default class Remark extends Component {

    constructor(props) {
      super(props);
    }

    state={
      text:""
    }

    componentDidMount(){
      this.setState({
        text:this.props.remarkText
      })
    }

    componentWillReceiveProps(nextProps){
      this.setState({
        text:nextProps.remarkText
      })
    }

    render(){

      return(
        <TextField hintText={I18N.Remark.DefaultText} value={this.state.text} onChange={this.props.onChange} hintStyle={{
            color: '#abafae'
          }} multiLine={true} underlineShow={false}/>
      )
    }

}

Remark.propTypes = {
  remarkText:React.PropTypes.string,
  onChange:React.PropTypes.func,
};
