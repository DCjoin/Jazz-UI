import React, { Component } from 'react';
import classnames from "classnames";
import MeasuresStore from 'stores/ECM/MeasuresStore.jsx';
import MeasuresAction from 'actions/ECM/MeasuresAction.jsx';
import {Status} from 'constants/actionType/Measures.jsx';
import {DataConverter} from 'util/Util.jsx';
import MeasuresItem from './MeasuresItem.jsx';
import {Snackbar,CircularProgress} from 'material-ui';
import Title from './MeasurePart/MeasureTitle.jsx';
import Problem from './MeasurePart/Problem.jsx';
import Solution from './MeasurePart/Solution.jsx';
import SolutionGallery from './MeasurePart/SolutionGallery.jsx';
import NewDialog from 'controls/NewDialog.jsx';
import PermissionCode from 'constants/PermissionCode.jsx';
import CurrentUserStore from 'stores/CurrentUserStore.jsx';
import privilegeUtil from 'util/privilegeUtil.jsx';
import Supervisor from './MeasurePart/Supervisor.jsx';
import BubbleIcon from '../BubbleIcon.jsx';
import StatusCmp from './MeasurePart/Status.jsx';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'controls/FlatButton.jsx';
import Remark from './MeasurePart/Remark.jsx';

function privilegeWithPush( privilegeCheck ) {
  // return true
	return privilegeCheck(PermissionCode.PUSH_SOLUTION, CurrentUserStore.getCurrentPrivilege());
}
//能源经理
function PushIsFull() {
	return privilegeWithPush(privilegeUtil.isFull.bind(privilegeUtil));
}

function privilegeWithPushAndNotPush( privilegeCheck ) {
  // return true
	return privilegeCheck(PermissionCode.SOLUTION_FULL, CurrentUserStore.getCurrentPrivilege());
}
  //顾问
function PushAndNotPushIsFull() {
	return privilegeWithPushAndNotPush(privilegeUtil.isFull.bind(privilegeUtil));
}

function currentUserId(){
  return CurrentUserStore.getCurrentUser().Id
}

function IsUserSelf(userId){
  return currentUserId()===userId
}

function canEdit(userId){
  return PushAndNotPushIsFull() || (PushIsFull() && IsUserSelf(userId))
}

function displayUnread(infoTabNo){
  return PushAndNotPushIsFull()?(infoTabNo===2):(infoTabNo===1 || infoTabNo===3);
}

function canEditSupervisor(infoTabNo){
  return PushIsFull() && (infoTabNo===1 || (infoTabNo===2))
}

const status=[Status.ToBe,Status.Being,Status.Done,Status.Canceled];
export default class PushPanel extends Component {

  constructor(props) {
    super(props);
    this._onChanged=this._onChanged.bind(this);
    this._handlerSwitchTab=this._handlerSwitchTab.bind(this);
    this._onMeasureItemClick=this._onMeasureItemClick.bind(this);
    this.merge=this.merge.bind(this);

  }


  state={
    solutionList:null,
    infoTabNo:1,
    measureIndex:null,
    measureShow:false,
    supervisorList:null,
    snackbarText:null,
    activeCounts:[],
    unRead:[],
    toBeStatus:null
  }

  _onChanged(){
    this.setState({
      solutionList:MeasuresStore.getSolutionList(),
      supervisorList:MeasuresStore.getSupervisor(),
      snackbarText:MeasuresStore.getText(),
      activeCounts:MeasuresStore.getActiveCounts(),
      unRead:MeasuresStore.getUnread()
    })
  }

  _onMeasureItemClick(index){
    var measure=this.state.solutionList.getIn([index]);
    if(displayUnread(this.state.infoTabNo) && !measure.getIn(['EnergyProblem','IsRead'])){
      MeasuresAction.readProblem(measure.getIn(['EnergyProblem','Id']));
    }
    this.setState({
      measureShow:true,
      measureIndex:index,
    })
  }

  _handlerSwitchTab(no) {
    //let no = parseInt(event.target.getAttribute("data-tab-index"));
    this.setState({
      infoTabNo: no,
      measureIndex:null,
      measureShow:false,
      solutionList:null,
    },()=>{
      MeasuresAction.getGroupSettingsList(this.props.hierarchyId,status[no-1]);
    });
  }

  _onStatusChange(value){
    if(value!==this.state.solutionList.getIn([this.state.measureIndex,'EnergyProblem','Status'])){
      this.setState({
        toBeStatus:value
      })
    }

  }

  _renderTabTitle(status,unread,count){
    return (
      <div className="jazz-ecm-tab-title">
        {status}
        {unread?<BubbleIcon style={{width:'5px',height:'5px'}}/>:null}
        <div style={{marginLeft:'5px'}}>{count}</div>
      </div>
    )

  }

