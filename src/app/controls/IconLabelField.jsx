import React, { Component } from 'react';
import PropTypes from 'prop-types';
const style={
  label:{
    fontSize:'12px',
    color:'#626469'
  }
}
export default class IconLabelField extends Component {
  constructor(props) {
    super(props);
  }
  render(){
    return(
      <div style={{display:'flex',flexDirection:'row',alignItems:'center'}}>
        {this.props.icon}
        <div style={{marginLeft:'10px'}}>
          <div style={style.label}>{this.props.label}</div>
          {this.props.children}
        </div>
      </div>
    )

  }
}

IconLabelField.propTypes= {
  icon:PropTypes.object,
  label:PropTypes.string,
};
