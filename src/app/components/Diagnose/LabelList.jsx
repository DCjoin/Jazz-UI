import React, { Component } from 'react';
import {Tabs, Tab, CircularProgress} from 'material-ui';
import {labellist,problemStatic} from '../../../../mockData/diagnose.js';
import Immutable from 'immutable';
import LabelItem from './LabelItem.jsx';
import DiagnoseAction from 'actions/Diagnose/DiagnoseAction.jsx';
import DiagnoseStore from 'stores/DiagnoseStore.jsx';
import FontIcon from 'material-ui/FontIcon';
import privilegeUtil from 'util/privilegeUtil.jsx';
import PermissionCode from 'constants/PermissionCode.jsx';
import CurrentUserStore from 'stores/CurrentUserStore.jsx';

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

    this._onChanged = this._onChanged.bind(this);

  }

  state={
    infoTabNo:1,
    list:null,
    static:null
  }

  _getList(){
    DiagnoseAction.getDiagnosisList(this.context.hierarchyId,this.state.infoTabNo,this.props.isFromProbem?2:1,
                    ()=>{
                      if(this.props.isFromProbem) DiagnoseAction.getDiagnoseStatic(this.context.hierarchyId)
                    })
  }

  _onChanged(){
      this.setState({
        list:DiagnoseStore.getDiagnosisList(),
        static:DiagnoseStore.getDiagnoseStatic()
      })
  }

  _renderTabs(){
    var problemIcon=<FontIcon className="icon-lighten"/>;
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
          list:null,
					selectedNode:null
        },()=>{
          if(no===1 || isFull()){
            this._getList()
          }else {
            this.setState({
              list:Immutable.fromJS([])
            })
          }
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
                        onAdd={this.props.onAdd}
                        onItemTouchTap={this.props.onItemTouchTap}/>
    ))
  }

	IsBasic(){
			return this.state.infoTabNo===1
	}

  componentDidMount(){
    DiagnoseStore.addChangeListener(this._onChanged);
    this._getList();
  }

  componentWillUnmount(){
    DiagnoseStore.removeChangeListener(this._onChanged);
  }

  render(){
    if(this.state.list===null){
      return (
        <div className="diagnose-label-list flex-center" style={{flex:'none'}}>
         <CircularProgress  mode="indeterminate" size={80} />
       </div>
      )
    }else {
      var problemIcon=<FontIcon className="icon-lighten" style={{marginLeft:'10px',fontSize:'5px'}}/>;
      return(
        <div className="diagnose-label-list">
          {this._renderTabs()}
          {this._renderList()}
        </div>
      )
    }

  }
}

LabelList.propTypes={
  isFromProbem:React.PropTypes.bool,
  selectedNode:React.PropTypes.object,
  onItemTouchTap:React.PropTypes.func,
}
