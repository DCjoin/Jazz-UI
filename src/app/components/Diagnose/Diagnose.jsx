import React, { Component } from 'react';
import classnames from "classnames";
import {CircularProgress, Snackbar} from 'material-ui';
import find from 'lodash/find';
import LabelList from './LabelList.jsx';
import CurrentUserStore from 'stores/CurrentUserStore.jsx';
import DiagnoseAction from 'actions/Diagnose/DiagnoseAction.jsx';
import privilegeUtil from 'util/privilegeUtil.jsx';
import PermissionCode from 'constants/PermissionCode.jsx';
import BubbleIcon from '../BubbleIcon.jsx';
import Immutable from 'immutable';
import LabelDetail from './LabelDetail.jsx';
import CreateDiagnose from './CreateDiagnose.jsx';
import ConsultantCard from './ConsultantCard.jsx';
import DiagnoseStore from 'stores/DiagnoseStore.jsx';
import {formStatus} from 'constants/FormStatus.jsx';
import EditDiagnose from './EditDiagnose.jsx';
import FolderStore from 'stores/FolderStore.jsx';
import HierarchyStore from 'stores/HierarchyStore.jsx';
import util from 'util/Util.jsx';
import RoutePath from 'util/RoutePath.jsx';


function getFirstMenuPathFunc(menu) {
  let firstMenu = menu[0];
  if( !firstMenu ) {
    return function() {
      console.err('No has any menu');
    }
  }
  if(firstMenu.children && firstMenu.children.length > 0) {
    let firstChild = firstMenu.children[0];
    if(firstChild.list && firstChild.list.length > 0) {
      return firstChild.list[0].getPath;
    }
  }
  return  firstMenu.getPath;
}

function privilegeWithSmartDiagnoseList( privilegeCheck ) {
  //  return false
	return privilegeCheck(PermissionCode.SMART_DIACRISIS_LIST, CurrentUserStore.getCurrentPrivilege());
}

function isListFull() {
	return privilegeWithSmartDiagnoseList(privilegeUtil.isFull.bind(privilegeUtil));
}

function privilegeWithBasicSmartDiagnose( privilegeCheck ) {
  //  return true
	return privilegeCheck(PermissionCode.BASIC_SMART_DIACRISIS, CurrentUserStore.getCurrentPrivilege());
}

function isBasicFull() {
	return privilegeWithBasicSmartDiagnose(privilegeUtil.isFull.bind(privilegeUtil));
}

function isBasicView() {
	return privilegeWithBasicSmartDiagnose(privilegeUtil.isView.bind(privilegeUtil));
}

function isBasicNoPrivilege() {
	return !(isBasicView() || isBasicFull())
}

function SolutionFull() {
	return privilegeUtil.isFull(PermissionCode.SOLUTION_FULL, CurrentUserStore.getCurrentPrivilege());
}

export default class Diagnose extends Component {

  static contextTypes = {
        hierarchyId: React.PropTypes.string
      };

  constructor(props, ctx) {
        super(props);
        this._onHasProblem = this._onHasProblem.bind(this);
        this._onItemTouchTap = this._onItemTouchTap.bind(this);
        this._onBasicTabSwitch = this._onBasicTabSwitch.bind(this);
        this._onCreated = this._onCreated.bind(this);
        this._onRemove=this._onRemove.bind(this);
        this._onShowSolutionSnakBar = this._onShowSolutionSnakBar.bind(this);
        this._onChanged = this._onChanged.bind(this);
    }

  state={
        infoTabNo:isBasicNoPrivilege()?2:1,
        hasProblem:false,
        selectedId:null,
        isBasic:true,
        formStatus:formStatus.VIEW,
        addLabel:null,
        createSuccessMeg: false,
        showSolutionTip:false
    }

  _onChanged(){
    this.forceUpdate()
  }

  _onHasProblem(){
    this.setState({
      hasProblem:CurrentUserStore.getDiagnoseBubble()
    })
  }

  _onCreated(isClose, lastCreateId) {
    this.setState({
      createSuccessMeg: isClose
    });
    //alert('hehehe:' + lastCreateId);
    // DiagnoseAction.getDiagnoseStatic(this.context.hierarchyId);
  }

  _switchTab(no){
    this.setState({
      infoTabNo:no,
      selectedId:null
    })
  }

  _onItemTouchTap(data){
    this.setState({
      selectedId:data.get('Id')
    })
  }

  _onBasicTabSwitch(no){
      this.setState({
        isBasic:no===1
      })
    }

  _onRemove(id){
    this.setState({
      selectedId:id
    })
  }

  _onShowSolutionSnakBar() {
    this.setState({
      showSolutionTip: true
    });
  }

