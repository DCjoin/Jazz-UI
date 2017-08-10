import React, { Component, PropTypes } from 'react';
import EditStep1 from '../create/step1.jsx';
import StepComponent from './stepComponent.jsx';
import FlatButton from "controls/NewFlatButton.jsx";

export default class Step1 extends Component {

  state={
    isView:this.props.isView
  }

  _renderViewStauts(){
    return(
      <div className="jazz-save-effect-edit-step1-view">
        <header className="jazz-save-effect-edit-step1-view-title">{I18N.Setting.Tag.Tag}</header>
        {this.props.tags.map(tag=>(<div>{tag.get('Name')}</div>))}
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
      <div className="jazz-save-effect-edit-step1-edit">
        <EditStep1 {...other}/>
        <div className="jazz-save-effect-edit-step1-edit-actions">
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
     <StepComponent step={1} title={I18N.SaveEffect.Step1} isView={this.state.isView} >
       {this.state.isView?this._renderViewStauts():this._renderEditStauts()}
     </StepComponent>
   )
  }

}

Step1.propTypes = {
  tags:React.PropTypes.object,
  selectedId:React.PropTypes.number,
  onClickItem:React.PropTypes.func,
  onDeleteItem:React.PropTypes.func,
  onAddItem:React.PropTypes.func,
  isView:React.PropTypes.boolean,
  onSave:React.PropTypes.func,
  onCancel:React.PropTypes.func,
};
