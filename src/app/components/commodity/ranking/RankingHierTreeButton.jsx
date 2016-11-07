'use strict';
import React from "react";
import { Navigation, State } from 'react-router';
import { CircularProgress, Mixins } from 'material-ui';
import HierarchyStore from '../../../stores/HierarchyStore.jsx';
import HierarchyAction from '../../../actions/HierarchyAction.jsx';
import HierView from './RankingHierView.jsx';
import Immutable from 'immutable';

var RankingHierTreeButton = React.createClass({

  //mixins: [Mixins.ClickAwayable],
  propTypes: {
    checkedTreeNodes: React.PropTypes.object,
    onConfirm: React.PropTypes.func,
    onLoad: React.PropTypes.func,
  },
  contextTypes:{
      currentRoute: React.PropTypes.object
  },
  _onChange() {
    var data = HierarchyStore.getData();
    this.props.onLoad(false);
    this.setState({
      hieList: data,
      isLoading: false
    });
    if (this.props.checkedTreeNodes) {
      //let checkedTreeNodes=Immutable.fromJS(this.props.checkedTreeNodes);
      this.setButtonName(this.props.checkedTreeNodes);
    }
  },
  _findNameById: function(id) {
    var name;
    var f = function(item) {
      if (item.Id == id) {
        name = item.Name;
      } else {
        if (item.Children) {
          item.Children.forEach(child => {
            f(child);
          });
        }
      }
    };
    f(this.state.hieList);
    return name;
  },
  setButtonName: function(checkedTreeNodes) {
    var name;
    var that = this;
    if (checkedTreeNodes.size !== 0) {
      checkedTreeNodes.forEach(function(node, i) {
        let nodeName = node.get('Name');
        if (nodeName === null) {
          nodeName = that._findNameById(node.get('Id'));
        }
        if (i === 0) {
          name = nodeName;
        } else {
          name += ',' + nodeName;
        }
      });
      this.setState({
        buttonName: name
      });
    } else {
      this.setState({
        buttonName: I18N.Hierarchy.RankingButtonName
      });
    }

  },
  _onShowPaper: function() {
    if (this.state.display == 'none') {
      this.setState({
        display: 'block'
      });
    } else {
      this.setState({
        display: 'none'
      });
    }
  },
  _onConfirm: function(list) {
    this.setButtonName(list);
    this.props.onConfirm();
    this.setState({
      display: 'none'
    });
  },
  _onClear: function() {
    this.setState({
      buttonName: I18N.Hierarchy.RankingButtonName
    });
  },
  getInitialState: function() {
    return {
      open: false,
      hieList: null,
      buttonName: (!!this.props.checkedTreeNodes) ? '' : I18N.Hierarchy.RankingButtonName,
      display: 'none'
    };
  },
  // componentWillReceiveProps: function(nextProps) {
  //     if((nextProps.checkedTreeNodes!==null) && (nextProps.checkedTreeNodes!=this.props.checkedTreeNodes)){
  //       //let checkedTreeNodes=Immutable.fromJS(nextProps.checkedTreeNodes);
  //       this.setButtonName(nextProps.checkedTreeNodes);
  //     }
  //       },
  componentDidMount: function() {
    HierarchyStore.addHierarchyNodeListener(this._onChange);
    HierarchyAction.loadall(this.context.currentRoute.params.customerId, false);
    this.props.onLoad(true);
    this.setState({
      isLoading: true,
      hieList: null,
    });
  },
  componentWillUnmount: function() {
    HierarchyStore.removeHierarchyNodeListener(this._onChange);
  },
  render: function() {
    var dropdownPaper,
      paperStyle = {
        backgroundColor: '#ffffff',
        zIndex: '100',
        width: '300px',
        height: '390px',
        position: 'absolute',
        border: '1px solid #c9c8c8',
        margin: '12px 10px'
      };

    return (
      <div className='jazz-ranking-hierarchybutton' style={{
        display: 'inline-block'
      }}>
          <div className='hiername' title={this.state.buttonName} onClick={this._onShowPaper}>
            {this.state.buttonName}
          </div>
          <div style={{
        display: this.state.display
      }}>
          <HierView allNode={this.state.hieList} onConfirm={this._onConfirm} checkedTreeNodes={this.props.checkedTreeNodes}/>
          </div>

        </div>
      )
  }
});

module.exports = RankingHierTreeButton;
