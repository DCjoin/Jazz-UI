'use strict';
import React from "react";
import { Navigation, State } from 'react-router';
import { Paper, RaisedButton, CircularProgress } from 'material-ui';
import Immutable from 'immutable';
import Tree from '../../../controls/tree/Tree.jsx';
import CommodityAction from '../../../actions/CommodityAction.jsx';

var RankingHierView = React.createClass({
  propTypes: {
    allNode: React.PropTypes.object,
    checkedTreeNodes: React.PropTypes.object,
    onConfirm: React.PropTypes.func,
  },
  _onConfirm: function() {
    this.props.onConfirm(this.state.checkedNodes);
    CommodityAction.loadRankingCommodityList(this.state.checkedNodes);
  },
  _onClear: function() {
    this.setState({
      checkedNodes: Immutable.List(),
      clearBtnDisabled: true
    });
  },
  _onSelectNode: function(node) {
    var list = this.state.checkedNodes;
    var index = list.findIndex(item => {
      return item.get('Id') == node.get('Id');
    });
    if (index >= 0) {
      list = list.delete(index);
    } else {
      list = list.push(node);
    }
    if (list.size === 0) {
      this.setState({
        checkedNodes: list,
        clearBtnDisabled: true
      });
    } else {
      this.setState({
        checkedNodes: list,
        clearBtnDisabled: false
      });
    }

  },
  getInitialState: function() {
    var status = ((!this.props.checkedTreeNodes) ? Immutable.List() : this.props.checkedTreeNodes);
    var disabled = ((!this.props.checkedTreeNodes) ? true : false);
    return {
      checkedNodes: status,
      clearBtnDisabled: disabled
    };
  },
  // componentDidMount:function(){
  //   if(this.props.checkedTreeNodes){
  //     CommodityAction.loadRankingCommodityList(this.props.checkedTreeNodes);
  //   }
  // },
  render: function() {
    var props = {
      key: 'rangkingtree',
      allNode: this.props.allNode,
      allHasCheckBox: true,
      collapsedLevel: 0,
      nodeOriginPaddingLeft: 0,
      onSelectNode: this._onSelectNode,
      checkedNodes: this.state.checkedNodes,
      treeNodeClass: 'jazz-checkboxtree-node'
    };
    var paperStyle = {
        backgroundColor: '#ffffff',
        zIndex: '100',
        width: '300px',
        height: '390px',
        position: 'absolute',
        border: '1px solid #c9c8c8',
        margin: '12px 10px'
      },
      buttonStyle = {
        marginLeft: '30px'
      };
    if (this.props.allNode === null) {
      return (
        <Paper style={paperStyle}>
          <div style={{
          flex: 1,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: '160px'
        }}>
            <CircularProgress  mode="indeterminate" size={80} />
          </div>
        </Paper>
        )
    } else {
      return (
        <Paper style={paperStyle}>
          <div className="jazz-ranking-hierview-header">
            <RaisedButton label={I18N.Hierarchy.Confirm} onClick={this._onConfirm}/>
            <RaisedButton label={I18N.Hierarchy.Clear} onClick={this._onClear} style={buttonStyle} disabled={this.state.clearBtnDisabled}/>
          </div>
          <div className="tree-field" style={{
          marginTop: '5px',
          height: '336px'
        }}>
            <Tree {...props}/>
            </div>
        </Paper>
        )
    }

  }
});

module.exports = RankingHierView;
