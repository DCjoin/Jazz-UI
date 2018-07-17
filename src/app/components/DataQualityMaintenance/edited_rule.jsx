import React, { Component } from 'react';
import Button from '@emop-ui/piano/button';
import Checkbox from '@emop-ui/piano/checkbox';
import { FontIcon} from 'material-ui';
import Text from '@emop-ui/piano/text';
const TextStyle={
  fontSize: '14px',
  color: '#626469'
},SubTextStyle={
  fontSize: '14px',
  color: '#9fa0a4'
};

export default class EditedRule extends Component {

  _onChang(path,value){
    this.props.onChange({path,value})
  }

  _renderNullValue(){
    var {NotifyConsecutiveHours,IsAutoRepairNull,CheckNull}=this.props.rule.toJS();
    return(
      <div className="data-quality-rule-section">
        <Checkbox checked={CheckNull} label={I18N.Setting.VEEMonitorRule.NullValue} onCheck={()=>{this._onChange('CheckNull',!CheckNull)}}/>
        {CheckNull && <div className="data-quality-rule-section-config-field">
                        <div className="row" style={TextStyle}>
                          {I18N.VEE.Rule.NotifyConsecutiveHoursTip1}
                          <Text value={NotifyConsecutiveHours} width={46} height={28} onChange={(value)=>{this._onChange("NotifyConsecutiveHours",value)}}/>
                          <div className="hour">{I18N.EM.Hour}</div>
                          {I18N.VEE.Rule.NotifyConsecutiveHoursTip2}
                        </div>

                        <div className="row">
                          <Checkbox checked={IsAutoRepairNull} onCheck={()=>{this._onChange('IsAutoRepairNull',!IsAutoRepairNull)}}/>
                          <div style={TextStyle}>{I18N.VEE.Rule.AutoRepairNullTip1}</div>
                          <div style={SubTextStyle}>{I18N.VEE.Rule.AutoRepairNullTip2}</div>
                        </div>
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
    return(
      <div className="data-quality-rule">
        <div className="data-quality-rule-content">
        <div style={SubTextStyle}>{I18N.VEE.Rule.Tip}</div>
            {this._renderNullValue()}
            {this._renderNegativeValue()}
            {this._renderJumpingValue()}
        </div>
        {this._renderFooter()}
          </div>
    )
  }
}