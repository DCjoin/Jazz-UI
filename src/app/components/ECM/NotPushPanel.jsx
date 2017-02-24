import React, { Component } from 'react';
import classnames from "classnames";
import MeasuresStore from 'stores/ECM/MeasuresStore.jsx';
import MeasuresAction from '../../actions/ECM/MeasuresAction.jsx';
import Checkbox from 'material-ui/Checkbox';
import FontIcon from 'material-ui/FontIcon';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'controls/FlatButton.jsx';
import NewDialog from 'controls/NewDialog.jsx';
import MeasuresItem from './MeasuresItem.jsx';
import {Snackbar, CircularProgress} from 'material-ui';
import {DIALOG_TYPE} from '../../constants/actionType/Measures.jsx';
import Title from './MeasurePart/MeasureTitle.jsx';
import Problem from './MeasurePart/Problem.jsx';
import {solutionList} from '../../../../mockData/measure.js';
import Immutable from 'immutable';

export default class NotPushPanel extends Component {
  constructor(props) {
    super(props);
    this._onChanged=this._onChanged.bind(this);
    this._onPush=this._onPush.bind(this);
    this._onDelete=this._onDelete.bind(this);
    this.merge=this.merge.bind(this);
    this._onMeasureItemClick=this._onMeasureItemClick.bind(this);


  }

  state={
    solutionList:null,//for test
    checkList:null,
    dialogType:null,
    handleIndex:null,
    snackbarText:null,
    measureIndex:null
    }

  _onChanged(){
    this.setState({
      solutionList:MeasuresStore.getSolutionList(),
      checkList:MeasuresStore.getCheckList(),
      snackbarText:MeasuresStore.getText()
    })
  }

  _onAllCheck(event,isChecked){
    MeasuresAction.checkSolution('all',isChecked);
  }

  _onPush(){
    var ids=MeasuresStore.getIds(this.state.handleIndex);
    MeasuresAction.pushProblem(ids);
    this.setState({
      dialogType:null,
      handleIndex:null
    })
  }

  _onDelete(){
    var ids=MeasuresStore.getIds(this.state.handleIndex);
    MeasuresAction.deleteProblem(ids);
    this.setState({
      dialogType:null,
      handleIndex:null
    })
  }

  _onMeasureItemClick(index){
    this.setState({
      dialogType:DIALOG_TYPE.MEASURE,
      measureIndex:index
    })
  }

  _renderAction(){
    return(
      <div className="action">
        <Checkbox disabled={MeasuresStore.IsAllCheckDisabled()} checked={MeasuresStore.getAllSelectedStatus()} onCheck={this._onAllCheck} label={I18N.Tag.SelectAll} style={{width:'100px'}}/>
        <RaisedButton label={I18N.Setting.ECM.PushAll} disabled={MeasuresStore.IsPushAllDisabled()} onClick={()=>{
            this.setState({
              dialogType:DIALOG_TYPE.BATCH_PUSH,
              handleIndex:'Batch'
            })
          }} />
      </div>
    )
  }

  _renderOperation(index){
    var styles={
      label:{
        fontSize:'16px'
      },
      button:{
        marginLeft:'15px'
      }
    };
    return(
      <div style={{display:'inline-block'}}>
        <FlatButton disabled={this.state.checkList.getIn([index,'disabled'])} label={I18N.Setting.ECM.Push}
                    onClick={()=>{
                      this.setState({
                        dialogType:DIALOG_TYPE.PUSH,
                        handleIndex:index
                      })
                    }} labelstyle={styles.label} icon={<FontIcon className="icon-to-ecm" style={styles.label}/>}/>
        <FlatButton label={I18N.Common.Button.Delete}
                    onClick={()=>{
                      this.setState({
                        dialogType:DIALOG_TYPE.DELETE,
                        handleIndex:index
                      })
                    }} labelstyle={styles.label} icon={<FontIcon className="icon-to-ecm" style={styles.label}/>} style={styles.button}/>
      </div>
    )
  }

  _renderList(){
    if(this.state.solutionList===null){
      return (
        <div className="flex-center">
         <CircularProgress  mode="indeterminate" size={80} />
       </div>
      )
    }
    else {
      return(
        <div className="content">
          {this.state.solutionList.map((solution,index)=>(
                    <MeasuresItem
                      measure={solution}
                      hasCheckBox={true}
                      isChecked={this.state.checkList.getIn([index,'checked'])}
                      onChecked={(ev,isChecked)=>{
                                  MeasuresAction.checkSolution(index,isChecked);
                                  }}
                      disabled={this.state.checkList.getIn([index,'disabled'])}
                      personInCharge={null}
                      action={this._renderOperation(index)}
                      onClick={()=>{this._onMeasureItemClick(index)}}/>
                  ))}
        </div>

      )
    }
  }

