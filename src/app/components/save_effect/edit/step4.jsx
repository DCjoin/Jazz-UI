import React, { Component} from 'react';
import find from 'lodash-es/find';
import EditStep4 from '../create/step4.jsx';
import StepComponent from './stepComponent.jsx';
import FlatButton from "controls/NewFlatButton.jsx";
import TimeGranularity from 'constants/TimeGranularity.jsx';
import moment from 'moment';
import ViewableTextField from 'controls/ViewableTextField.jsx';
import PropTypes from 'prop-types';
let getStepDataItems = () => [
	{ id: TimeGranularity.Minite, label: I18N.EM.Raw },
	{ id: TimeGranularity.Hourly, label: I18N.EM.Hour },
	{ id: TimeGranularity.Daily, label: I18N.EM.Day },
	{ id: TimeGranularity.Monthly, label: I18N.EM.Month },
];

export default class Step4 extends Component {

  _renderViewStauts(){
    let {unit, EnergyStartDate, EnergyEndDate, CalculationStep, PredictionDatas, BenchmarkStartDate, BenchmarkEndDate, ContrastStep, onChangePredictionDatas, onChangeContrastStep} = this.props;
		return (
			<div className='step4-wrapper' style={{margin:'0'}}>
				<div className='step4-block'>
					<header className='step4-block-header'>{I18N.SaveEffect.Create.SavePreviewChart}</header>
					<div className='step4-block-content'>
						<div className='step4-item'>
							<header className='step4-item-title'>{I18N.EM.Report.TimeRange}</header>
							<div className='step4-item-value'>{EnergyStartDate + ' ' + I18N.EM.To2 + ' '+ moment(EnergyEndDate).add(-1,'days').format("YYYY-MM-DD")}</div>
						</div>
						<div className='step4-item'>
							<header className='step4-item-title'>{I18N.EM.Report.Step}</header>
							<div className='step4-item-value'>{I18N.EM.Month}</div>
						</div>
			      <div className='step4-item'>
							<header className='step4-item-title' style={{marginBottom:'0'}}>{I18N.SaveEffect.Create.CalcSaveByMonth + `（${unit}）`}</header>
							<div className='step4-item-value'>
								{PredictionDatas && PredictionDatas.map((data, idx) =>
								<ViewableTextField
									isViewStatus={true}
                  title={data.Label}
									defaultValue={data.Value}
									hintText={data.Label}
									style={{width: 100}}
								/>)}
							</div>
						</div>
					</div>
				</div>
				<div className='step4-block'>
					<header className='step4-block-header'>{I18N.SaveEffect.Create.BenchmarkBattleCalc}</header>
					<div className='step4-block-content'>
						<div className='step4-item'>
							<header className='step4-item-title'>{I18N.EM.Report.Step}</header>
							<div className='step4-item-value'>{find(getStepDataItems(), item => item.id === ContrastStep).label}</div>
						</div>
					</div>
				</div>
			</div>
		);
  }

  _renderEditStauts(){
    var {isView,onSave,onCancel,...other}=this.props;
    var actions=[
				<FlatButton label={I18N.Common.Button.Cancel2} secondary={true} style={{float:'right',minWidth:'68px'}} onTouchTap={onCancel}/>,
        <FlatButton label={I18N.Platform.Password.Confirm} primary={true} disabled={this.props.disabledPreview} style={{float:'right',minWidth:'68px',marginRight:'20px'}} onTouchTap={()=>{onSave()}}/>,
      
    ]
    return(
      <div className="jazz-save-effect-edit-step2-edit">
        <EditStep4 {...other}/>
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
    var {EnergyStartDate,EnergyEndDate}=this.props;
    var editDisabled=this.props.configStep!==4 && this.props.configStep!==null;
   return(
     <StepComponent step={4} title={I18N.SaveEffect.Step4}  isfolded={!EnergyStartDate || !EnergyEndDate}
                    isView={this.props.isView} editDisabled={editDisabled} onEdit={this.props.onEdit}>
       {this.props.isView?this._renderViewStauts():this._renderEditStauts()}
     </StepComponent>
   )
  }

}

Step4.propTypes= {
  configStep:PropTypes.number || null,
  isView:PropTypes.boolean,
  onSave:PropTypes.func,
  onCancel:PropTypes.func,
  onEdit:PropTypes.func,
};
