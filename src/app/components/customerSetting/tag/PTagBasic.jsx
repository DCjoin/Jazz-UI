'use strict';

import React from "react";
import { Checkbox } from 'material-ui';
import Regex from '../../../constants/Regex.jsx';
import ViewableTextField from '../../../controls/ViewableTextField.jsx';
import ViewableDropDownMenu from '../../../controls/ViewableDropDownMenu.jsx';
import ComAndUom from '../ComAndUom.jsx';
import ViewableEnergyLabel from './ViewableEnergyLabel.jsx';
import moment from 'moment';
import CommonFuns from 'util/Util.jsx';
import ViewableDatePicker from 'controls/ViewableDatePicker.jsx';

var PTagBasic = React.createClass({
  propTypes: {
    selectedTag: React.PropTypes.object,
    mergeTag: React.PropTypes.func,
    isViewStatus: React.PropTypes.bool
  },
  getInitialState: function() {
    return {
      offset:null,
      offsetStartTime:null,
      offsetStartHour:null,
      offsetStartMinute:null,
    };
  },
  getOffset:function(){
    return this.state;
  },
  getEnableSave:function(){
    var {offset,offsetStartTime,offsetStartHour,offsetStartMinute}=this.state;
    if(offset!==null && offset!=='' && !Regex.TagRule.test(offset)) return false;
    return (offset===null || offset==='') && offsetStartTime===null && offsetStartHour===null && offsetStartMinute===null ||
          !(offset==null || offset==='') && offsetStartTime!==null && offsetStartHour!==null && offsetStartMinute!==null
  },
  _mergeTag: function(data) {
    if (this.props.mergeTag) {
      this.props.mergeTag(data);
    }
  },
  _getCollectionMethodList: function() {
    let collectionMethodList = [{
      payload: 1,
      text: I18N.Setting.Tag.Meter
    }, {
      payload: 2,
      text: I18N.Setting.Tag.Manual
    }];
    return collectionMethodList;
  },
  _getCalculationStepList: function() {
    let calculationStepList = [{
      payload: 6,
      text: I18N.Common.AggregationStep.Min15
    }, {
      payload: 7,
      text: I18N.Common.AggregationStep.Min30
    }, {
      payload: 1,
      text: I18N.Common.AggregationStep.Hourly
    }, {
      payload: 2,
      text: I18N.Common.AggregationStep.Daily
    }, {
      payload: 3,
      text: I18N.Common.AggregationStep.Monthly
    }, {
      payload: 4,
      text: I18N.Common.AggregationStep.Yearly
    }];
    return calculationStepList;
  },
  _getCalculationTypeList: function() {
    var isView = this.props.isViewStatus;
    let calculationTypeList = [{
      payload: 1,
      text: I18N.Common.CaculationType.Sum
    }, {
      payload: 2,
      text: I18N.Common.CaculationType.Avg
    }, {
      payload: 3,
      text: I18N.Common.CaculationType.Max
    }, {
      payload: 4,
      text: I18N.Common.CaculationType.Min
    }, {
      payload: 0,
      text: I18N.Common.CaculationType.Non
    }];
    return calculationTypeList;
  },
  _getOffsetHourList:function(){
     let list = [{
        payload: -1,
        text: I18N.Setting.Tag.OffsetHour,
        disabled:true
     }];
     for(var i=0;i<=23;i++){
       list.push({
         payload: i,
         text: i+'',
       })
     }
    return list;
  },
   _getOffsetMinuteList:function(){
     let list = [{
        payload: -1,
        text: I18N.Setting.Tag.OffsetMinute,
        disabled:true
     }, {
      payload: 0,
      text: '0'
    }, {
      payload: 15,
      text: '15'
    }, {
      payload: 30,
      text: '30'
    }, {
      payload: 45,
      text: '45'
    }];
     
    return list;
  },
  _renderOffset(){
    var me=this;
    var isView = this.props.isViewStatus;
    let j2d = CommonFuns.DataConverter.JsonToDateTime;
    let {NewOffset,NewOffsetStartTime}=this.props.selectedTag.toJS();

    var TITLE_STYLE={
      fontSize: '12px',
      color:'#9fa0a4',
      marginBottom:'6px'
    },FONT_STYLE={
      fontSize: '14px',
      color:'#464949',
    };

    if(isView){
      if(NewOffset===null){
        return null
      }else{
        return <div>
          <div className="pop-customer-detail-content-left-item" style={{paddingTop: '50px'}}>
            <header style={TITLE_STYLE}>{I18N.Setting.Tag.OffsetView}</header>
            <div style={FONT_STYLE}>{NewOffset}</div>
          </div>
          <div className="pop-customer-detail-content-left-item">
            <header style={TITLE_STYLE}>{I18N.Setting.Tag.OffsetTime}</header>
            <div style={FONT_STYLE}>{moment(j2d(NewOffsetStartTime)).format(I18N.DateTimeFormat.IntervalFormat.FullDateMinute)}</div>
          </div>
        </div>
      }
    }else{
      var hourProps={
            ref: 'hour',
            isViewStatus: false,
            defaultValue: this.state.offsetStartHour=== null?-1:this.state.offsetStartHour,
            dataItems: me._getOffsetHourList(),
            labelStyle:{fontSize:'14px',paddingRight:'0px'},
            style:{marginLeft:'21px',width:'122px'},
            menuItemStyle:{paddingRight:'0px'},
            didChanged: value => {
              this.setState({
                offsetStartHour:value
              })
              this._mergeTag({
                value:'',
                path: ""
              })
            }
      }, minuteProps={
            ref: 'minute',
            isViewStatus: false,
            defaultValue: this.state.offsetStartMinute=== null?-1:this.state.offsetStartMinute,
            dataItems: me._getOffsetMinuteList(),
            labelStyle:{fontSize:'14px',paddingRight:'0px'},
            style:{marginLeft:'21px',width:'122px'},
            didChanged: value => {
              this.setState({
                offsetStartMinute:value
               })
                 this._mergeTag({
                value:'',
                path: ""
              })
            }
      };
      return <div>
          <div className="pop-customer-detail-content-left-item" style={{paddingTop: '50px'}}>
            <header style={TITLE_STYLE}>{I18N.Setting.Tag.Offset}</header>
            {NewOffset===null?
            <ViewableTextField errorMessage={I18N.SaveEffect.Create.TriggerVaildTip} regex={Regex.TagRule} style={{marginTop:'10px',width:230}} 
                                labelStyle={{fontSize:'14px',color:'#464949'}}
                                hintStyle={{fontSize:'14px',color:'#a6aaa9'}}
																 hintText={I18N.Setting.Tag.OffsetHint} defaultValue={this.state.offset || ''} didChanged={(value)=>{
																		this.setState({
                                      offset:value===''?null:value
                                    })
                                      this._mergeTag({
                                      value:'',
                                      path: ""
                                    })
																 }}/>
            :<div style={{display:'flex',alignItems:'center'}}>
              <div style={FONT_STYLE}>{`${NewOffset} (${I18N.Setting.Tag.OffsetHistory}) + `}</div>
              <ViewableTextField errorMessage={I18N.SaveEffect.Create.TriggerVaildTip} regex={Regex.TagRule} style={{marginTop:'10px',marginLeft:'10px',width:230}} 
                                  labelStyle={{fontSize:'14px',color:'#464949'}}
                                  hintStyle={{fontSize:'14px',color:'#a6aaa9'}}
																 hintText={I18N.Setting.Tag.OffsetCurrentHint} defaultValue={this.state.offset || ''} didChanged={(value)=>{
																		this.setState({
                                      offset:value
                                    })
                                      this._mergeTag({
                                        value:'',
                                        path: ""
                                      })
																 }}/>
            </div>    }        
          </div>
         {this.state.offset!==null && this.state.offset!=='' && <div className="pop-customer-detail-content-left-item">
            <header style={TITLE_STYLE}>{I18N.Setting.Tag.OffsetTime}</header>
            <div style={{display:'flex'}}>
              <div style={{marginTop:'5px'}}>
             <ViewableDatePicker  hintText={I18N.Setting.Tag.OffsetDate} onChange={(val)=>{this.setState({offsetStartTime:val})}} datePickerClassName='date-picker-inline' width={122} 
              value={this.state.offsetStartTime || ''} 
              shouldDisableDate={(date)=>(moment(date).isBefore(moment().add(-6,'M')))}/>
              </div>
              <ViewableDropDownMenu {...hourProps}/>
              <ViewableDropDownMenu {...minuteProps}/>
            </div>
 
          </div>}
        </div>
    }

  },
  componentWillMount: function() {},
  componentDidMount: function() {},
  componentWillReceiveProps: function(nextProps) {},
  componentWillUnmount: function() {},
  render: function() {
    var me = this;
    var isView = this.props.isViewStatus;
    var selectedTag = this.props.selectedTag,
      {CollectionMethod,Code, MeterCode, ChannelId, CalculationStep, CalculationType, Slope,  IsAccumulated, Comment,EnergyLabelId } = selectedTag.toJS();
    var   collectTypeProps = {
            ref: 'collect',
            isViewStatus: isView,
            title: I18N.Setting.Tag.CollectType,
            defaultValue: CollectionMethod,
            dataItems: me._getCollectionMethodList(),
            didChanged: value => {
              me.props.mergeTag({
                value,
                path: "CollectionMethod"
              });
            }
          },codeProps = {
        ref: 'code',
        isViewStatus: isView,
        title: I18N.Setting.Tag.Code,
        defaultValue: Code || '',
        isRequired: true,
        regex: Regex.Code,
        errorMessage: I18N.Setting.Tag.CodeError,
        didChanged: value => {
          me.props.mergeTag({
            value,
            path: "Code"
          });
        }
      },
      meterCodeProps = {
        ref: 'meterCode',
        isViewStatus: isView,
        title: I18N.Setting.Tag.MeterCode,
        defaultValue: MeterCode || '',
        isRequired: true,
        regex: Regex.MeterCode,
        errorMessage: I18N.Setting.Tag.MeterCodeError,
        didChanged: value => {
          me.props.mergeTag({
            value,
            path: "MeterCode"
          });
        }
      },
      channelProps = {
        ref: 'channel',
        isViewStatus: isView,
        title: I18N.Setting.Tag.Channel,
        defaultValue: ChannelId || '',
        maxLen: 9,
        regex: Regex.Channel,
        errorMessage: I18N.Setting.VEEMonitorRule.ConsecutiveHoursError,
        isRequired: true,
        didChanged: value => {
          me.props.mergeTag({
            value,
            path: "ChannelId"
          });
        }
      },
      calculationStepProps = {
        ref: 'calculationStep',
        isViewStatus: isView,
        title: I18N.Setting.Tag.Period,
        defaultValue: CalculationStep,
        dataItems: me._getCalculationStepList(),
        didChanged: value => {
          me.props.mergeTag({
            value,
            path: "CalculationStep"
          });
        }
      },
      calculationTypeProps = {
        ref: 'calculationType',
        isViewStatus: isView,
        title: I18N.Setting.Tag.CalculationType,
        defaultValue: CalculationType,
        dataItems: me._getCalculationTypeList(),
        didChanged: value => {
          me.props.mergeTag({
            value,
            path: "CalculationType"
          });
        }
      },
      slopeProps = {
        ref: 'slope',
        isViewStatus: isView,
        title: I18N.Setting.Tag.Slope,
        defaultValue: Slope || '',
        isRequired: false,
        maxLen: 17,
        regex: Regex.TagRule,
        errorMessage: I18N.Setting.Tag.ErrorContent,
        didChanged: value => {
          if (value === '') {
            value = null;
          }
          me.props.mergeTag({
            value,
            path: "Slope"
          });
        }
      },
      checkProps = {
        label: I18N.Setting.Tag.AccumulatedValueCal,
        checked: IsAccumulated,
        disabled: isView,
        onCheck: (event, checked) => {
          me.props.mergeTag({
            value: checked,
            path: "IsAccumulated"
          });
        }
      },
      commentProps = {
        ref: 'comment',
        isViewStatus: isView,
        title: I18N.Setting.Tag.Comment,
        defaultValue: Comment,
        isRequired: false,
        multiLine: true,
        maxLen: null,
        didChanged: value => {
          me.props.mergeTag({
            value,
            path: "Comment"
          });
        }
      },
      energyLabelIdProps={
        ref: 'energyLabelId',
        isViewStatus: isView,
        value:EnergyLabelId || -1,
        onItemTouchTap:id=>{
          if(id===-1) id=null;
          me.props.mergeTag({
            value:id,
            path: "EnergyLabelId"
          });
        }
      };
    var slope = !Slope && isView ? null : (<div className="pop-customer-detail-content-left-item">
        <ViewableTextField {...slopeProps}/>
      </div>);
    var isAccumulated = !IsAccumulated && isView ? null : (<div className="pop-customer-detail-content-left-item">
      <Checkbox {...checkProps}/>
    </div>);
    var comment = !Comment && isView ? null : (<div className="pop-customer-detail-content-left-item">
        <ViewableTextField {...commentProps}/>
      </div>);
    return (
      <div className={"pop-customer-detail-content jazz-tag-right-panel"}>
        <div className="pop-customer-detail-content-left">
          <div className="pop-customer-detail-content-left-item">
            <ViewableDropDownMenu {...collectTypeProps}/>
          </div>
          <div className="pop-customer-detail-content-left-item">
            <ViewableTextField {...codeProps}/>
          </div>
          <div className="pop-customer-detail-content-left-item">
            <ViewableTextField {...meterCodeProps}/>
          </div>
          <div className="pop-customer-detail-content-left-item">
            <ViewableTextField {...channelProps}/>
          </div>
          <ComAndUom ref='comAndUom' selectedItem={selectedTag} mergeItem={this._mergeTag} isViewStatus={isView}/>
          <div className="pop-customer-detail-content-left-item">
            <ViewableDropDownMenu {...calculationStepProps}/>
          </div>
          <div className="pop-customer-detail-content-left-item">
            <ViewableDropDownMenu {...calculationTypeProps}/>
          </div>
          <div className="pop-customer-detail-content-left-item">
            <ViewableEnergyLabel {...energyLabelIdProps}/>
          </div>
          {slope}
          {this._renderOffset()}
          {isAccumulated}
          {comment}
        </div>
      </div>
      );
  },
});

module.exports = PTagBasic;
