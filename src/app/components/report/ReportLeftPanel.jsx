'use strict';
import React from "react";
import { CircularProgress, FlatButton, FontIcon, DropDownMenu } from 'material-ui';
import classSet from 'classnames';
import ReportAction from '../../actions/ReportAction.jsx';
import ReportList from './ReportList.jsx';
import ReportStore from '../../stores/ReportStore.jsx';


var ReportLeftPanel = React.createClass({


  getInitialState: function() {
    return {
      isLoading: true
    };
  },
  _onNewReport: function() {},
  _onChange() {
    var reportList = ReportStore.getReportList();
    var reportItem = null;
    if (reportList !== null && reportList.size !== 0) {
      reportItem = {
        id: reportList.get(0).get('Id'),
        templateId: reportList.get(0).get('TemplateId'),
        name: reportList.get(0).get('Name'),
        createUser: reportList.get(0).get('CreateUser'),
        data: reportList.get(0).get('CriteriaList'),
        version: reportList.get(0).get('Version')
      };
    }
    this.setState({
      reportList: ReportStore.getReportList(),
      reportItem: reportItem,
      isLoading: false
    });

  },
  componentDidMount: function() {
    ReportAction.getReportListByCustomerId(window.currentCustomerId);
    ReportStore.addReportListChangeListener(this._onChange);
  },
  componentWillUnmount: function() {
    ReportStore.removeReportListChangeListener(this._onChange);
  },

  render: function() {
    //style
    var buttonStyle = {
      backgroundColor: 'transparent',
      height: '32px'
    };
    var newFolderClasses = {
      'se-dropdownbutton': true,
      'btn-container': true,
      'btn-container-active': true
    };
    var sortItems = [{
      payload: 0,
      text: I18N.EM.Report.ReportSort
    }, {
      payload: 1,
      text: I18N.EM.Report.UserSort
    }];


    var reportContent = (this.state.isLoading ? <div style={{
      'text-align': 'center',
      'margin-top': '400px'
    }}><CircularProgress  mode="indeterminate" size={1} /></div> : <ReportList ref='reportList'   onItemClick={this.props.onItemClick} reportList={this.state.reportList} reportItem={this.state.reportItem}></ReportList>);

    return (
      <div className="jazz-report-leftpanel-container">
        <div className="jazz-report-leftpanel-header">
          <div className={classSet(newFolderClasses)} style={{
        margin: '0 30px'
      }}>
            <FlatButton onClick={this._onNewReport} style={buttonStyle}>
              <FontIcon  className="fa icon-add btn-icon"/>
              <span className="mui-flat-button-label btn-text">{I18N.EM.Report.Report}</span>
            </FlatButton>
          </div>
          <div>

          </div>
        </div>

        <div className="jazz-report-leftpanel-sort">
          <DropDownMenu onChange={this._onSortChange} menuItems={sortItems}></DropDownMenu>
        </div>

        <div className="jazz-report-leftpanel-reportlist">
          {reportContent}
        </div>
      </div>
      );
  }
});

module.exports = ReportLeftPanel;
