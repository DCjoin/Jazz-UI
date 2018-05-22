import React, { Component } from 'react';
import IconButton from 'material-ui/IconButton';
import FlatButton from 'controls/FlatButton.jsx';
import MeasuresStore from 'stores/ECM/MeasuresStore.jsx';
import Snackbar from 'material-ui/Snackbar';
import Immutable from 'immutable';
import NewDialog from 'controls/NewDialog.jsx';
import RaisedButton from 'material-ui/RaisedButton';
import ImagGroupPanel from 'controls/ImagGroupPanel.jsx';
import {PlanTitle,ProblemDetail,PlanDetail} from '../Diagnose/generate_solution.jsx';
export default class PushConfirmDialog extends Component {
  constructor(props) {
    super(props);
    this._onClose=this._onClose.bind(this);
    this._onChange=this._onChange.bind(this);
    this._onPush=this._onPush.bind(this);
    
    
  }

    state={
      solution:this.props.solution,
      snackBarOpen:false,
      saveTipShow:false
    }

    _onClose(){
      if(MeasuresStore.IsSolutionDisable(this.state.solution.toJS())){
        this.setState({
          snackBarOpen:true
        })
      }else{
        if(Immutable.is(this.state.solution,this.props.solution)){
          this.props.onClose()
        }else{
          this.setState({
            saveTipShow:true
          })
        }
      }
    }

     _onChange( paths, value ) {
        this.setState({
          solution: this.state.solution.setIn(paths, value)
        });
      }

    _onPush(e){
       if(MeasuresStore.IsSolutionDisable(this.state.solution.toJS())){
        this.setState({
          snackBarOpen:true
        })
      }else{
        this.props.onPush(e)
      }     
    }

    _renderFooter(){
                return(
                        <div className="solution-footer">
                                <div className="action">
                                     <FlatButton flat primary label={I18N.Setting.ECM.PushBtn}
                                             onClick={this._onPush}/>
                                     <FlatButton outline secondary label={I18N.Common.Button.Delete} onClick={this.props.onDelete}/>
                                </div>
                        </div>
                )
        }

    _renderSaveTip(){
          var styles={
      content:{
        padding:'30px',
        display:'flex',
        justifyContent:'center'
      },
      action:{
        padding:'0 30px'
      }
    };
    var content=I18N.format(I18N.Setting.ECM.SaveTip);
    return(
      <NewDialog
        open={true}
        actionsContainerStyle={styles.action}
        overlayStyle={{zIndex:'1000'}}
        contentStyle={styles.content}
        actions={[
            <RaisedButton
              label={I18N.Common.Button.Save}
              onClick={()=>{this.props.onSave(this.state.solution)}} />,
            <FlatButton
              label={I18N.Common.Button.NotSave}
              onClick={() => {this.setState({
                              saveTipShow:false
                              },()=>{
                                this.props.onClose()
                              })}} />
          ]}
      ><div className="jazz-ecm-measure-viewabletext">{content}</div></NewDialog>
    )
    }

    render(){
      return(
        <div className="solution-edit">
          <div className="content-field">
            <div className="solution-head">{I18N.Setting.ECM.Solution}</div>
            <IconButton iconClassName="icon-close" style={{padding:0,width:'24px',height:'26px'}} iconStyle={{fontSize:'24px',color:"#9fa0a4"}}
             onClick={this._onClose}/>
             <div className="solution-content">
                <session className='session-container'>
                  <PlanTitle isRequired={true} energySolution={this.state.solution} onChange={this._onChange}/>
                </session>
                <session className='session-container'>
                  <PlanDetail isRequired={true} Solutions={this.state.solution.get('Solutions')} onChange={this._onChange}/>
                </session>
                <session className='session-container'>
                  <ProblemDetail isRequired={true} energySolution={this.state.solution} onChange={this._onChange} hasEnergySys={false}/>
                </session>
             </div>

          </div>
         
          {this._renderFooter()}
         <Snackbar ref='snackbar' autoHideDuration={1500} open={!!this.state.snackBarOpen} onRequestClose={()=>{this.setState({snackBarOpen:false})}} message={I18N.Setting.ECM.RequiredTip}/>
         {this.state.saveTipShow && this._renderSaveTip()}
        </div>
      )
    }

}
