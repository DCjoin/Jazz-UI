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
    this.setState({
      reportList: ReportStore.getReportList(),
      isLoading: false
    });
  },
  componentDidMount: function() {
    ReportAction.getReportListByCustomerId(window.currentCustomerId);
    ReportStore.addReportlistChangeListener(this._onChange);
  },
  componentWillUnmount: function() {
    ReportStore.removeReportlistChangeListener(this._onChange);
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
      value: 0,
      text: I18N.Report.Sort.ReportName
    }, {
      value: 1,
      text: I18N.Report.Sort.UserName
    }];



    var reportContent = (this.state.isLoading ? <div style={{
      'text-align': 'center',
      'margin-top': '400px'
    }}><CircularProgress  mode="indeterminate" size={1} /></div> : <ReportList ref='reportList'   onItemClick={this.props.onItemClick} reportList={this.state.reportList}></ReportList>);

    return (
      <div className="jazz-report-leftpanel-container">
        <div className="jazz-report-leftpanel-header">
          <div className={classSet(newFolderClasses)} style={{
        margin: '0 30px'
      }}>
            <FlatButton onClick={this._onNewReport} style={buttonStyle}>
              <FontIcon  className="fa icon-add btn-icon"/>
              <span className="mui-flat-button-label btn-text">{I18N.Report.Name}</span>
            </FlatButton>
          </div>
          <div>

          </div>
        </div>

        <div className="jazz-report-leftpanel-sort">
          <DropDownMenu onChange={this._onSortChange}  menuItems={sortItems}></DropDownMenu>
        </div>

        <div className="jazz-report-leftpanel-reportlist">
          {reportContent}
        </div>
      </div>
      );
  }
});

module.exports = ReportLeftPanel;
