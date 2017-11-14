import React, { Component, PropTypes } from 'react';
import EditStep3 from '../create/step3.jsx';
import StepComponent from './stepComponent.jsx';
import FlatButton from "controls/NewFlatButton.jsx";
import util from 'util/Util.jsx';
import moment from 'moment';
import ViewableTextField from 'controls/ViewableTextField.jsx';
import {Model,CalendarItemType} from 'constants/actionType/Effect.jsx';
import TimeGranularity from 'constants/TimeGranularity.jsx';

function formatDate(date){
  return moment(util.DataConverter.JsonToDateTime(date)).format("YYYY-MM-DD")
}

function getHour(hour){
  return hour<10?`0${hour}`:hour
}


export default class Step3 extends Component {

  _renderAllDayTimes(){
    var {TimePeriods}=this.props;
		var items=[];
		TimePeriods.forEach(time=>{
			if(time.TimePeriodType===CalendarItemType.AllDayCalcTime && time.ConfigStep===3){
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
          if(time.TimePeriodType===CalendarItemType.WorkDayCalcTime && time.ConfigStep===3){
            workItems.push(time)
          }else if(time.TimePeriodType===CalendarItemType.RestDayCalcTime && time.ConfigStep===3){
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
    let { BenchmarkModel,EnergyStartDate,CalculationStep, EnergyEndDate, EnergyUnitPrice,BenchmarkDatas,unit,CorrectionFactor,TimePeriods,needCalendar} = this.props;
    return(
      <div className="jazz-save-effect-edit-step2-view">
        <header className="jazz-save-effect-edit-step2-view-title">{I18N.SaveEffect.EnergyCalculatePeriod}</header>
        <div className="jazz-save-effect-edit-step2-view-text">{`${formatDate(EnergyStartDate)} ${I18N.EM.To2} ${formatDate(EnergyEndDate)}`}</div>
        <header className="jazz-save-effect-edit-step2-view-title">{I18N.SaveEffect.Create.EnergyUnitPrice + `(RMB/${unit})`}</header>
        <div className="jazz-save-effect-edit-step2-view-text">{EnergyUnitPrice}</div>
        {BenchmarkModel===Model.Manual && <header className="jazz-save-effect-edit-step2-view-title">{I18N.SaveEffect.Create.CalcBenchmarkByMonth + '(' + unit + ')'}</header>}
        	{BenchmarkModel===Model.Manual && BenchmarkDatas &&
		    	<div>
				{BenchmarkDatas.map((data, idx) =>
				<ViewableTextField
					isViewStatus={true}
          title={data.Label}
					defaultValue={data.Value}
					hintText={data.Label}
					style={{width: 95}}
				/>)}
			</div>}
       {(Model.Easy === BenchmarkModel || Model.Contrast === BenchmarkModel) && CalculationStep===TimeGranularity.Daily && <header className="jazz-save-effect-edit-step2-view-title">{I18N.SaveEffect.Create.CorrectionFactor}</header>}
       {(Model.Easy === BenchmarkModel || Model.Contrast === BenchmarkModel) && CalculationStep===TimeGranularity.Daily && <div className="jazz-save-effect-edit-step2-view-text">{CorrectionFactor}</div>}
       {BenchmarkModel!==Model.Manual && BenchmarkModel!==Model.Contrast && TimePeriods.length!==0 &&
          (needCalendar?this._renderWorkAndHolidayTimes()
                        :this._renderAllDayTimes())
          } 
      </div>
    )
  }

  _renderEditStauts(){
    var {isView,onSave,onCancel,...other}=this.props;
    var actions=[
      <FlatButton label={I18N.Common.Button.Cancel2} secondary={true} style={{float:'right',minWidth:'68px'}} onTouchTap={onCancel}/>,
        <FlatButton label={I18N.Platform.Password.Confirm} primary={true} disabled={this.props.disabledPreview} style={{float:'right',minWidth:'68px',marginRight:'20px'}} onTouchTap={()=>{onSave()}}/>,
      
    ]
    return(
      <div className="jazz-save-effect-edit-step2-edit">
        <EditStep3 {...other}/>
        <div className="jazz-save-effect-edit-step2-edit-actions">
          {actions}
        </div>
      </div>
    )
  }

  shouldComponentUpdate(nextProps, nextState) {
    return nextProps.configStep<=4 || nextProps.configStep===null
  }

  render(){
    var editDisabled=this.props.configStep!==3 && this.props.configStep!==null;
    let {EnergyStartDate, EnergyEndDate} = this.props;
   return(
     <StepComponent step={3} title={I18N.SaveEffect.Step3}  isfolded={this.props.configStep!==3 && (!EnergyStartDate || !EnergyEndDate)}
                    isView={this.props.isView} editDisabled={editDisabled} onEdit={this.props.onEdit}>
       {this.props.isView?this._renderViewStauts():this._renderEditStauts()}
     </StepComponent>
   )
  }

}

Step3.propTypes = {
  configStep:React.PropTypes.number || null,
  isView:React.PropTypes.boolean,
  onSave:React.PropTypes.func,
  onCancel:React.PropTypes.func,
  onEdit:React.PropTypes.func,
};
