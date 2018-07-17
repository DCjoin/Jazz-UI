import React, { Component } from 'react';
import Button from '@emop-ui/piano/button';
import { FontIcon} from 'material-ui';

const TextStyle={
  fontSize: '14px',
  color: '#626469'
},SubTextStyle={
  fontSize: '14px',
  color: '#9fa0a4'
};

export default class ViewedRule extends Component {

  _renderNullValue(){
    var {NotifyConsecutiveHours,IsAutoRepairNull}=this.props.rule.toJS();
    return(
      <div className="data-quality-rule-section">
        <div className="data-quality-rule-section-title">
          <FontIcon className='icon-check-mark' color={"#32AD3C"} style={{fontSize:'18px'}}/>
          <div className="text">{I18N.Setting.VEEMonitorRule.NullValue}</div>
        </div>
        <div className="row" style={TextStyle}>{NotifyConsecutiveHoursTip1+NotifyConsecutiveHours+I18N.EM.Hour+NotifyConsecutiveHoursTip2}</div>
        {IsAutoRepairNull && <div className="row" style={{display:'flex'}}>
          <div style={TextStyle}>{I18N.VEE.Rule.AutoRepairNullTip1}</div>
          <div style={SubTextStyle}>{I18N.VEE.Rule.AutoRepairNullTip2}</div>
        </div>}
      </div>
    )
  }

  _renderNegativeValue(){
    return(
      <div className="data-quality-rule-section">
        <div className="data-quality-rule-section-title">
          <FontIcon className='icon-check-mark' color={"#32AD3C"} style={{fontSize:'18px'}}/>
          <div className="text">{I18N.Setting.VEEMonitorRule.NegativeValue}</div>
        </div>
      </div>
    )
  }

  _renderJumpingValue(){
    var {JumpingRate}=this.props.rule.toJS();
    return(
      <div className="data-quality-rule-section">
        <div className="data-quality-rule-section-title">
          <FontIcon className='icon-check-mark' color={"#32AD3C"} style={{fontSize:'18px'}}/>
          <div className="text">{I18N.Setting.VEEMonitorRule.JumpValue}</div>
        </div>
        <div className="row" style={TextStyle}>{I18N.format(I18N.VEE.Rule.JumpValueTip,JumpingRate)}</div>
      </div>
    )
  }

  _renderFooter(){
    return(
      <div className="data-quality-rule-footer">
        <Button label={I18N.Common.Button.Edit} raised style={{width:'86px'}} onClick={this.props.onEdited}/>
      </div>
    )
  }

  render(){
    var {CheckNull,CheckNegative ,CheckJumping }=this.props.rule.toJS();
    var content=null;
      if(!CheckNull && !CheckNegative && !CheckJumping){
        content=(
          <div className="data-quality-rule-content">
        <div style={SubTextStyle}>{I18N.VEE.Rule.Tip}</div>
            {CheckNull && this._renderNullValue()}
            {CheckNegative && this._renderNegativeValue()}
            {CheckJumping && this._renderJumpingValue()}
        </div>
        )
      }else{
        content=(
          <div className="data-quality-rule-content" style={{justifyContent:'center',alignItems:'center'}}>
            {I18N.VEE.Rule.NoRule}
          </div>
        )
      }
    return(
      <div className="data-quality-rule">
        {content}
        {this._renderFooter()}
          </div>
    )
  }
}