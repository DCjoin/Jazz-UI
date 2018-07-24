import React, { Component } from 'react';
import Button from '@emop-ui/piano/button';
import Dialog from 'controls/NewDialog.jsx';
import FlatButton from 'controls/FlatButton.jsx';
import {
  Step,
  Stepper,
  StepLabel,
} from 'material-ui/Stepper';
import SvgIcon from 'material-ui/SvgIcon';
import Immutable from 'immutable';
import EditedRule from './edited_rule.jsx';
import PropTypes from 'prop-types';
import TagSelect from './tag_select.jsx';
import DataQualityMaintenanceAction from 'actions/data_quality_maintenance.jsx';
import Regex from 'constants/Regex.jsx';

function stepLabelProps(stepValue, currentStep) {
	let props = {
		style: {
			height: 50,
			fontSize: 14,
			color: '#0f0f0f',
		},
	},
	iconColor = '#32ad3d';
	if( currentStep < stepValue ) {
		props.style.color = '#9fa0a4';
		iconColor = '#a3e7b0';
	}
	props.icon = (
		<SvgIcon color={iconColor} style={{
		      display: 'block',
		      fontSize: 24,
		      width: 24,
		      height: 24,
		      color: iconColor,
		  }}>
		<circle cx={12} cy={12} r={10}/>
		<text x={12} y={17} fill='#ffffff' fontSize='12px' textAnchor='middle'>{stepValue + 1}</text>
	</SvgIcon>);
	return props;
}

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

export default class RulesConfigration extends Component {

  static contextTypes = {
    router: PropTypes.object,
  };

  constructor(props) {
    super(props);
    this.state = {
      step: 0,
      leaveTipShow:false,
      rule:Immutable.fromJS({// Id: 0,
        // Name: "string",
        CustomerId:parseInt(this.props.customerId),
        CheckJumping: false,
        JumpingRate: 0,
        CheckNegative: false,
        CheckNull: false,
        // "Interval": 0,
        // "Delay": 0,
        NotifyConsecutiveHours: 0,
        // "HierarchyId": 0,
        IsAutoRepairNull: false}),
        selectTags:[]
    };
  }



  _getSaveParams(){
    return this.state.selectTags.map(tagArr=>({
      Rule:this.state.rule.set("HierarchyId",tagArr.buildingId),
      TagIds:tagArr.tagIds
    }))
  }
  _renderHeader(){
    return(
      <div className="rules-configuration-content-header">
        {I18N.VEE.Rule.Config}
      </div>
    )
  }

  _renderSteper(){
    var {step}=this.state;
    return(
      <nav style={{margin:'11px 0 11px -14px'}}>
      <Stepper activeStep={step}>
        <Step>
          <StepLabel {...stepLabelProps(0, step)}>{I18N.VEE.Rule.ConfigStep1}</StepLabel>
        </Step>
        <Step>
          <StepLabel {...stepLabelProps(1, step)}>{I18N.VEE.Rule.ConfigStep2}</StepLabel>
        </Step>
      </Stepper>
    </nav>
    )
  }

  _renderContent(){
    return this.state.step===0?<EditedRule rule={this.state.rule} 
                                           hasBar={false}
                                           onChange={(path,value)=>{
                                            var rule=this.state.rule;
                                            rule=rule.set(path,value);
                                            if(path==='CheckNull'){
                                             rule=rule.set("NotifyConsecutiveHours",8);
                                             rule=rule.set("IsAutoRepairNull",true);
                                            }
                                            if(path==='CheckJumping'){
                                             rule=rule.set("JumpingRate",500);
                                            }
                                            this.setState({
                                              rule:rule
                                            })
                                          }}/>:<TagSelect selectTags={this.state.selectTags} onSelect={(selectTags)=>{
                                            this.setState({selectTags})
                                          }}/>
  }

  _renderLeaveTip(){
    return(
      <Dialog open={this.state.leaveTipShow} actionsContainerStyle={{textAlign: 'right'}} contentStyle={{margin: '8px 24px', color: '#626469'}} actions={[
        <FlatButton primary inDialog label={I18N.Setting.Diagnose.LeavePage} onClick={this.props.onCancel}/>,
        <FlatButton label={I18N.Common.Button.Cancel2} onClick={() => { this.setState({leaveTipShow: false}) }}/>
      ]}>{I18N.VEE.Rule.LeaveTip}</Dialog>
    )
  }

  _renderFooter(){
    return(
      <div className="rules-configuration-footer">
        <div className="rules-configuration-footer-content">
          {this.state.step===0 && <Button label={I18N.Paging.Button.NextStep} raised 
                  style={{width:'86px'}} 
                  onClick={()=>{
                    var {JumpingRate,NotifyConsecutiveHours,CheckJumping,CheckNull}=this.state.rule.toJS();

                  if(CheckNull && !notifyConsecutiveHoursRegexFn(NotifyConsecutiveHours)){return}
                  if(CheckJumping && !jumpingRateRegexFn(JumpingRate)){return}
  
                  this.setState({
                    step:1
                  })

                   
                  }}/>}
          {this.state.step===1 && <Button label={I18N.Common.Button.Save} raised 
                  style={{width:'86px'}} 
                  onClick={()=>{
                   DataQualityMaintenanceAction.updateRule(this._getSaveParams());
                   this.props.onCancel();
                  }}/>}
          <Button label={I18N.Common.Button.Cancel2} outline secondary style={{width:'86px',marginLeft:'16px'}} onClick={()=>{
            this.setState({
              leaveTipShow:true
            })
          }}/>
        </div>
      </div>
    )
  }

    render(){
        return(
          <div className="rules-configuration">
            <div className="rules-configuration-content">
              {this._renderHeader()}
              {this._renderSteper()}
              {this._renderContent()}
            </div>
            {this._renderFooter()}
            {this.state.leaveTipShow && this._renderLeaveTip()}
          </div>
        )
    }
}