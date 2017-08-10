import React, { Component, PropTypes } from 'react';
import EditStep2 from '../create/step2.jsx';
import StepComponent from './stepComponent.jsx';
import FlatButton from "controls/NewFlatButton.jsx";
import CreateStore from 'stores/save_effect/create_store';
import util from 'util/Util.jsx';
import moment from 'moment';

function formatDate(date){
  return moment(util.DataConverter.JsonToDateTime(date)).format("YYYY-MM-DD")
}

export default class Step2 extends Component {

  state={
    isView:this.props.isView
  }

  _renderViewStauts(){
    let { BenchmarkModel, BenchmarkStartDate, BenchmarkEndDate, CalculationStep} = this.props;
    return(
      <div className="jazz-save-effect-edit-step2-view">
        <header className="jazz-save-effect-edit-step2-view-title">{I18N.SaveEffect.Model.Title}</header>
        <div className="jazz-save-effect-edit-step2-view-text">{CreateStore.getBenchmarkModelById(BenchmarkModel)}</div>
        <header className="jazz-save-effect-edit-step2-view-title">{I18N.Setting.Tag.CalculationStep}</header>
        <div className="jazz-save-effect-edit-step2-view-text">{CreateStore.getCalculationStepByStep(CalculationStep)}</div>
        <header className="jazz-save-effect-edit-step2-view-title">{I18N.SaveEffect.BaselinePeriod}</header>
        <div className="jazz-save-effect-edit-step2-view-text">`${formatDate(BenchmarkStartDate)} ${I18N.EM.To2} ${formatDate(BenchmarkEndDate)}`</div>
      </div>
    )
  }

  _renderEditStauts(){
    var {isView,onSave,onCancel,...other}=this.props;
    var actions=[
        <FlatButton label={I18N.Platform.Password.Confirm} primary={true} style={{float:'right',marginRight:'20px'}} onTouchTap={()=>{onSave()}}/>,
      <FlatButton label={I18N.Common.Button.Cancel2} secondary={true} style={{float:'right'}} onTouchTap={onCancel}/>
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

  componentWillReceiveProps(nextProps) {
    if(nextProps.isView!==this.props.isView){
      this.setState({
        isView:nextProps.isView
      })
    }
  }

  render(){
   return(
     <StepComponent step={2} title={I18N.SaveEffect.Step2} isView={this.state.isView} >
       {this.state.isView?this._renderViewStauts():this._renderEditStauts()}
     </StepComponent>
   )
  }

}

Step2.propTypes = {
  isView:React.PropTypes.boolean,
  onSave:React.PropTypes.func,
  onCancel:React.PropTypes.func,
};
