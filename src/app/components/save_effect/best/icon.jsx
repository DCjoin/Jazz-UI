import React, { Component } from 'react';
import FontIcon from 'material-ui/FontIcon';


export  class LessInvest extends Component{
  render(){
    var icon=<FontIcon className="icon-less-money" style={{fontSize:'19px',lineHeight:'19px',marginRight:'5px'}} color="#ff9000"/>
    return(
      <div className="best-icons">
        {icon}
        <div style={{fontSize:'12px',color:"#ff9000"}}>{I18N.SaveEffect.LessInvest}</div>
      </div>
    )
  }
}

export  class HighCost extends Component{
  render(){
    var icon=<FontIcon className="icon-saving-more" style={{fontSize:'19px',lineHeight:'19px',marginRight:'5px'}} color="#32ad3d"/>
    return(
      <div className="best-icons">
        {icon}
        <div style={{fontSize:'12px',color:"#32ad3d"}}>{I18N.SaveEffect.HighCost}</div>
      </div>
    )
  }
}

export  class Easy extends Component{
  render(){
    var icon=<FontIcon className="icon-easytodo" style={{fontSize:'19px',lineHeight:'19px',marginRight:'5px'}} color="#327dfe"/>
    return(
      <div className="best-icons">
        {icon}
        <div style={{fontSize:'12px',color:"#327dfe"}}>{I18N.SaveEffect.Easy}</div>
      </div>
    )
  }
}

export  class HighReturn extends Component{
  render(){
    var icon=<FontIcon className="icon-more-roi" style={{fontSize:'19px',lineHeight:'19px',marginRight:'5px'}} color="#ff9000"/>
    return(
      <div className="best-icons">
        {icon}
        <div style={{fontSize:'12px',color:"#ff9000"}}>{I18N.SaveEffect.HighReturn}</div>
      </div>
    )
  }
}
