import React, { Component } from 'react';
import Button from '@emop-ui/piano/button';
import { FontIcon} from 'material-ui';
import PermissionCode from 'constants/PermissionCode.jsx';
import privilegeUtil from 'util/privilegeUtil.jsx';
import CurrentUserStore from 'stores/CurrentUserStore.jsx';

var isDataQualityFull=()=>privilegeUtil.isFull( PermissionCode.DATA_QUALITY_MAINTENANCE, CurrentUserStore.getCurrentPrivilege() )

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
        <div className="row" style={TextStyle}>{I18N.VEE.Rule.NotifyConsecutiveHoursTip1+NotifyConsecutiveHours+I18N.EM.Hour+I18N.VEE.Rule.NotifyConsecutiveHoursTip2}</div>
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
        <div className="row" style={TextStyle}>{I18N.VEE.Rule.JumpValueTip1+ JumpingRate+'%'+I18N.VEE.Rule.JumpValueTip2}</div>
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
    var {CheckNull ,CheckNegative ,CheckJumping }=this.props.rule.toJS();
    var content=null;
      if(!CheckNull && !CheckNegative && !CheckJumping){
        content=(
          <div className="data-quality-rule-content" style={{justifyContent:'center',alignItems:'center',color:'#666666',fontSize:'16px'}}>
            {I18N.VEE.Rule.NoRule}
          </div>
        )
      }else{
        content=(
          <div className="data-quality-rule-content">
        <div style={SubTextStyle}>{I18N.VEE.Rule.Tip}</div>
            {CheckNull && this._renderNullValue()}
            {CheckNegative && this._renderNegativeValue()}
            {CheckJumping && this._renderJumpingValue()}
        </div>
        )

      }
    return(
      <div className="data-quality-rule">
        {content}
        {isDataQualityFull() && this._renderFooter()}
          </div>
    )
  }
}