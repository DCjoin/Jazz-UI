import React, { Component } from 'react';
import Button from '@emop-ui/piano/button';
import Checkbox from '@emop-ui/piano/checkbox';
import { FontIcon} from 'material-ui';
import TextArea from 'controls/text_area.jsx';

const TextStyle={
  fontSize: '14px',
  color: '#626469'
},SubTextStyle={
  fontSize: '14px',
  color: '#9fa0a4'
};

export default class EditedRule extends Component {

  _onChange(path,value){
    this.props.onChange(path,value)
  }

  _renderNullValue(){
    var {NotifyConsecutiveHours,IsAutoRepairNull,CheckNull}=this.props.rule.toJS();
    return(
      <div className="data-quality-rule-section">
        <Checkbox checked={CheckNull} label={I18N.Setting.VEEMonitorRule.NullValue} onCheck={()=>{this._onChange('CheckNull',!CheckNull)}}/>
        {CheckNull && <div className="data-quality-rule-section-config-field">
                        <div className="row" style={TextStyle}>
                          <div style={{marginRight:'6px'}}>{I18N.VEE.Rule.NotifyConsecutiveHoursTip1}</div>
                          <TextArea value={NotifyConsecutiveHours} width={46} onChange={(value)=>{this._onChange("NotifyConsecutiveHours",value)}}/>
                          <div className="uom">{I18N.EM.Hour}</div>
                          <div style={{marginLeft:'6px'}}>{I18N.VEE.Rule.NotifyConsecutiveHoursTip2}</div>
                        </div>

                        <div className="row">
                          <Checkbox labelWidth={0} checked={IsAutoRepairNull} onCheck={()=>{this._onChange('IsAutoRepairNull',!IsAutoRepairNull)}}/>
                          <div style={TextStyle}>{I18N.VEE.Rule.AutoRepairNullTip1}</div>
                          <div style={SubTextStyle}>{I18N.VEE.Rule.AutoRepairNullTip2}</div>
                        </div>
                      </div>}
      </div>
    )
  }

  _renderNegativeValue(){
    var {CheckNegative}=this.props.rule.toJS();
    return(
      <div className="data-quality-rule-section">
        <div className="data-quality-rule-section-title">
          <Checkbox checked={CheckNegative} label={I18N.Setting.VEEMonitorRule.NegativeValue} onCheck={()=>{this._onChange('CheckNegative',!CheckNegative)}}/>
        </div>
      </div>
    )
  }

  _renderJumpingValue(){
    var {JumpingRate,CheckJumping}=this.props.rule.toJS();
    return(
      <div className="data-quality-rule-section">
        <Checkbox checked={CheckJumping} label={I18N.Setting.VEEMonitorRule.JumpValue} onCheck={()=>{this._onChange('CheckJumping',!CheckJumping)}}/>
        {CheckJumping && <div className="data-quality-rule-section-config-field">
                        <div className="row" style={TextStyle}>
                          {I18N.VEE.Rule.JumpValueTip1}
                          <TextArea value={JumpingRate} width={46} onChange={(value)=>{this._onChange("JumpingRate",value)}}/>
                          <div className="uom">{'%'}</div>
                          {I18N.VEE.Rule.JumpValueTip2}
                        </div>
                      </div>}
      </div>
    )
  }

  _renderFooter(){
    return(
      <div className="data-quality-rule-footer">
        <Button label={I18N.Common.Button.Save} raised style={{width:'86px'}} onClick={this.props.onSave}/>
        <Button label={I18N.Common.Button.Cancel2} outline secondary style={{width:'86px'}} onClick={this.props.onCancel}/>
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