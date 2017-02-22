import React,{ Component } from 'react';
import TextField from '../../controls/CustomTextField.jsx';

export default class test extends Component {
  constructor(props) {
    super(props);
  }

  state={
    value:'kwh'
  }

  render(){
    console.log(this.state.value);
    return(
      <div style={{display:'flex',flexDirection:'row'}}>
        <TextField value={this.state.value}
          onChange={(ev,value)=>{this.setState({value})}}
          width='150px'
          isNumber={false}
          />
        <div>kwh</div>
      </div>

    )
  }
}