  _renderTab(){
    var unRead;
    if(PushAndNotPushIsFull()){
      //顾问
      unRead=[false,this.state.unRead[0],false]
    }else {
      unRead=[this.state.unRead[0],false,this.state.unRead[1]];
    }
    return(
      <div className="jazz-ecm-push-tabs">
        <span className={classnames({
              "jazz-ecm-push-tabs-tab": true,
              "selected": this.state.infoTabNo === 1
            })} data-tab-index="1" onClick={this._handlerSwitchTab.bind(this,1)}>{this._renderTabTitle(I18N.Setting.ECM.PushPanel.ToBe,unRead[0],this.state.activeCounts[0])}</span>
        <span className={classnames({
                "jazz-ecm-push-tabs-tab": true,
                "selected": this.state.infoTabNo === 2
              })} data-tab-index="2" onClick={this._handlerSwitchTab.bind(this,2)}>{this._renderTabTitle(I18N.Setting.ECM.PushPanel.Being,unRead[1],this.state.activeCounts[1])}</span>
        <span className={classnames({
                "jazz-ecm-push-tabs-tab": true,
                "selected": this.state.infoTabNo === 3
              })} data-tab-index="3" onClick={this._handlerSwitchTab.bind(this,3)}>{this._renderTabTitle(I18N.Setting.ECM.PushPanel.Done,unRead[2],this.state.activeCounts[2])}</span>
        <span className={classnames({
                "jazz-ecm-push-tabs-tab": true,
                "selected": this.state.infoTabNo === 4
              })} data-tab-index="4" onClick={this._handlerSwitchTab.bind(this,4)}>{I18N.Setting.ECM.PushPanel.Canceled}</span>
      </div>
    )
  }

  _renderPersonInCharge(problem,indetail=false){
    return(
      <Supervisor person={problem.get('Supervisor')} supervisorList={this.state.supervisorList}
                  onSuperviorClick={(id)=>{
                    MeasuresAction.assignSupervisor(problem.get('Id'),id,()=>{
                      this.refresh(status[this.state.infoTabNo-1])
                    })
                  }}
                  usedInDetail={indetail}
                  canEdit={canEditSupervisor(this.state.infoTabNo)}/>
    )
  }

