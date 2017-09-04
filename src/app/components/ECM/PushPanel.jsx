import React, { Component } from 'react';
import ReactDom from 'react-dom';
import classnames from "classnames";
import MeasuresStore from 'stores/ECM/MeasuresStore.jsx';
import MeasuresAction from 'actions/ECM/MeasuresAction.jsx';
import RoutePath from 'util/RoutePath.jsx';
import {Status,Msg} from 'constants/actionType/Measures.jsx';
import {DataConverter,openTab} from 'util/Util.jsx';
import {MeasuresItem} from './MeasuresItem.jsx';
import {Snackbar,CircularProgress} from 'material-ui';
import {EnergySys} from './MeasurePart/MeasureTitle.jsx';
import Problem from './MeasurePart/Problem.jsx';
import {Solution,SolutionLabel} from './MeasurePart/Solution.jsx';
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
import NewFlatButton from 'controls/NewFlatButton.jsx';
import Remark from './MeasurePart/Remark.jsx';
import DisappareItem from './MeasurePart/DisappareItem.jsx';

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

//节能效果权限
function privilegeWithSaveEffect( privilegeCheck ) {
  //  return true
	return privilegeCheck(PermissionCode.Save_Effect, CurrentUserStore.getCurrentPrivilege());
}
function EffectIsFullOrIsView() {
	return privilegeWithSaveEffect(privilegeUtil.isFull.bind(privilegeUtil)) || privilegeWithSaveEffect(privilegeUtil.isView.bind(privilegeUtil));
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

function canEditStatus(userId,infoTabNo){
  return canEdit(userId) && (infoTabNo!==3)
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
    toBeStatus:null,
    statusDialogShow:false,
    deleteSupervisorErrorMsg:null
  }

  _afterAnimation=()=>{}

  _onChanged(error,msg){
    this.setState({
      solutionList:MeasuresStore.getSolutionList(),
      supervisorList:MeasuresStore.getSupervisor(),
      snackbarText:MeasuresStore.getText(),
      activeCounts:MeasuresStore.getActiveCounts(),
      unRead:MeasuresStore.getUnread(),
      deleteSupervisorErrorMsg:error===Msg.DELETE_SUPERVISOR_ERROR?msg:this.state.deleteSupervisorErrorMsg
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
        toBeStatus:value,
        statusDialogShow:true
      })
    }

  }

  _renderTabTitle(status,unread,count){
    return (
      <div className="jazz-ecm-tab-title">
        <div>{status}</div>
        {count!==0?<div style={{marginLeft:'5px'}}>{count}</div>:null}
        {unread?<BubbleIcon style={{width:'5px',height:'5px'}}/>:null}
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
            })} ref="tobe" data-tab-index="1" style={{marginLeft:'15px'}} onClick={this._handlerSwitchTab.bind(this,1)}>{this._renderTabTitle(I18N.Setting.ECM.PushPanel.ToBe,unRead[0],this.state.activeCounts[0])}</span>
        <span className={classnames({
                "jazz-ecm-push-tabs-tab": true,
                "selected": this.state.infoTabNo === 2
              })} ref="being" data-tab-index="2" onClick={this._handlerSwitchTab.bind(this,2)}>{this._renderTabTitle(I18N.Setting.ECM.PushPanel.Being,unRead[1],this.state.activeCounts[1])}</span>
        <span className={classnames({
                "jazz-ecm-push-tabs-tab": true,
                "selected": this.state.infoTabNo === 3
              })} ref="done" data-tab-index="3" onClick={this._handlerSwitchTab.bind(this,3)}>{this._renderTabTitle(I18N.Setting.ECM.PushPanel.Done,unRead[2],this.state.activeCounts[2])}</span>
        <span className={classnames({
                "jazz-ecm-push-tabs-tab": true,
                "selected": this.state.infoTabNo === 4
              })} ref="canceled" data-tab-index="4" onClick={this._handlerSwitchTab.bind(this,4)}>{this._renderTabTitle(I18N.Setting.ECM.PushPanel.Canceled,false,null)}</span>
      </div>
    )
  }

  _renderPersonInCharge(problem,indetail=false,index){
    return(
      <Supervisor person={problem.get('Supervisor')} supervisorList={this.state.supervisorList}
                  onSuperviorClick={(id)=>{
                    if(indetail){
                      var currentSolution=this.state.solutionList.getIn([this.state.measureIndex]);
                      MeasuresAction.updateSolution(currentSolution.toJS(),()=>{
                          MeasuresAction.assignSupervisor(problem.get('Id'),id,problem.get('IsConsultant'));
                      })
                    }else {
                      MeasuresAction.assignSupervisor(problem.get('Id'),id,problem.get('IsConsultant'));
                    }

                    this._afterAnimation=()=>{
                      this.setState({
                        measureIndex:null,
                        solutionList:null
                      },()=>{
                        this.refresh(status[this.state.infoTabNo-1]);
                      })
                    }
                    if(this.state.infoTabNo===2){
                      this.setState({
                        measureIndex:null,
                        solutionList:null,
                        measureShow:false
                      },()=>{
                        this.refresh(status[this.state.infoTabNo-1]);
                      })
                    }else
                    if(this.state.measureIndex===null){
                      this.setState({
                        measureIndex:index
                      })
                    }else {
                      this.setState({
                          measureShow:false
                      })
                    }
                  }}
                  usedInDetail={indetail}
                  canEdit={canEditSupervisor(this.state.infoTabNo)}
                  energySys={problem.get('EnergySys')}/>
    )
  }

	_renderEffectAction(solution){
		return(
			<div style={{width:'110px',minWidth:'110px'}} onClick={(e)=>{e.stopPropagation();}}>
				{this.state.infoTabNo===3 && EffectIsFullOrIsView() && solution.get("EnergyEffectStatus")
					&& <NewFlatButton label={I18N.MainMenu.SaveEffect}
														secondary={true}
														style={{width:'95px',height:'30px',lineHeight:'28px',float:'right'}}
														onTouchTap={(e)=>{
															e.stopPropagation();
															openTab(RoutePath.saveEffect.list(this.props.params)+'/'+solution.getIn(["EnergyProblem","Id"])+'?init_hierarchy_id='+this.props.hierarchyId);
														}}/>}
			</div>
		)
	}

  _renderListByTimeType(type,displayLabel){
    var label=type===1?I18N.Setting.ECM.PushPanel.ThisMonth
              :type===2?I18N.Setting.ECM.PushPanel.Last3Month
              :I18N.Setting.ECM.PushPanel.Earlier;
    var List=[];
    this.state.solutionList.forEach((solution,index)=>{
      var time=DataConverter.JsonToDateTime(solution.getIn(['EnergyProblem','CreateTime']));
      if(MeasuresStore.isSolutionValid(type,time)){
        var prop={
          measure:solution,
          hasCheckBox:false,
          personInCharge:this._renderPersonInCharge(solution.get('EnergyProblem'),false,index),
          onClick:()=>{this._onMeasureItemClick(index)},
          displayUnread:displayUnread(this.state.infoTabNo),
					action:this._renderEffectAction(solution)
        }
        if(this.state.measureShow===false && this.state.measureIndex!==null && index===this.state.measureIndex){
          List.push(
            <DisappareItem {...this.getProps()} onEnd={()=>{this._afterAnimation()}}><MeasuresItem {...prop}/></DisappareItem>
          )
        }
        else {
          List.push(<MeasuresItem {...prop}/>)
        }

      }
    })

    if(List.length===0){
      return null
    }
    return(
      <div className='row'>
        {displayLabel?<div className="label">{label}</div>:null}
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
        <div ref='content' className="content">
          {this._renderListByTimeType(1,this.state.infoTabNo===1)}
          {this._renderListByTimeType(2,this.state.infoTabNo===1)}
          {this._renderListByTimeType(3,this.state.infoTabNo===1)}
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

                currentSolution=currentSolution.setIn(['EnergyProblem','Status'],this.state.toBeStatus);
                this.setState({
                  measureShow:false,
                  statusDialogShow:false
                },()=>{
                  if(this.state.infoTabNo===4){
                    currentSolution=currentSolution.setIn(['EnergyProblem','Supervisor'],null)
                  }
                  MeasuresAction.updateSolution(currentSolution.toJS());
                  this._afterAnimation=()=>{
                      var st=this.state.toBeStatus;
                    MeasuresAction.setSnackBarText(st);
                    this.setState({
                      measureIndex:null,
                      toBeStatus:null,
                      solutionList:null
                    },()=>{
                      this.refresh(status[this.state.infoTabNo-1]);
                    })
                  }
                })

              }} />,

            <FlatButton
              label={I18N.Common.Button.Cancel2}
              onClick={() => {this.setState({
                              toBeStatus: null,
                              statusDialogShow:false
                              })}} />
          ]}
      ><div className="jazz-ecm-measure-viewabletext">{content}</div></NewDialog>
    )
  }

  _renderOperation(){
    var problem=this.state.solutionList.getIn([this.state.measureIndex,'EnergyProblem']),
        status=problem.get('Status'),
        createUserId=problem.get('CreateUserId'),
        currentSolution=this.state.solutionList.getIn([this.state.measureIndex]);;
    var prop={
      energySys:{
        measure:currentSolution,
        canNameEdit:canEdit(createUserId),
        canEnergySysEdit:canEdit(createUserId),
        merge:this.merge,
      }
    }
    return(
      <div className="jazz-ecm-push-operation">
        <StatusCmp status={status} canEdit={canEditStatus(createUserId,this.state.infoTabNo)} onChange={this._onStatusChange.bind(this)}/>
        {this._renderPersonInCharge(problem,true)}
        <EnergySys {...prop.energySys}/>
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
    var problem=this.state.solutionList.getIn([this.state.measureIndex,'EnergyProblem']),
        user=problem.get('CreateUserName');
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
       canEdit:PushIsFull() || PushAndNotPushIsFull(),
       onScroll:(height)=>{ReactDom.findDOMNode(this).querySelector(".dialog-content").scrollTop+=height+15}
     }
   }
    return(
      <NewDialog
        open={this.state.measureShow}
        hasClose
        isOutsideClose={false}
        onRequestClose={onClose}
        overlayStyle={{overflowY:"auto"}}
        style={{overflow:"visible"}}
        wrapperStyle={{overflow:"visible"}}
        titleStyle={{margin:'0 7px',paddingTop:"7px"}}
        contentStyle={{overflowY:"auto",display:'block',padding:"6px 28px 14px 32px",margin:0}}>
        <div style={{paddingLeft:'9px',borderBottom:"1px solid #e6e6e6",paddingRight:'19px'}}>{this._renderOperation()}</div>
        <SolutionLabel {...props.solution}/>
        <Solution {...props.solution}/>
        <Problem {...props.problem}/>
        <div style={{margin:"46px 20px 0 16px"}}><SolutionGallery {...props.gallery}/></div>
        <div style={{display:"flex",alignItems:"flex-end",marginTop:'36px'}}>
          <div className="jazz-ecm-push-operation-label">{`${I18N.Setting.ECM.PushPanel.CreateUser}：`}</div>
          <div style={{fontSize:'12px',color:'#9fa0a4',marginLeft:'5px'}}>{user || '-'}</div>
        </div>
        <Remark {...props.remark}/>
      </NewDialog>
    )
  }

  _renderDeleteSupervisorError(){
    var onClose=()=>{
      this.setState({
        deleteSupervisorErrorMsg:null
      })
    };
    return(
      <NewDialog
        open={this.state.deleteSupervisorErrorMsg!==null}
        modal={false}
        isOutsideClose={false}
        onRequestClose={onClose}
        titleStyle={{margin:'0 7px',paddingTop:"7px"}}
        contentStyle={{overflowY: 'auto',paddingRight:'5px',display:'block',margin:"0 32px"}}>
        <div>
          {this.state.deleteSupervisorErrorMsg.supervisor}
        </div>
      </NewDialog>
    )
  }

  merge(paths,value){
    paths.unshift(this.state.measureIndex);
    MeasuresAction.merge(paths,value)
  }

  refresh(status,hierarchyId=this.props.hierarchyId){
    var statusArr=[];
    if(PushAndNotPushIsFull()){
      statusArr=[Status.Being]
    }else {
      statusArr=[Status.ToBe,Status.Done]
    }
    MeasuresAction.cleanSolutionList();
    MeasuresAction.getActivecounts(hierarchyId,()=>{
      MeasuresAction.getContainsunread(hierarchyId,statusArr,()=>{
        MeasuresAction.getGroupSettingsList(hierarchyId,status);
      })
    })
  }

  getProps(){
    var btn,destX,destY;
      switch (this.state.toBeStatus) {
        case Status.ToBe:
          btn=ReactDom.findDOMNode(this.refs.tobe)
          break;
        case Status.Done:
          btn=ReactDom.findDOMNode(this.refs.done)
          break;
        case Status.Canceled:
          btn=ReactDom.findDOMNode(this.refs.canceled)
          break;
        case null:
            if(this.state.infoTabNo===1){
              btn=ReactDom.findDOMNode(this.refs.being)
            }
            break;
        default:

      }
    if(btn){
      destX=btn.getBoundingClientRect().left+60,
      destY=btn.getBoundingClientRect().top;
    }
  var width=ReactDom.findDOMNode(this.refs.content).clientWidth-10-10-5-15;
  return{
    destX,destY,width
  }
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
      this.refresh(Status.ToBe,nextProps.hierarchyId);
      if(PushIsFull()){
         MeasuresAction.getSupervisor(nextProps.hierarchyId);
      }
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
        {this.state.statusDialogShow && this._renderStatusDialog()}
        {this.state.deleteSupervisorErrorMsg!==null && this._renderDeleteSupervisorError()}
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
