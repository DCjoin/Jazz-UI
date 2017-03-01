import React, { Component } from 'react';
import MeasuresStore from 'stores/ECM/MeasuresStore.jsx';
import MeasuresAction from 'actions/ECM/MeasuresAction.jsx';
import {Status} from '../../constants/actionType/Measures.jsx';
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
import Solution from './MeasurePart/Solution.jsx';
import SolutionGallery from './MeasurePart/SolutionGallery.jsx';
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
    solutionList:null,
    checkList:null,
    dialogType:null,
    handleIndex:null,
    snackbarText:null,
    measureIndex:null,
    measureShow:false
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
      measureShow:true,
      measureIndex:index
    })
  }

  _renderAction(){
    if(this.state.solutionList===null || this.state.solutionList.size===0){
      return null
    }else {
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
      <div style={{display:'inline-block'}} onClick={(e)=>{e.stopPropagation()}}>
        <FlatButton disabled={MeasuresStore.IsSolutionDisable(this.state.solutionList.getIn([index,'EnergySolution']).toJS())} label={I18N.Setting.ECM.Push}
                    onClick={(e)=>{
                      e.stopPropagation();
                      this.setState({
                        dialogType:DIALOG_TYPE.PUSH,
                        handleIndex:index
                      })
                    }} labelstyle={styles.label} icon={<FontIcon className="icon-to-ecm" style={styles.label}/>}/>
        <FlatButton label={I18N.Common.Button.Delete}
                    onClick={(e)=>{
                      e.stopPropagation();
                      this.setState({
                        dialogType:DIALOG_TYPE.DELETE,
                        handleIndex:index
                      })
                    }} labelstyle={styles.label} icon={<FontIcon className="icon-delete" style={styles.label}/>} style={styles.button}/>
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
    }else if(this.state.solutionList.size===0){
      return null
    }
    else {
      return(
        <div className="content">
          {this.state.solutionList.map((solution,index)=>(
                    <MeasuresItem
                      measure={solution}
                      hasCheckBox={true}
                      isChecked={this.state.checkList.getIn([index,'checked'])}
                      onChecked={(e,isChecked)=>{
                                  MeasuresAction.checkSolution(index,isChecked);
                                  }}
                      disabled={MeasuresStore.IsSolutionDisable(solution.get('EnergySolution').toJS())}
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
        overlayStyle={{zIndex:'1000'}}
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
        overlayStyle={{zIndex:'1000'}}
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
    var currentSolution=this.state.solutionList.getIn([this.state.measureIndex]);
    var onClose=()=>{
      this.setState({
        measureShow:false,
        measureIndex:null
    },()=>{
      // currentSolution=MeasuresStore.getValidParams(currentSolution);
      MeasuresAction.updateSolution(currentSolution.toJS());
    })
    };
   var props={
     title:{
       measure:currentSolution,
       canNameEdit:true,
       canEnergySysEdit:true,
       merge:this.merge,
     },
     problem:{
       measure:currentSolution,
       canEdit:true,
       merge:this.merge,
     },
     solution:{
       measure:currentSolution,
       canEdit:true,
       merge:this.merge,
     },
     gallery: {
      measure:currentSolution,
      onDelete: (idx) => {
        let imagesPath = ['EnergyProblem','EnergyProblemImages'];
        this.merge(imagesPath, currentSolution.getIn(imagesPath).delete(idx));
      }
     }
   }
    return(
      <NewDialog
        open={this.state.measureShow}
        modal={false}
        isOutsideClose={false}
        onRequestClose={onClose}
        contentStyle={{overflowY: 'auto',paddingRight:'5px'}}>
        <Title {...props.title}/>
        {this._renderOperation(this.state.measureIndex)}
        <Solution {...props.solution}/>
        <Problem {...props.problem}/>
        <SolutionGallery {...props.gallery}/>
      </NewDialog>
    )
  }

  merge(paths,value){
    paths.unshift(this.state.measureIndex);
    MeasuresAction.merge(paths,value)
  }

  // componentWillMount(){
  //   MeasuresStore.setSolutionList(solutionList,1);//for test
  //   this.setState({
  //     solutionList:Immutable.fromJS(solutionList),//for test
  //     checkList:MeasuresStore.getCheckList()
  //   })
  // }

  componentDidMount(){
    MeasuresStore.addChangeListener(this._onChanged);
    MeasuresAction.getGroupSettingsList(this.props.hierarchyId,Status.NotPush);
    // MeasuresAction.getGroupSettingsList(100001,Status.NotPush);
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.hierarchyId !== this.props.hierarchyId) {
      MeasuresAction.getGroupSettingsList(nextProps.hierarchyId,Status.NotPush);
    }
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
      default:

    }
    return(
      <div className="jazz-ecm-notPush">
        {this._renderAction()}
        {this._renderList()}
        {dialog}
        {this.state.solutionList!==null && this.state.solutionList.size!==0 && this._renderMeasureDialog()}
        <Snackbar ref='snackbar' open={!!this.state.snackbarText} onRequestClose={()=>{
            MeasuresAction.resetErrorText()
          }} message={this.state.snackbarText}/>
      </div>
    )

  }
}

  NotPushPanel.propTypes = {
    hierarchyId:React.PropTypes.number,
  };
