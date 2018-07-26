import React, { Component } from 'react';
import Button from '@emop-ui/piano/button';
import { Checkbox,FontIcon} from 'material-ui';
import TextArea from 'controls/text_area.jsx';
import Regex from 'constants/Regex.jsx';
import Dialog from 'controls/NewDialog.jsx';
import FlatButton from 'controls/FlatButton.jsx';
const TextStyle={
  fontSize: '14px',
  color: '#626469'
},SubTextStyle={
  fontSize: '14px',
  color: '#9fa0a4'
};

var notifyConsecutiveHoursRegexFn=(value)=>{
  //为空
  if(value===null || value==='') return false
  //正整数
  if(value*1<=0 || parseInt(value*1)!==value*1) return false

  return true
}

var jumpingRateRegexFn=(value)=>{
  //为空
  if(value===null || value==='') return false
  //前9后6 正数
  if(!Regex.FactorRule.test(value*1)) return false

  return true
}

export default class EditedRule extends Component {
  state={
    leaveTipShow:false
  }

  _onChange(path,value){
    this.props.onChange(path,value)
  }

  _renderNullValue(){
    var {NotifyConsecutiveHours,IsAutoRepairNull,CheckNull}=this.props.rule.toJS();

    return(
      <div className="data-quality-rule-section">
        <Checkbox checked={CheckNull} style={{width:'100px'}} label={I18N.Setting.VEEMonitorRule.NullValue} onCheck={()=>{this._onChange('CheckNull',!CheckNull)}}/>
        {CheckNull && <div className="data-quality-rule-section-config-field">
                        <div className="row" style={TextStyle}>
                          <div style={{marginRight:'6px'}}>{I18N.VEE.Rule.NotifyConsecutiveHoursTip1}</div>

                          <TextArea ref="notify_consecutive_hours"
                                    value={NotifyConsecutiveHours} 
                                    width={56} 
                                    onChange={(value)=>{this._onChange("NotifyConsecutiveHours",value)}}
                                    regexFn={notifyConsecutiveHoursRegexFn}
                                    errorText={I18N.VEE.Rule.NotifyConsecutiveHoursErrorTip}/>
                          <div className="uom">{I18N.EM.Hour}</div>
                          <div style={{marginLeft:'6px'}}>{I18N.VEE.Rule.NotifyConsecutiveHoursTip2}</div>
                        </div>

                        <div className="row" style={{marginTop:notifyConsecutiveHoursRegexFn(NotifyConsecutiveHours)?'6px':'22px'}}>
                          <Checkbox style={{width:'30px'}} checked={IsAutoRepairNull} onCheck={()=>{this._onChange('IsAutoRepairNull',!IsAutoRepairNull)}}/>
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
          <Checkbox checked={CheckNegative} style={{width:'100px'}} label={I18N.Setting.VEEMonitorRule.NegativeValue} onCheck={()=>{this._onChange('CheckNegative',!CheckNegative)}}/>
        </div>
      </div>
    )
  }

  _renderJumpingValue(){
    var {JumpingRate,CheckJumping}=this.props.rule.toJS();
    
    return(
      <div className="data-quality-rule-section">
        <Checkbox checked={CheckJumping} style={{width:'100px'}} label={I18N.Setting.VEEMonitorRule.JumpValue} onCheck={()=>{this._onChange('CheckJumping',!CheckJumping)}}/>
        {CheckJumping && <div className="data-quality-rule-section-config-field" style={{paddingBottom:jumpingRateRegexFn(JumpingRate)?'10px':'31px'}}>
                        <div className="row" style={TextStyle}>
                        <div style={{marginRight:'6px'}}>{I18N.VEE.Rule.JumpValueTip1}</div>
                          
                          <TextArea value={JumpingRate} 
                                    width={76} 
                                    onChange={(value)=>{this._onChange("JumpingRate",value)}}
                                    regexFn={jumpingRateRegexFn}
                                    errorText={I18N.VEE.Rule.JumpRateTip}/>
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
        <Button label={I18N.Common.Button.Save} raised 
                style={{width:'86px',marginLeft:'20px'}} 
                onClick={()=>{
                  var {JumpingRate,NotifyConsecutiveHours,CheckJumping,CheckNegative,CheckNull}=this.props.rule.toJS();
                  if(CheckNull && !notifyConsecutiveHoursRegexFn(NotifyConsecutiveHours)){return}
                  if(CheckJumping && !jumpingRateRegexFn(JumpingRate)){return}
  
                    this.props.onSave()
        
                  }}/>
        <Button label={I18N.Common.Button.Cancel2} outline secondary style={{width:'86px',marginLeft:'16px'}} onClick={()=>{
          this.setState({
            leaveTipShow:true
          })
        }}/>
      </div>
    )
  }

  _renderLeaveTip(){
    return(
      <Dialog open={this.state.leaveTipShow} actionsContainerStyle={{textAlign: 'right'}} contentStyle={{margin: '8px 24px', color: '#626469',paddingLeft:'0'}} actions={[
        <FlatButton primary inDialog label={I18N.Setting.Diagnose.LeavePage} onClick={this.props.onCancel}/>,
        <FlatButton label={I18N.Common.Button.Cancel2} onClick={() => { this.setState({leaveTipShow: false}) }}/>
      ]}>{I18N.VEE.Rule.LeaveTip}</Dialog>
    )
  }

  render(){
    return(
      <div className="data-quality-rule" style={{marginLeft:'-20px'}}>
        <div className="data-quality-rule-content" style={{paddingLeft:'20px'}}>
        <div style={SubTextStyle}>{I18N.VEE.Rule.Tip}</div>
            {this._renderNullValue()}
            {this._renderNegativeValue()}
            {this._renderJumpingValue()}
        </div>
        {this.props.hasBar && this._renderFooter()}
        {this.state.leaveTipShow && this._renderLeaveTip()}
          </div>
    )
  }
}