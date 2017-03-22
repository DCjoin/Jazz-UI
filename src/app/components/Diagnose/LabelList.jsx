import React, { Component } from 'react';
import classnames from "classnames";
import {Tabs, Tab, CircularProgress} from 'material-ui';
import {labellist} from '../../../../mockData/diagnose.js';
import Immutable from 'immutable';

export default class LabelList extends Component {

  constructor(props, ctx) {
    super(props);

  }

  state={
    infoTabNo:1,
    list:Immutable.fromJS(labellist)
  }

  _renderTabs(){
    var tabsProp={
      inkBarStyle:{
        height:'3px',
        backgroundColor:'#0CAD04'
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
        backgroundColor:this.state.infoTabNo===2?'rgba(255,255,255,0.17);':'#191919',
      }
    },
    tab2Prop={
      key:2,
      value:2,
      label:I18N.Setting.Diagnose.Senior,
      style:{
        color:this.state.infoTabNo===2?'#0CAD04':'#ffffff',
        backgroundColor:this.state.infoTabNo===1?'rgba(255,255,255,0.17);':'#191919',
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
      <div className="content">
        <div className="itemTitle"></div>
      </div>
    ))
  }

  render(){

    return(
      <div className="diagnose-label-list">
        {this._renderTabs()}
      </div>
    )
  }
}