  _renderListByTimeType(type){
    var label=type===1?I18N.Setting.ECM.PushPanel.ThisMonth
              :type===2?I18N.Setting.ECM.PushPanel.Last3Month
              :I18N.Setting.ECM.PushPanel.Earlier;
    var List=[];
    this.state.solutionList.forEach((solution,index)=>{
      var time=DataConverter.JsonToDateTime(solution.getIn(['EnergyProblem','CreateTime']));
      if(MeasuresStore.isSolutionValid(type,time)){
        List.push(
                <MeasuresItem
                  measure={solution}
                  hasCheckBox={false}
                  personInCharge={this._renderPersonInCharge(solution.get('EnergyProblem'))}
                  onClick={()=>{this._onMeasureItemClick(index)}}
                  displayUnread={displayUnread(this.state.infoTabNo)}/>
        )
      }
    })

    if(List.length===0){
      return null
    }
    return(
      <div className='row'>
        <div className="label">{label}</div>
        {List}
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
    else if(this.state.solutionList.size===0){
      return null
    }
    else {
      return(
        <div className="content">
          {this._renderListByTimeType(1)}
          {this._renderListByTimeType(2)}
          {this._renderListByTimeType(3)}
        </div>
      )
    }
  }

  _renderStatusDialog(){
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
    var name=MeasuresStore.getNamesById(this.state.measureIndex);
    var content;
    switch (this.state.toBeStatus) {
      case Status.ToBe:
          content=I18N.format(I18N.Setting.ECM.StatusToBe,name);
        break;
      case Status.Done:
          content=I18N.format(I18N.Setting.ECM.StatusToDone,name);
        break;
      case Status.Canceled:
          content=I18N.format(I18N.Setting.ECM.StatusToCancel,name);
        break;
      default:

    }
    return(
      <NewDialog
        open={true}
        overlayStyle={{zIndex:'1000'}}
        actionsContainerStyle={styles.action}
        contentStyle={styles.content}
        actions={[
            <RaisedButton
              label={I18N.Common.Button.Confirm}
              onClick={()=>{
                var currentSolution=this.state.solutionList.getIn([this.state.measureIndex]);
                var st=this.state.toBeStatus;
                currentSolution=currentSolution.setIn(['EnergyProblem','Status'],st);
                this.setState({
                  measureShow:false,
                  measureIndex:null,
                  toBeStatus:null
                },()=>{
                  if(this.state.infoTabNo===4){
                    currentSolution=currentSolution.setIn(['EnergyProblem','Supervisor'],null)
                  }
                  MeasuresAction.updateSolution(currentSolution.toJS(),()=>{
                    MeasuresAction.setSnackBarText(st);
                    this.refresh(status[this.state.infoTabNo-1])
                  });
                })

              }} />,

            <FlatButton
              label={I18N.Common.Button.Cancel2}
              onClick={() => {this.setState({
                              toBeStatus: null
                              })}} />
          ]}
      ><div className="jazz-ecm-measure-viewabletext">{content}</div></NewDialog>
    )
  }

  _renderOperation(){
    var problem=this.state.solutionList.getIn([this.state.measureIndex,'EnergyProblem']),
        user=problem.get('CreateUserName'),
        status=problem.get('Status');
    return(
      <div className="jazz-ecm-push-operation">
        <StatusCmp status={status} canEdit={PushAndNotPushIsFull()} onChange={this._onStatusChange.bind(this)}/>
        {this._renderPersonInCharge(problem,true)}
        <div>{`${I18N.Setting.ECM.PushPanel.CreateUser}：${user || '-'}`}</div>
      </div>
    )
  }

  _renderMeasureDialog(){
    var currentSolution=this.state.solutionList.getIn([this.state.measureIndex]);
    var createUserId=this.state.solutionList.getIn([this.state.measureIndex,'EnergyProblem','CreateUserId']);
    var onClose=()=>{
      this.setState({
        measureShow:false,
        measureIndex:null
      },()=>{
        //currentSolution=MeasuresStore.getValidParams(currentSolution);
        MeasuresAction.updateSolution(currentSolution.toJS(),()=>{this.refresh(status[this.state.infoTabNo-1])});
      })
    };
   var props={
     title:{
       measure:currentSolution,
       canNameEdit:canEdit(createUserId),
       canEnergySysEdit:canEdit(createUserId),
       merge:this.merge,
     },
     problem:{
       measure:currentSolution,
       canEdit:canEdit(createUserId),
       merge:this.merge,
     },
     solution:{
       measure:currentSolution,
       canEdit:canEdit(createUserId),
       merge:this.merge,
     },
     gallery: {
      measure:currentSolution,
      onDelete: (idx) => {
        let imagesPath = ['EnergyProblem','EnergyProblemImages'];
        this.merge(imagesPath, currentSolution.getIn(imagesPath).delete(idx));
      }
     },
     remark:{
       problemId:currentSolution.getIn(['EnergyProblem','Id']),
       canEdit:PushIsFull() || PushAndNotPushIsFull()
     }
   }
    return(
      <NewDialog
        open={this.state.measureShow}
        modal={false}
        isOutsideClose={false}
        onRequestClose={onClose}
        titleStyle={{margin:'0 24px'}}
        contentStyle={{overflowY: 'auto',paddingRight:'5px',display:'block'}}>
        <Title {...props.title}/>
        {this._renderOperation()}
        <Solution {...props.solution}/>
        <Problem {...props.problem}/>
        <SolutionGallery {...props.gallery}/>
        <Remark {...props.remark}/>
      </NewDialog>
    )
  }

  merge(paths,value){
    paths.unshift(this.state.measureIndex);
    MeasuresAction.merge(paths,value)
  }

  refresh(status){
    var statusArr=[];
    if(PushAndNotPushIsFull()){
      statusArr=[Status.Being]
    }else {
      statusArr=[Status.ToBe,Status.Done]
    }
    MeasuresAction.getActivecounts(this.props.hierarchyId,()=>{
      MeasuresAction.getContainsunread(this.props.hierarchyId,statusArr,()=>{
        MeasuresAction.getGroupSettingsList(this.props.hierarchyId,status);
      })
    })
  }

  componentDidMount(){
    MeasuresStore.addChangeListener(this._onChanged);
    this.refresh(Status.ToBe);

   if(PushIsFull()){
      MeasuresAction.getSupervisor(this.props.hierarchyId);
   }

  }
  componentWillReceiveProps(nextProps) {
    if(nextProps.hierarchyId !== this.props.hierarchyId) {
      MeasuresAction.getGroupSettingsList(nextProps.hierarchyId,Status.ToBe);
    }
  }

  componentWillUnmount(){
    MeasuresStore.removeChangeListener(this._onChanged);
  }

  render(){
    return(
      <div className="jazz-ecm-push">
        {this._renderTab()}
        {this._renderList()}
        {this.state.solutionList!==null && this.state.solutionList.size!==0 && this._renderMeasureDialog()}
        {this.state.toBeStatus!==null && this._renderStatusDialog()}
        <Snackbar ref='snackbar' open={!!this.state.snackbarText} onRequestClose={()=>{
            MeasuresAction.resetErrorText()
          }} message={this.state.snackbarText}/>
      </div>
    )
  }
}

PushPanel.propTypes = {
  hierarchyId:React.PropTypes.number,
};
