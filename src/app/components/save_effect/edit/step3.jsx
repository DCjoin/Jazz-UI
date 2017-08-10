import React, { Component, PropTypes } from 'react';
import EditStep3 from '../create/step3.jsx';
import StepComponent from './stepComponent.jsx';
import FlatButton from "controls/NewFlatButton.jsx";
import util from 'util/Util.jsx';
import moment from 'moment';

function formatDate(date){
  return moment(util.DataConverter.JsonToDateTime(date)).format("YYYY-MM-DD")
}

export default class Step3 extends Component {

  state={
    isView:this.props.isView
  }

  _renderViewStauts(){
    let { EnergyStartDate, EnergyEndDate, EnergyUnitPrice} = this.props;
    return(
      <div className="jazz-save-effect-edit-step2-view">
        <header className="jazz-save-effect-edit-step2-view-title">{I18N.SaveEffect.EnergyCalculatePeriod}</header>
        <div className="jazz-save-effect-edit-step2-view-text">{`${formatDate(EnergyStartDate)} ${I18N.EM.To2} ${formatDate(EnergyEndDate)}`}</div>
        <header className="jazz-save-effect-edit-step2-view-title">{I18N.SaveEffect.EnergyUnitPrice}</header>
        <div className="jazz-save-effect-edit-step2-view-text">{EnergyUnitPrice}</div>
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
        <EditStep3 {...other}/>
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
     <StepComponent step={3} title={I18N.SaveEffect.Step3} isView={this.state.isView} >
       {this.state.isView?this._renderViewStauts():this._renderEditStauts()}
     </StepComponent>
   )
  }

}

Step3.propTypes = {
  isView:React.PropTypes.boolean,
  onSave:React.PropTypes.func,
  onCancel:React.PropTypes.func,
};
