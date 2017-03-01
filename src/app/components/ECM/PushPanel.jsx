import React, { Component } from 'react';
import classnames from "classnames";
import MeasuresStore from 'stores/ECM/MeasuresStore.jsx';
import MeasuresAction from 'actions/ECM/MeasuresAction.jsx';
import {Status} from '../../constants/actionType/Measures.jsx';
import {DataConverter} from 'util/Util.jsx';
import MeasuresItem from './MeasuresItem.jsx';
import {CircularProgress} from 'material-ui';
import Title from './MeasurePart/MeasureTitle.jsx';
import Problem from './MeasurePart/Problem.jsx';
import Solution from './MeasurePart/Solution.jsx';
import SolutionGallery from './MeasurePart/SolutionGallery.jsx';
import NewDialog from 'controls/NewDialog.jsx';
import PermissionCode from 'constants/PermissionCode.jsx';
import CurrentUserStore from 'stores/CurrentUserStore.jsx';
import privilegeUtil from 'util/privilegeUtil.jsx';

function privilegeWithPush( privilegeCheck ) {
  // return true
	return privilegeCheck(PermissionCode.SOLUTION_FULL, CurrentUserStore.getCurrentPrivilege());
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
  return currentUserId===userId
}

function canEdit(userId){
  return PushAndNotPushIsFull() || (PushIsFull() && IsUserSelf(userId))
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
    measureShow:false
  }

  _onChanged(){
    this.setState({
      solutionList:MeasuresStore.getSolutionList(),
    })
  }

  _onMeasureItemClick(index){
    this.setState({
      measureShow:true,
      measureIndex:index
    })
  }

  _handlerSwitchTab(event) {
    let no = parseInt(event.target.getAttribute("data-tab-index"));
    this.setState({
      infoTabNo: no,
      measureIndex:null,
      measureShow:false,
      solutionList:null,
    },()=>{
      MeasuresAction.getGroupSettingsList(this.props.hierarchyId,status[no-1]);
    });
  }

  _renderTab(){
    return(
      <div className="jazz-ecm-push-tabs">
        <span className={classnames({
              "jazz-ecm-push-tabs-tab": true,
              "selected": this.state.infoTabNo === 1
            })} data-tab-index="1" onClick={this._handlerSwitchTab}>{I18N.Setting.ECM.PushPanel.ToBe}</span>
        <span className={classnames({
                "jazz-ecm-push-tabs-tab": true,
                "selected": this.state.infoTabNo === 2
              })} data-tab-index="2" onClick={this._handlerSwitchTab}>{I18N.Setting.ECM.PushPanel.Being}</span>
        <span className={classnames({
                "jazz-ecm-push-tabs-tab": true,
                "selected": this.state.infoTabNo === 3
              })} data-tab-index="3" onClick={this._handlerSwitchTab}>{I18N.Setting.ECM.PushPanel.Done}</span>
        <span className={classnames({
                "jazz-ecm-push-tabs-tab": true,
                "selected": this.state.infoTabNo === 4
              })} data-tab-index="4" onClick={this._handlerSwitchTab}>{I18N.Setting.ECM.PushPanel.Canceled}</span>
      </div>
    )
  }

  _renderPersonInCharge(){
    return(
      <div>
        <div style={{fontSize:'12px'}}>{I18N.Setting.CustomerManagement.Principal}</div>
        <div style={{marginTop:'5px'}}>-</div>
      </div>
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
                  personInCharge={this._renderPersonInCharge()}
                  onClick={()=>{this._onMeasureItemClick(index)}}/>
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

  _renderOperation(){
    var user=this.state.solutionList.getIn([this.state.measureIndex,'EnergyProblem','CreateUserName']);
    return(
      <div className="jazz-ecm-push-operation">
        <div>{`${I18N.Setting.ECM.PushPanel.Status}:${MeasuresStore.getStatusText(status[this.state.infoTabNo-1])}`}</div>
        <div>{`${I18N.Setting.CustomerManagement.Principal}：-`}</div>
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
        MeasuresAction.updateSolution(currentSolution.toJS());
      })
    };
   var props={
     title:{
       measure:currentSolution,
       canNameEdit:canEdit(createUserId),
       canEnergySysEdit:PushAndNotPushIsFull(),
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
   }
    return(
      <NewDialog
        open={this.state.measureShow}
        modal={false}
        isOutsideClose={false}
        onRequestClose={onClose}
        contentStyle={{overflowY: 'auto',paddingRight:'5px'}}>
        <Title {...props.title}/>
        {this._renderOperation()}
        <Solution {...props.solution}/>
        <Problem {...props.problem}/>
        <SolutionGallery {...props.gallery}/>
        <div className="jazz-ecm-push-operation">{I18N.Remark.Label}</div>
      </NewDialog>
    )
  }

  merge(paths,value){
    paths.unshift(this.state.measureIndex);
    MeasuresAction.merge(paths,value)
  }
  // componentWillMount(){
  // MeasuresStore.setSolutionList(solutionList,Status.ToBe);//for test
  // this.setState({
  //   solutionList:Immutable.fromJS(solutionList),//for test
  // })
  // }

  componentDidMount(){
    MeasuresStore.addChangeListener(this._onChanged);
    MeasuresAction.getGroupSettingsList(this.props.hierarchyId,Status.ToBe);
    // MeasuresAction.getGroupSettingsList(100001,Status.ToBe);
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
      </div>
    )
  }
}

PushPanel.propTypes = {
  hierarchyId:React.PropTypes.number,
};
