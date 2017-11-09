import React, { Component, PropTypes } from 'react';
import EditStep2 from '../create/step2.jsx';
import StepComponent from './stepComponent.jsx';
import FlatButton from "controls/NewFlatButton.jsx";
import CreateStore from 'stores/save_effect/create_store';
import util from 'util/Util.jsx';
import moment from 'moment';
import {Model,CalendarItemType} from 'constants/actionType/Effect.jsx';

function formatDate(date){
  return moment(util.DataConverter.JsonToDateTime(date)).format("YYYY-MM-DD")
}

function getHour(hour){
  return hour<10?`0${hour}`:hour
}

export default class Step2 extends Component { 

  _renderAllDayTimes(){
    var {TimePeriods}=this.props;
		var items=[];
		TimePeriods.forEach(time=>{
			if(time.TimePeriodType===CalendarItemType.AllDayCalcTime && time.ConfigStep===2){
				items.push(time)
			}
		})
    return(
      <div style={{marginTop:'20px'}}>
        <header className="jazz-save-effect-edit-step2-view-title">{I18N.SaveEffect.Create.CaculateTime}</header>
        <div style={{display:'flex',marginTop:'10px'}}>
          {items.map(item=><div className="jazz-save-effect-edit-step2-view-text"  style={{marginRight:'60px',display:'flex'}}>
            {`${getHour(item.FromTime)}:00`}
            <span style={{margin:'0 18px'}}>{I18N.Setting.DataAnalysis.To}</span>
            {`${getHour(item.ToTime)}:00`}
            </div>)}
        </div>
      </div>
    )
  }

  _renderWorkAndHolidayTimes(){
      var {TimePeriods,onTimePeriodsChanged}=this.props;
        var workItems=[],holidayItems=[];
        TimePeriods.forEach(time=>{
          if(time.TimePeriodType===CalendarItemType.WorkDayCalcTime && time.ConfigStep===2){
            workItems.push(time)
          }else if(time.TimePeriodType===CalendarItemType.RestDayCalcTime && time.ConfigStep===2){
            holidayItems.push(time)
          }
          
        })

        return(
          <div style={{marginTop:'20px'}}>
            <header className="jazz-save-effect-edit-step2-view-title">{I18N.SaveEffect.Create.CaculateTime}</header>

            <header className="jazz-save-effect-edit-step2-view-title" style={{color:'#626469',marginTop:'14px'}}>{I18N.SaveEffect.Create.WorkCaculateTime}</header>
            <div style={{display:'flex',marginTop:'8px'}}>
              {workItems.map(item=><div className="jazz-save-effect-edit-step2-view-text"  style={{marginRight:'60px',display:'flex',alignItems: 'center'}}>
                {`${getHour(item.FromTime)}:00`}
                <span style={{margin:'0 18px'}}>{I18N.Setting.DataAnalysis.To}</span>
                {`${getHour(item.ToTime)}:00`}
                </div>)}
           </div>

           <header className="jazz-save-effect-edit-step2-view-title" style={{color:'#626469',marginTop:'14px'}}>{I18N.SaveEffect.Create.WorkCaculateTime}</header>
            <div style={{display:'flex',marginTop:'8px'}}>
              {holidayItems.map(item=><div className="jazz-save-effect-edit-step2-view-text"  style={{marginRight:'60px',display:'flex',alignItems: 'center'}}>
                {`${getHour(item.FromTime)}:00`}
                <span style={{margin:'0 18px'}}>{I18N.Setting.DataAnalysis.To}</span>
                {`${getHour(item.ToTime)}:00`}
                </div>)}
           </div>
          </div>
        )
  }

  _renderViewStauts(){
    let { BenchmarkModel, BenchmarkStartDate, BenchmarkEndDate, CalculationStep,needCalendar,TimePeriods,AuxiliaryTagName} = this.props;
    return(
      <div className="jazz-save-effect-edit-step2-view">
        <header className="jazz-save-effect-edit-step2-view-title">{I18N.SaveEffect.Model.Title}</header>
        <div className="jazz-save-effect-edit-step2-view-text">{CreateStore.getBenchmarkModelById(BenchmarkModel)}</div>
        <header className="jazz-save-effect-edit-step2-view-title">{I18N.Setting.Tag.CalculationStep}</header>
        <div className="jazz-save-effect-edit-step2-view-text">{CreateStore.getCalculationStepByStep(CalculationStep)}</div>
        {BenchmarkModel!==Model.Manual && <header className="jazz-save-effect-edit-step2-view-title">{I18N.SaveEffect.BaselinePeriod}</header>}
        {BenchmarkModel!==Model.Manual && <div className="jazz-save-effect-edit-step2-view-text">{`${formatDate(BenchmarkStartDate)} ${I18N.EM.To2} ${formatDate(BenchmarkEndDate)}`}</div>}
        {BenchmarkModel===Model.Increment && <header className="jazz-save-effect-edit-step2-view-title">{I18N.SaveEffect.Create.AuxiliaryTag}</header>}
        {BenchmarkModel===Model.Increment && <div className="jazz-save-effect-edit-step2-view-text">{AuxiliaryTagName}</div>}
        {BenchmarkModel!==Model.Manual && BenchmarkModel!==Model.Contrast && TimePeriods.length!==0 &&
          (needCalendar?this._renderWorkAndHolidayTimes()
                        :this._renderAllDayTimes())
          } 
      </div>
    )
  }

  _renderEditStauts(){
    var {isView,onSave,onCancel,editDisabled,onEdit,...other}=this.props;
    var actions=[
        <FlatButton label={I18N.Common.Button.Cancel2} secondary={true} style={{float:'right',minWidth:'68px'}} onTouchTap={onCancel}/>,
        <FlatButton label={I18N.Platform.Password.Confirm} disabled={this.props.disabledPreview} primary={true} style={{float:'right',minWidth:'68px',marginRight:'20px'}} onTouchTap={()=>{onSave()}}/>,
      
    ]
    return(
      <div className="jazz-save-effect-edit-step2-edit">
        <EditStep2 {...other}/>
        <div className="jazz-save-effect-edit-step2-edit-actions">
          {actions}
        </div>
      </div>
    )
  }

  shouldComponentUpdate(nextProps, nextState) {
    return nextProps.configStep<=3|| nextProps.configStep===null || this.props.configStep!==nextProps.configStep
  }

  render(){
    var editDisabled=this.props.configStep!==2 && this.props.configStep!==null;
   return(
     <StepComponent step={2} title={I18N.SaveEffect.Step2} isfolded={this.props.data===null}
                    editDisabled={editDisabled} isView={this.props.isView} onEdit={this.props.onEdit}>
       {this.props.isView?this._renderViewStauts():this._renderEditStauts()}
     </StepComponent>
   )
  }

}

Step2.propTypes = {
  configStep:React.PropTypes.number || null,
  isView:React.PropTypes.boolean,
  onSave:React.PropTypes.func,
  onCancel:React.PropTypes.func,
  onEdit:React.PropTypes.func,
};
