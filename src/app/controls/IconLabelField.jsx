import React, { Component } from 'react';
import FontIcon from 'material-ui/FontIcon';

const style={
  label:{
    fontSize:'12px',
    color:'#abafae'
  }
}
export default class IconLabelField extends Component {
  constructor(props) {
    super(props);
  }
  render(){
    <div style={{display:'flex',flexDirection:'row'}}>
      {this.props.icon}
      <div>
        <div style={style.label}>{this.props.label}</div>
        {this.props.children}
      </div>
    </div>
  }
}

IconLabelField.propTypes = {
  icon:React.PropTypes.object,
  label:React.PropTypes.string,
};