  _renderPushDialog(){
    var styles={
      content:{
        height:'100px',
        padding:'0 30px',
        display:'flex',
        justifyContent:'center'
      },
      action:{
        padding:'0 30px'
      }
    };
    var content=this.state.dialogType===DIALOG_TYPE.BATCH_PUSH
                ?I18N.format(I18N.Setting.ECM.BatchPushContent,MeasuresStore.getNamesById('Batch'))
                :I18N.format(I18N.Setting.ECM.PushContent,MeasuresStore.getNamesById(this.state.handleIndex));
    return(
      <NewDialog
        open={true}
        actionsContainerStyle={styles.action}
        contentStyle={styles.content}
        actions={[
            <RaisedButton
              label={I18N.Setting.ECM.Push}
              onClick={this._onPush} />,

            <FlatButton
              label={I18N.Common.Button.Cancel2}
              onClick={() => {this.setState({
                              dialogType: null,
                              handleIndex:null
                              })}} />
          ]}
      >{content}</NewDialog>
    )
  }

  _renderDeleteDialog(){
    var styles={
      content:{
        height:'100px',
        padding:'0 30px',
        display:'flex',
        justifyContent:'center'
      },
      action:{
        padding:'0 30px'
      }
    };
    var content=I18N.format(I18N.Setting.ECM.DeleteContent,MeasuresStore.getNamesById(this.state.handleIndex));
    return(
      <NewDialog
        open={true}
        actionsContainerStyle={styles.action}
        contentStyle={styles.content}
        actions={[
            <RaisedButton
              label={I18N.Common.Button.Delete}
              onClick={this._onDelete} />,

            <FlatButton
              label={I18N.Common.Button.Cancel2}
              onClick={() => {this.setState({
                              dialogType: null,
                              handleIndex:null
                              })}} />
          ]}
      >{content}</NewDialog>
    )
  }

  _renderMeasureDialog(){
    var onClose=()=>{
      //保存
      this.setState({
        dialogType:null,
        measureIndex:null
      })
    };
   var props={
     title:{
       measure:this.state.solutionList.getIn([this.state.measureIndex]),
       canNameEdit:true,
       canEnergySysEdit:true,
       merge:this.merge,
     },
     problem:{
       measure:this.state.solutionList.getIn([this.state.measureIndex]),
       canEdit:true,
       merge:this.merge,
     }
   }
    return(
      <NewDialog
        open={true}
        modal={false}
        isOutsideClose={false}
        onRequestClose={onClose}>
        <Title {...props.title}/>
        {this._renderOperation(this.state.measureIndex)}
        <Problem {...props.problem}/>
      </NewDialog>
    )
  }

  merge(paths,value){
    paths.unshift(this.state.measureIndex);
    MeasuresAction.merge(paths,value)
  }

  componentWillMount(){
    MeasuresStore.setSolutionList(solutionList,1);//for test
    this.setState({
      solutionList:Immutable.fromJS(solutionList),//for test
      checkList:MeasuresStore.getCheckList()
    })
  }

  componentDidMount(){
    MeasuresStore.addChangeListener(this._onChanged);
  }

  componentWillUnmount(){
    MeasuresStore.removeChangeListener(this._onChanged);
  }

  render(){
    var dialog=null;
    switch (this.state.dialogType) {
      case DIALOG_TYPE.PUSH:
      case DIALOG_TYPE.BATCH_PUSH:
            dialog=this._renderPushDialog();
            break;
      case DIALOG_TYPE.DELETE:
            dialog=this._renderDeleteDialog();
            break;
      case DIALOG_TYPE.MEASURE:
            dialog=this._renderMeasureDialog();
            break;
      default:

    }
    return(
      <div className="jazz-ecm-notPush">
        {this._renderAction()}
        {this._renderList()}
        {dialog}
        <Snackbar ref='snackbar' open={!!this.state.snackbarText} onRequestClose={()=>{
            MeasuresAction.resetErrorText()
          }} message={this.state.snackbarText}/>
      </div>
    )

  }
}

  NotPushPanel.propTypes = {
  };
