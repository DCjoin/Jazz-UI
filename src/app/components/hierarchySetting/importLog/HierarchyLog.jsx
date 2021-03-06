'use strict';
import React from "react";
import PropTypes from 'prop-types';
import { CircularProgress } from 'material-ui';
import HierarchyAction from '../../../actions/hierarchySetting/HierarchyAction.jsx';
import HierarchyLogList from './HierarchyLogList.jsx';
import HierarchyStore from '../../../stores/hierarchySetting/HierarchyStore.jsx';
var createReactClass = require('create-react-class');

var HierarchyLog = createReactClass({
  contextTypes:{
      currentRoute: PropTypes.object
  },
  getInitialState: function() {
    return {
      isLoading: true
    };
  },
  _onChange() {
    this.setState({
      logList: HierarchyStore.getLogList(),
      isLoading: false
    });
  },

  componentWillMount: function() {
    document.title = I18N.MainMenu.CustomerSetting;
  },
  componentDidMount: function() {
    HierarchyAction.getLogListByCustomerId(this.context.currentRoute.params.customerId);
    HierarchyStore.addLogListChangeListener(this._onChange);
  },
  componentWillUnmount: function() {
    HierarchyStore.removeLogListChangeListener(this._onChange);
  },

  render: function() {
    var templateContent = (this.state.isLoading ? <div style={{
      textAlign: 'center',
      marginTop: '400px'
    }}><CircularProgress  mode="indeterminate" size={80} /></div> : <HierarchyLogList ref='logList' logList={this.state.logList}/>);
    return (
      <div className="jazz-template-container">
        <div className="jazz-template-content">
          <div className="jazz-template-center">
            <div className="jazz-template-list">
              {templateContent}
            </div>
          </div>
        </div>
      </div>
      );
  }
});

module.exports = HierarchyLog;
