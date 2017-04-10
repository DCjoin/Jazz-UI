import React, { Component } from 'react';
import {Tabs, Tab, CircularProgress} from 'material-ui';
import Immutable from 'immutable';
import LabelItem from './LabelItem.jsx';
import DiagnoseAction from 'actions/Diagnose/DiagnoseAction.jsx';
import DiagnoseStore from 'stores/DiagnoseStore.jsx';
import FontIcon from 'material-ui/FontIcon';
import privilegeUtil from 'util/privilegeUtil.jsx';
import PermissionCode from 'constants/PermissionCode.jsx';
import CurrentUserStore from 'stores/CurrentUserStore.jsx';
import HierarchyAction from '../../actions/hierarchySetting/HierarchyAction.jsx';
import NewDialog from 'controls/NewDialog.jsx';

function privilegeWithSeniorSmartDiagnose( privilegeCheck ) {
  //  return false
	return privilegeCheck(PermissionCode.SENIOR_SMART_DIACRISIS, CurrentUserStore.getCurrentPrivilege());
}

function isFull() {
	return privilegeWithSeniorSmartDiagnose(privilegeUtil.isFull.bind(privilegeUtil));
}


export default class LabelList extends Component {

  static contextTypes = {
        hierarchyId: React.PropTypes.string
      };

  constructor(props, ctx) {
    super(props)

    this._onAdd = this._onAdd.bind(this);
    this._onChanged = this._onChanged.bind(this);

  }

  state={
    infoTabNo:1,
    list:null,
    static:null,
		hasCalendar:null,
		dialogShow:false
  }

  _getList(hierarchyId,isFromProbem=this.props.isFromProbem){
		this.setState({
	    list:null,
	    static:null,
		},()=>{
			DiagnoseAction.getDiagnosisList(hierarchyId,this.state.infoTabNo,isFromProbem?2:1,
											()=>{
												if(isFromProbem) DiagnoseAction.getDiagnoseStatic(hierarchyId)
											})
		})

  }

  _onChanged(){
      this.setState({
        list:DiagnoseStore.getDiagnosisList(),
        static:this.props.isFromProbem && DiagnoseStore.getDiagnoseStatic(),
				hasCalendar:DiagnoseStore.hasCalendar(),
      })
  }

	_onAdd(data){
		if(!this.state.hasCalendar && data.get('DiagnoseModel')!==3){
			this.setState({
				dialogShow:true
			})
		}
		else {
			this.props.onAdd(data)
		}
	}

  _renderTabs(){
    var problemIcon=<FontIcon className="bubble-icon"/>;
    var tabsProp={
      inkBarStyle:{
        height:'3px',
        backgroundColor:'#0CAD04'
      },
      tabItemContainerStyle:{
        backgroundColor:'#191919',
      },
      style:{
        width:'100%',
      },
      value:this.state.infoTabNo,
      onChange:(no)=>{
        this.setState({
          infoTabNo:no,
          list:null
        },()=>{
          if(this.state.infoTabNo===1 || isFull()){
            this._getList(this.context.hierarchyId)
          }else {
            this.setState({
              list:Immutable.fromJS([])
            })
          }
					this.props.onTabSwitch(no)
        })
      }
    },
    tab1Prop={
      key:1,
      value:1,
      label:I18N.Setting.Diagnose.Basic,
      icon:this.state.static && this.state.static['1'] && problemIcon,
      className:'diagnose-tab',
      style:{
        height:'55px',
        color:this.state.infoTabNo===1?'#0CAD04':'#ffffff',
        backgroundColor:this.state.infoTabNo===2?'rgba(255,255,255,0.17)':'#191919',
      },
    },
    tab2Prop={
      key:2,
      value:2,
      label:I18N.Setting.Diagnose.Senior,
      icon:this.state.static && this.state.static['2'] && problemIcon,
      className:'diagnose-tab',
      style:{
        height:'55px',
        color:this.state.infoTabNo===2?'#0CAD04':'#ffffff',
        backgroundColor:this.state.infoTabNo===1?'rgba(255,255,255,0.17)':'#191919',
      },
    };
    return(
      <Tabs {...tabsProp}>
        <Tab {...tab1Prop}/>
        <Tab {...tab2Prop}/>
      </Tabs>
    )
  }

  _renderList(){
    return this.state.list.map(item=>(
      <LabelItem nodeData={item}
                        selectedNode={this.props.selectedNode}
                        isFromProbem={this.props.isFromProbem}
                        onAdd={this._onAdd}
                        onItemTouchTap={this.props.onItemTouchTap}/>
    ))
  }

	_renderDialog(){
		var onClose=()=>{
			this.setState({
				dialogShow:false
			})
		}
		return(
			<NewDialog
			        open={this.state.dialogShow}
			        modal={false}
			        isOutsideClose={false}
			        onRequestClose={onClose}
			        titleStyle={{margin:'0 24px'}}
			        contentStyle={{overflowY: 'auto',paddingRight:'5px',display:'block'}}>
							{I18N.Setting.Diagnose.HasNoCalendar}
			      </NewDialog>
		)
	}

	getCalendar(hierarchyId){
		this.setState({
			hasCalendar:null
		},()=>{
			HierarchyAction.getCalendar(hierarchyId)
		}
	)
	}

  componentDidMount(){
    DiagnoseStore.addChangeListener(this._onChanged);
		if(this.context.hierarchyId){
			this._getList(this.context.hierarchyId);
			this.getCalendar(this.context.hierarchyId);
		}
  }

	componentWillReceiveProps(nextProps,nextCtx) {
		if(nextCtx.hierarchyId !== this.context.hierarchyId) {
			this._getList(nextCtx.hierarchyId);
			this.getCalendar(nextCtx.hierarchyId);
		}
		if(nextProps.isFromProbem!==this.props.isFromProbem){
			this.setState({
				infoTabNo:1
			},()=>{
				this._getList(nextCtx.hierarchyId,nextProps.isFromProbem);
			})
		}
	}

  componentWillUnmount(){
    DiagnoseStore.removeChangeListener(this._onChanged);
  }

  render(){
    if(this.state.list===null || this.state.hasCalendar===null){
      return (
        <div className="diagnose-label-list flex-center" style={{flex:'none'}}>
         <CircularProgress  mode="indeterminate" size={80} />
       </div>
      )
    }else {
      return(
        <div className="diagnose-label-list">
          {this._renderTabs()}
          {this._renderList()}
					{this.state.dialogShow && this._renderDialog()}
        </div>
      )
    }
  }
}

LabelList.propTypes={
  isFromProbem:React.PropTypes.bool,
  selectedNode:React.PropTypes.object,
  onItemTouchTap:React.PropTypes.func,
	onTabSwitch:React.PropTypes.func,
	onAdd:React.PropTypes.func,
}
