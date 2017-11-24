import React, { Component, PropTypes } from 'react';
import EditStep1 from '../create/step1.jsx';
import StepComponent from './stepComponent.jsx';
import FlatButton from "controls/NewFlatButton.jsx";

export default class Step1 extends Component {

  state={
    selectedId:this.props.selectedId,
    tagName:this.props.tagName,
    step:this.props.step,
    uomId:this.props.uomId,
  }

  _renderViewStauts(){
    return(
      <div className="jazz-save-effect-edit-step1-view">
        <header className="jazz-save-effect-edit-step1-view-title">{I18N.Setting.Tag.Tag}</header>
        {this.state.tagName}
      </div>
    )
  }

  _renderEditStauts(){
    var {isView,onSave,onCancel,onDeleteItem,...other}=this.props;
    var actions=[
        <FlatButton label={I18N.Common.Button.Cancel2} secondary={true} style={{float:'right',minWidth:'68px'}} onTouchTap={onCancel}/>,
        <FlatButton label={I18N.Platform.Password.Confirm} disabled={this.state.selectedId===null} primary={true} style={{float:'right',minWidth:'68px',marginRight:'20px'}} 
              onTouchTap={()=>{
                            if(this.state.selectedId!==this.props.selectedId) onSave(this.state.selectedId,this.state.tagName,this.state.step,this.state.uomId)
                                else{
                                  onCancel()
                                }}}/>      
    ]
    return(
      <div className="jazz-save-effect-edit-step1-edit">
        <EditStep1 {...other} selectedId={this.state.selectedId} onClickItem={(TagId,tagName,step,uomId)=>{
                                                                              this.setState({selectedId:TagId,tagName,step,uomId})}}
          onDeleteItem={(idx, tagId) => {
            if(tagId===this.state.selectedId){
              this.setState({
                selectedId:null
              })
            }
            onDeleteItem(idx, tagId)}}/>
        <div className="jazz-save-effect-edit-step1-edit-actions">
          {actions}
        </div>
      </div>
    )
  }

  shouldComponentUpdate(nextProps, nextState) {
    return nextProps.configStep<=2 || nextProps.configStep===null || this.props.configStep!==nextProps.configStep
  }

    componentWillReceiveProps(nextProps) {
    if(nextProps.tagName!==this.props.tagName){
      this.setState({
        tagName:nextProps.tagName
      })
    }
  }

  render(){
    var editDisabled=this.props.configStep!==1 && this.props.configStep!==null;
   return(
     <StepComponent step={1} isfolded={false} title={I18N.SaveEffect.Step1} 
                    isView={this.props.isView} editDisabled={editDisabled} onEdit={this.props.onEdit}>
       {this.props.isView?this._renderViewStauts():this._renderEditStauts()}
     </StepComponent>
   )
  }

}

Step1.propTypes = {
  tags:React.PropTypes.object,
  tagName:React.PropTypes.string,
  selectedId:React.PropTypes.number,
  onClickItem:React.PropTypes.func,
  onDeleteItem:React.PropTypes.func,
  onAddItem:React.PropTypes.func,
  isView:React.PropTypes.boolean,
  // editDisabled:React.PropTypes.boolean,
  onSave:React.PropTypes.func,
  onCancel:React.PropTypes.func,
  onEdit:React.PropTypes.func,
  configStep:React.PropTypes.number || null
};
