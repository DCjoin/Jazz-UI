import React, { Component } from 'react';

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

IconLabelField.propTypes = {
  icon:React.PropTypes.object,
  label:React.PropTypes.string,
};
