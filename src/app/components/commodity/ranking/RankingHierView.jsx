'use strict';
import React from "react";
import {Navigation, State } from 'react-router';
import {Paper,RaisedButton,CircularProgress} from 'material-ui';
import Immutable from 'immutable';
import Tree from '../../../controls/tree/Tree.jsx';
import CommodityAction from '../../../actions/CommodityAction.jsx';

var RankingHierView = React.createClass({
  propTypes: {
    allNode: React.PropTypes.object.isRequired,
    checkedTreeNodes:React.PropTypes.array,
    onConfirm:React.PropTypes.func,
    onClear:React.PropTypes.func,
  },
  _onConfirm:function(){
    this.props.onConfirm(this.state.checkedNodes);
    CommodityAction.loadRankingCommodityList(this.state.checkedNodes);
  },
  _onClear:function(){
    this.props.onClear();

    this.setState({
      checkedNodes:Immutable.List()
    })
  },
  _onSelectNode:function(node){
    var list = this.state.checkedNodes;
    var index = list.findIndex(item=>{return item.get('Id')==node.get('Id');});
      if(index>=0){
            list = list.delete(index);
        }
        else{
              list = list.push(node);
            }
      this.setState({
        checkedNodes:list,
      });
  },
  getInitialState:function(){
    var status=((!this.props.checkedTreeNodes)?Immutable.List():this.props.checkedTreeNodes);
    return{
      checkedNodes:status,
    };
  },
  render:function(){
    var props = {
    allNode: this.props.allNode,
    allHasCheckBox: true,
    collapsedLevel:0,
    nodeOriginPaddingLeft:0,
    onSelectNode:this._onSelectNode,
    checkedNodes:this.state.checkedNodes
  };
  var paperStyle = {
              backgroundColor: '#ffffff',
              zIndex: '100',
              width:'300px',
              height:'390px',
              position:'absolute',
              border:'1px solid #c9c8c8',
              margin:'12px 10px'
            },
            buttonStyle={
              marginLeft:'30px'
            };
    if(this.props.allNode===null){
      return(
        <Paper style={paperStyle}>
          <div style={{flex:1,display:'flex',justifyContent:'center',alignItems:'center',marginTop:'160px'}}>
            <CircularProgress  mode="indeterminate" size={1} />
          </div>
        </Paper>
      )
    }
    else {
      return(
        <Paper style={paperStyle}>
          <div className="jazz-ranking-hierview-header">
            <RaisedButton label={I18N.Hierarchy.Confirm} onClick={this._onConfirm}/>
            <RaisedButton label={I18N.Hierarchy.Clear} onClick={this._onClear} style={buttonStyle}/>
          </div>
          <div className="tree-field">
            <Tree {...props}/>
            </div>
        </Paper>
      )
    }

  }
});

module.exports = RankingHierView;
