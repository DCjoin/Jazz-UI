import React, { Component } from 'react';
import classnames from "classnames";
import {Tabs, Tab, CircularProgress} from 'material-ui';
import {labellist} from '../../../../mockData/diagnose.js';
import Immutable from 'immutable';
import LabelItem from './LabelItem.jsx';
import DiagnoseAction from 'actions/Diagnose/DiagnoseAction.jsx';
import DiagnoseStore from 'stores/DiagnoseStore.jsx';

export default class LabelList extends Component {

  static contextTypes = {
        hierarchyId: React.PropTypes.string
      };

  constructor(props, ctx) {
    super(props);
    this._onItemTouchTap = this._onItemTouchTap.bind(this);
    this._onChanged = this._onChanged.bind(this);

  }

  state={
    infoTabNo:1,
    list:Immutable.fromJS(labellist),
    selectedNode:Immutable.fromJS({})
  }

  _getList(){
    DiagnoseAction.getDiagnosisList(this.context.hierarchyId,this.state.infoTabNo,this.props.isFromProbem?2:1)
  }

  _onChanged(){
      this.setState({
        list:DiagnoseStore.getDiagnosisList()
      })
  }

  _onItemTouchTap(data){
    this.setState({
      selectedNode:data
    })
  }

  _renderTabs(){
    var tabsProp={
      inkBarStyle:{
        height:'3px',
        backgroundColor:'#0CAD04'
      },
      tabItemContainerStyle:{
        backgroundColor:'#191919',
      },
      style:{
        width:'100%'
      },
      value:this.state.infoTabNo,
      onChange:(no)=>{this.setState({infoTabNo:no})}
    },
    tab1Prop={
      key:1,
      value:1,
      label:I18N.Setting.Diagnose.Basic,
      style:{
        color:this.state.infoTabNo===1?'#0CAD04':'#ffffff',
        backgroundColor:this.state.infoTabNo===2?'rgba(255,255,255,0.17)':'#191919',
      }
    },
    tab2Prop={
      key:2,
      value:2,
      label:I18N.Setting.Diagnose.Senior,
      style:{
        color:this.state.infoTabNo===2?'#0CAD04':'#ffffff',
        backgroundColor:this.state.infoTabNo===1?'rgba(255,255,255,0.17)':'#191919',
      }
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
                        selectedNode={this.state.selectedNode}
                        isFromProbem={this.props.isFromProbem}
                        onAdd={this.props.onAdd}
                        onItemTouchTap={this._onItemTouchTap}/>
    ))
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
        <div className="flex-center">
         <CircularProgress  mode="indeterminate" size={80} />
       </div>
      )
    }else {
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
}
