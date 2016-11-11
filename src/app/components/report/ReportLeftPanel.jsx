'use strict';
import React from "react";
import { CircularProgress, FlatButton, FontIcon, DropDownMenu } from 'material-ui';
import MenuItem from 'material-ui/MenuItem';
import classSet from 'classnames';
import ReportAction from '../../actions/ReportAction.jsx';
import ReportList from './ReportList.jsx';
import ReportStore from '../../stores/ReportStore.jsx';


var ReportLeftPanel = React.createClass({

  contextTypes:{
      currentRoute: React.PropTypes.object
  },
  getInitialState: function() {
    return {
      isLoading: true,
      disableAddButton: false,
      value:'Name'
    };
  },
  _addNewReport: function() {
    var newReportItem = {
      id: 0,
      templateId: null,
      name: '',
      createUser: '',
      data: []
    };
    ReportAction.setSelectedReportItem(newReportItem);
  },
  _onChangeReportItem() {
    var reportItem = ReportStore.getSelectedReportItem();
    if (reportItem === null || (reportItem !== null && reportItem.get('id') !== 0)) {
      this.setState({
        disableAddButton: false
      });
    } else {
      this.setState({
        disableAddButton: true
      });
    }
  },
  _onChange() {
    this.setState({
      reportList: ReportStore.getReportList(),
      isLoading: false
    });
  },
  _onSortChange(e, selectedIndex, value) {
    this.setState({
      value:value
    });
    ReportAction.getReportListByCustomerId(parseInt(this.context.currentRoute.params.customerId), value, 'asc');
  },
  componentDidMount: function() {
    ReportAction.getReportListByCustomerId(parseInt(this.context.currentRoute.params.customerId), 'Name', 'asc');
    ReportStore.addReportListChangeListener(this._onChange);
    ReportStore.addReportItemChangeListener(this._onChangeReportItem);
  },
  componentWillUnmount: function() {
    ReportStore.removeReportListChangeListener(this._onChange);
    ReportStore.removeReportItemChangeListener(this._onChangeReportItem);
  },

  render: function() {
    //style
    var buttonStyle = {
      backgroundColor: 'transparent',
      height: '32px'
    },menustyle={
      style:{
        height: '40px',
        width: '192px'
      },
      labelStyle:{
        color:'#ffffff',
        lineHeight: '40px'
      }
    };
    var newReportClasses = {
      'se-dropdownbutton': true,
      'btn-container': true,
      'btn-container-active': !this.state.disableAddButton
    };
    var sortItems = [
    <MenuItem key={1} value='Name' primaryText={I18N.EM.Report.ReportSort}/>,
    <MenuItem key={2} value='CreateUser' primaryText={I18N.EM.Report.UserSort}/>
    ];


    var reportContent = (this.state.isLoading ? <div style={{
      textAlign: 'center',
      marginTop: '400px'
    }}><CircularProgress  mode="indeterminate" size={80} /></div> : <ReportList ref='reportList' reportList={this.state.reportList} reportItem={this.state.reportItem}></ReportList>);
    var headerDom = (this.props.onlyRead ? null : <div className="jazz-report-leftpanel-header">
      <div className={classSet(newReportClasses)} style={{
      margin: '0 30px'
    }}>
        <FlatButton onClick={this._addNewReport} style={buttonStyle} disabled={this.state.disableAddButton}>
          <FontIcon className="fa icon-add btn-icon"/>
          <span className="mui-flat-button-label btn-text">{I18N.EM.Report.Report}</span>
        </FlatButton>
      </div>
    </div>);
    return (
      <div className="jazz-report-leftpanel-container">
        {headerDom}
        <div className="jazz-report-leftpanel-sort">
          <DropDownMenu {...menustyle}
            onChange={this._onSortChange} value={this.state.value}>{sortItems}</DropDownMenu>
        </div>
        <div className="jazz-report-leftpanel-reportlist">
          {reportContent}
        </div>
      </div>
      );
  }
});

module.exports = ReportLeftPanel;
