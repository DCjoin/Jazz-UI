'use strict';
import React from "react";
import { Route, DefaultRoute, RouteHandler, Link, Navigation, State } from 'react-router';
import { Checkbox } from 'material-ui';
import classnames from 'classnames';
import TagItem from './TagItem.jsx';
import TagStore from '../../stores/TagStore.jsx';
import TagAction from '../../actions/TagAction.jsx';
var createReactClass = require('create-react-class');
import PropTypes from 'prop-types';
var TagMenu = createReactClass({

  propTypes: {
    tagList: PropTypes.array,
    widgetType: PropTypes.string,
  },
  _onTagStatusChange: function() {
    this.setState({
      tagStatus: TagStore.getCurrentHierIdTagStatus(),
      allCheckDisable: TagStore.getCheckAllDisabledStatus(),
      checked: TagStore.getCheckAllCheckedStatus(),
      tagTotal: TagStore.getTagTotalStatus(),
    });
  },
  _onAllCheck: function() {
    var checked = this.refs.checkall.isChecked();
    TagAction.setTagStatusByTagList(this.props.tagList, checked);
    this.setState({
      checked: !this.state.checked
    });
  },
  getInitialState: function() {
    return {
      tagStatus: TagStore.getCurrentHierIdTagStatus(),
      allCheckDisable: TagStore.getCheckAllDisabledStatus(),
      tagTotal: TagStore.getTagTotalStatus(),
      checked: TagStore.getCheckAllCheckedStatus(),
      toolTipShow: false,
    };
  },

  componentWillReceiveProps: function() {
    this.setState({
      tagStatus: TagStore.getCurrentHierIdTagStatus(),
      allCheckDisable: TagStore.getCheckAllDisabledStatus(),
      tagTotal: TagStore.getTagTotalStatus(),
      checked: TagStore.getCheckAllCheckedStatus(),
      toolTipShow: false,
    });
  },

  componentDidMount: function() {
    TagStore.addTagStatusListener(this._onTagStatusChange);

  },
  componentWillUnmount: function() {
    TagStore.removeTagStatusListener(this._onTagStatusChange);
  },
  render: function() {
    let that = this;
    let tooltip = null;
    let nodemenuItems = [];
    let menuItem = null;
    var buttonStyle = {
      height: '25px',
    };
    var tooltipText = I18N.format(I18N.Tag.Tooltip, TagStore.getTagTotal(), TagStore.getTagSum());
    if (this.state.allCheckDisable) {
      tooltipText += I18N.Tag.ExceedTooltip;
    }


    this.props.tagList.forEach(function(nodeData, i) {
      var tagStatus = false;
      if (that.state.tagStatus.findIndex(item=>item.get("Id")===nodeData.Id)>-1) {
        tagStatus = true;
      }


      menuItem = (<TagItem key={i}
      style={buttonStyle}
      nodeData={nodeData}
      title={nodeData.Name}
      label={nodeData.AlarmStatus}
      status={tagStatus}
      disable={that.state.tagTotal}
      widgetType={that.props.widgetType}/>)

      nodemenuItems.push(menuItem);

    });

    var allCheckStyle = {
        marginLeft: '20px',
        width: '24px',
      },
      labelstyle = {
        width: '0px',
        height: '0px'
      },
      boxStyle = {
        marginLeft: '20px',
        width: '30px'
      };

    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        overflow: 'hidden'
      }}>
      <div className="allcheck" >
          <Checkbox
      onClick={this._onAllCheck}
      ref="checkall"
      checked={this.state.checked}
      disabled={this.state.allCheckDisable}
      style={allCheckStyle}
      labelStyle={labelstyle}
      title={tooltipText}
      />
        <div>
          {I18N.Tag.SelectAll}
        </div>
      </div>
      <div style={{
        'overflowY': 'auto',
        'overflowX': 'hidden',
        display: 'flex',
        flexDirection: 'column',
        flex: '1'
      }}>
        {nodemenuItems}
      </div>


  </div>


      )
  }
});

module.exports = TagMenu;