  _renderTab(){
    if(isListFull() && !isBasicNoPrivilege()){
      return(
        <div className="titleTabs">
          <div className={classnames({"tab":true,'selected':this.state.infoTabNo===1})} onClick={this._switchTab.bind(this,1)} style={{display:'flex'}}>
            {I18N.Setting.Diagnose.DiagnoseProblem}
            {this.state.hasProblem?<BubbleIcon style={{width:'5px',height:'5px'}}/>:null}
          </div>
          <div className={classnames({"tab":true,'selected':this.state.infoTabNo===2})} onClick={this._switchTab.bind(this,2)} style={{marginLeft:'72px'}}>
            {I18N.Setting.Diagnose.DiagnoseList}
          </div>
        </div>
      )
    }
    else {
      return <div style={{marginTop:'30px'}}/>
    }

  }


  getProblem(hierarchyId){
    this.setState({
      nodeDetail:null
    },()=>{
      DiagnoseAction.getDiagnoseStatic(hierarchyId)
    })
  }

  componentDidMount(){
    CurrentUserStore.addCurrentUserListener(this._onHasProblem);
    DiagnoseStore.addCreatedDiagnoseListener(this._onCreated);
    DiagnoseStore.addRemoveDiagnoseListener(this._onRemove);
    FolderStore.addSolutionCreatedListener(this._onShowSolutionSnakBar);
    DiagnoseStore.addChangeListener(this._onChanged);
    this.getProblem(this.context.hierarchyId);
  }

  componentWillReceiveProps(nextProps, nextCtx) {
    if( this.context.hierarchyId && nextCtx.hierarchyId === nextProps.params.customerId * 1 ) {
      nextProps.router.push(
        getFirstMenuPathFunc(CurrentUserStore.getMainMenuItems())(nextProps.params)
      )
    }
    if(nextCtx.hierarchyId!==this.context.hierarchyId){
      this.getProblem(nextCtx.hierarchyId);
    }
  }

  componentWillUnmount(){
    DiagnoseStore.removeChangeListener(this._onChanged);
    CurrentUserStore.removeCurrentUserListener(this._onHasProblem);
    DiagnoseStore.removeCreatedDiagnoseListener(this._onCreated);
    DiagnoseStore.removeRemoveDiagnoseListener(this._onRemove);
    FolderStore.removeSolutionCreatedListener(this._onShowSolutionSnakBar);
  }

render(){
  return(
    <div className="diagnose-panel">
      {this._renderTab()}
      <div className="content">
          <LabelList ref='list' isFromProbem={this.state.infoTabNo===1} selectedNode={DiagnoseStore.findDiagnoseById(this.state.selectedId)}
            onItemTouchTap={this._onItemTouchTap} onTabSwitch={this._onBasicTabSwitch}
            onAdd={(label)=>{this.setState({
              formStatus:formStatus.ADD,
              addLabel:label
            })}}/>
          <LabelDetail isFromProbem={this.state.infoTabNo===1} selectedNode={DiagnoseStore.findDiagnoseById(this.state.selectedId)}
                       isBasic={this.state.isBasic} formStatus={this.state.formStatus} addLabel={this.state.addLabel}
                       onEdit={(label)=>{this.setState({
                         formStatus:formStatus.EDIT,
                         addLabel:label
                       })}}
                       />
      </div>
      {this.state.formStatus === formStatus.ADD &&
      <CreateDiagnose
        isBasic={this.state.infoTabNo !== 1}
        EnergyLabel={this.state.addLabel}
        DiagnoseItem={DiagnoseStore.findItemById(this.state.addLabel.get('ItemId'))}
        onClose={(id) => {
        this.setState({
          formStatus:formStatus.VIEW,
          addLabel: null,
          selectedId:id?id:this.state.selectedId
        });
      }}/>}
      {this.state.formStatus === formStatus.EDIT &&
      <EditDiagnose selectedNode={this.state.addLabel} onClose={() => {
        this.setState({
          formStatus:formStatus.VIEW,
          addLabel: null,
        });
      }}/>}
      <Snackbar message={'诊断已创建'}
          open={this.state.createSuccessMeg}
          onRequestClose={() => {this.setState({createSuccessMeg: false})}}/>

      <Snackbar ref='snackbar'
            open={this.state.showSolutionTip}
            onRequestClose={() => {
              this.setState({showSolutionTip: false})
            }}
            message={SolutionFull() ? I18N.Setting.DataAnalysis.SaveScheme.FullTip : I18N.Setting.DataAnalysis.SaveScheme.PushTip}
            action={I18N.Setting.DataAnalysis.SaveScheme.TipAction}
            onActionTouchTap={() => {
              util.openTab(RoutePath.ecm(this.props.params)+'?init_hierarchy_id='+this.context.hierarchyId);
            }}
          />
      <ConsultantCard
        HierarchyName={(find(HierarchyStore.getBuildingList(), 
            hier => hier.Id === this.context.hierarchyId)||{}).Name}
      />
    </div>
  )
}
}
