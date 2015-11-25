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
      isLoading: true,
      disableAddButton: false
    };
  },
  _addNewReport: function() {
    var newReportItem = {
      id: 0,
      templateId: null,
      name: null,
      createUser: null,
      data: []
    };
    ReportAction.setSelectedReportItem(newReportItem);
  },
  _onChangeReportItem() {
    var reportItem = ReportStore.getSelectedReportItem();
    if (reportItem.get('id') !== 0) {
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
  componentDidMount: function() {
    ReportAction.getReportListByCustomerId(parseInt(window.currentCustomerId));
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
            <FlatButton onClick={this._addNewReport} style={buttonStyle} disabled={this.state.disableAddButton}>
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
