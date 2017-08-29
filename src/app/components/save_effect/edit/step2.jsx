import React, { Component, PropTypes } from 'react';
import EditStep2 from '../create/step2.jsx';
import StepComponent from './stepComponent.jsx';
import FlatButton from "controls/NewFlatButton.jsx";
import CreateStore from 'stores/save_effect/create_store';
import util from 'util/Util.jsx';
import moment from 'moment';
import {Model} from 'constants/actionType/Effect.jsx';

function formatDate(date){
  return moment(util.DataConverter.JsonToDateTime(date)).format("YYYY-MM-DD")
}

export default class Step2 extends Component {  

  _renderViewStauts(){
    let { BenchmarkModel, BenchmarkStartDate, BenchmarkEndDate, CalculationStep} = this.props;
    return(
      <div className="jazz-save-effect-edit-step2-view">
        <header className="jazz-save-effect-edit-step2-view-title">{I18N.SaveEffect.Model.Title}</header>
        <div className="jazz-save-effect-edit-step2-view-text">{CreateStore.getBenchmarkModelById(BenchmarkModel)}</div>
        <header className="jazz-save-effect-edit-step2-view-title">{I18N.Setting.Tag.CalculationStep}</header>
        <div className="jazz-save-effect-edit-step2-view-text">{CreateStore.getCalculationStepByStep(CalculationStep)}</div>
        {BenchmarkModel!==Model.Manual && <header className="jazz-save-effect-edit-step2-view-title">{I18N.SaveEffect.BaselinePeriod}</header>}
        {BenchmarkModel!==Model.Manual && <div className="jazz-save-effect-edit-step2-view-text">{`${formatDate(BenchmarkStartDate)} ${I18N.EM.To2} ${formatDate(BenchmarkEndDate)}`}</div>}
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
