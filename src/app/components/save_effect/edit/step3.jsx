import React, { Component, PropTypes } from 'react';
import EditStep3 from '../create/step3.jsx';
import StepComponent from './stepComponent.jsx';
import FlatButton from "controls/NewFlatButton.jsx";
import util from 'util/Util.jsx';
import moment from 'moment';
import ViewableTextField from 'controls/ViewableTextField.jsx';
import {Model} from 'constants/actionType/Effect.jsx';

function formatDate(date){
  return moment(util.DataConverter.JsonToDateTime(date)).format("YYYY-MM-DD")
}

export default class Step3 extends Component {

  _renderViewStauts(){
    let { BenchmarkModel,EnergyStartDate, EnergyEndDate, EnergyUnitPrice,BenchmarkDatas,unit,CorrectionFactor} = this.props;
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
       {BenchmarkModel!==Model.Manual && <header className="jazz-save-effect-edit-step2-view-title">{I18N.SaveEffect.Create.CorrectionFactor}</header>}
       {BenchmarkModel!==Model.Manual && <div className="jazz-save-effect-edit-step2-view-text">{CorrectionFactor}</div>}
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
