'use strict';

import React from "react";
import { CircularProgress, FlatButton, Checkbox, FontIcon } from 'material-ui';
import TagAction from '../../../actions/customerSetting/TagAction.jsx';
import TagStore from '../../../stores/customerSetting/TagStore.jsx';
import { List } from 'immutable';
import DateTimeSelector from '../../../controls/DateTimeSelector.jsx';
import CommonFuns from '../../../util/Util.jsx';
import Dialog from '../../../controls/PopupDialog.jsx';
import ChartPanel from './RawDataChartPanel.jsx';
function emptyList() {
  return new List();
}
let PTagRawData = React.createClass({
  propTypes: {
    selectedTag: React.PropTypes.object
  },
  getInitialState: function() {
    return ({
      tagData: null,
      isLoading: true,
      veeTagStatus: null,
      start: this._getInitDate().start,
      end: this._getInitDate().end,
      paulseDialogShow: false,
      isRawData: this.props.selectedTag.get('IsAccumulated') ? false : true,
    })
  },
  _getInitDate: function() {
    let date = new Date();
    date.setHours(0, 0, 0, 0);
    let last7Days = CommonFuns.dateAdd(date, -6, 'days');
    let endDate = CommonFuns.dateAdd(date, 1, 'days');
    return ({
      start: last7Days,
      end: endDate
    })
  },
  _getTagsData: function(props, refreshTagStatus = false) {
    let d2j = CommonFuns.DataConverter.DatetimeToJson,
      start = d2j(this.state.start, false),
      end = d2j(this.state.end, false);
    TagAction.getTagsData(props.selectedTag.get('Id'), props.selectedTag.get('CalculationStep'), start, end, refreshTagStatus);
    this.setState({
      isLoading: true,
    })
  },
  _onChanged: function() {
    this.setState({
      tagData: this.state.isRawData ? TagStore.getRawData() : TagStore.getDifferenceData(),
      isLoading: false,
      veeTagStatus: TagStore.getTagStatus(),
    })
  },
  _onSwitchRawDataView: function() {
    var rawDataStatus = this.state.isRawData;
    this.setState({
      tagData: !rawDataStatus ? TagStore.getRawData() : TagStore.getDifferenceData(),
      isLoading: false,
      isRawData: !rawDataStatus,
    })
  },
  _onDateSelectorChanged: function() {
    let that = this,
      dateSelector = this.refs.dateTimeSelector,
      timeRange = dateSelector.getDateTime();

    this.setState({
      start: timeRange.start,
      end: timeRange.end
    }, () => {
      that._getTagsData(this.props)
    })
  },
  _onPauseDialogShow: function() {
    this.setState({
      paulseDialogShow: true
    })
  },
  _onStatusChanged: function(st) {
    var veeTagStatus = this.state.veeTagStatus,
      status = veeTagStatus.get('Status'),
      index = status.findIndex(item => item.get('Type') == st.get('Type')),
      sta = st;
    if (sta.get('Status') === 2) {
      sta = sta.set('Status', 1)
    } else {
      sta = sta.set('Status', 2)
    }
    veeTagStatus = veeTagStatus.set('Status', status.setIn([index], sta));
    this.setState({
      veeTagStatus: veeTagStatus
    })

  },
  _onModifyVEETagStatus: function() {
    TagAction.modifyVEETagStatus(this.state.veeTagStatus.toJS());
    this.setState({
      isLoading: true
    })
  },
  // _afterChartCreated(chartObj) {
  //   if (chartObj.options.scrollbar && chartObj.options.scrollbar.enabled) {
  //     chartObj.xAxis[0].bind('setExtremes', this.OnNavigatorChanged);
  //   }
  // },
  _renderDialog: function() {
    var that = this;
    var closeDialog = function() {
      that.setState({
        paulseDialogShow: false
      });
    };
    if (!this.state.paulseDialogShow) {
      return null;
    } else {
      var Status = this.state.veeTagStatus.get('Status');
      var ruleType = TagStore.getRuleType();
      var content = [];
      ruleType.forEach(rule => {
        let st = Status.find(item => item.get('Type') === rule.id),
          index = Status.findIndex(item => item.get('Type') === rule.id);
        if (index > -1) {
          content.push(
            <div onClick={that._onStatusChanged.bind(this, st)}>
              <Checkbox
            ref=""
            defaultChecked={st.get('Status') === 2}
            style={{
              width: "auto",
              display: "block"
            }}
            />
              <label
            className="jazz-checkbox-label">
                {rule.type}
              </label>
            </div>
          )
        }
      })
      return (
        <Dialog openImmediately={this.state.paulseDialogShow} title={I18N.Setting.Tag.PTagRawData.PauseMonitor} modal={true} actions={[
          <FlatButton
          label={I18N.Platform.Password.Confirm}
          primary={true}
          onClick={() => {
            that._onModifyVEETagStatus();
            closeDialog();
          }} />,
          <FlatButton
          label={I18N.Platform.Password.Cancel}
          onClick={() => {
            that._onChanged();
            closeDialog();
          }} />
        ]}>
      <div>
        <div>
          {I18N.Setting.Tag.PTagRawData.PauseMonitorContent}
        </div>
        <div>
          <div>
            {I18N.Setting.VEEMonitorRule.RuleName}
          </div>
          <div style={{
          display: 'flex'
        }}>
            {content}
          </div>
        </div>
      </div>
      </Dialog>
        );
    }
  },
  _renderToolBar: function() {
    var pauseBtn = <FlatButton label={I18N.Setting.Tag.PTagRawData.PauseMonitor} style={{
      border: '1px solid black'
    }} onClick={this._onPauseDialogShow}/>;
    var switchIconStyle = {
      fontSize: '14px',
      margin: '0 8px'
    };
    var label = this.state.isRawData ? I18N.EM.Ratio.RawValue : I18N.Setting.Tag.PTagRawData.DifferenceValue;
    return (
      <div className='jazz-ptag-rawdata-toolbar'>
        <div className='leftside'>
        <div className='switch-accumulated'>
          <div className='label'>
            {label + '(' + I18N.Common.Glossary.UOM + ')'}
          </div>
          {this.props.selectedTag.get('IsAccumulated') ? <FontIcon className='icon-sync' style={switchIconStyle} ref="switchIcon" onClick={this._onSwitchRawDataView}/> : null}
        </div>
        <DateTimeSelector ref='dateTimeSelector' endLeft='-100px' startDate={this.state.start} endDate={this.state.end} _onDateSelectorChanged={this._onDateSelectorChanged}/>
        </div>
        <div className='rightside'>
          {this.state.veeTagStatus.size === 0 ? null : pauseBtn}
        </div>
      </div>
      )
  },
  _renderChartComponent: function() {
    let d2j = CommonFuns.DataConverter.DatetimeToJson,
      start = d2j(this.state.start, false),
      end = d2j(this.state.end, false);
    let obj = {
      start: start,
      end: end,
      step: this.props.selectedTag.get('CalculationStep'),
      timeRanges: [{
        StartTime: start,
        EndTime: end
      }]
    };
    var dataForChart = TagStore.getDataForChart(this.state.tagData.toJS(), obj);
    var chartProps = {
      ref: 'ChartComponent',
      energyData: dataForChart,
      energyRawData: this.state.tagData.toJS(),
      step: obj.step,
      startTime: obj.start,
      endTime: obj.end,
      timeRanges: obj.timeRanges
    }
    return (
      <div>
        <ChartPanel {...chartProps}/>
      </div>
      )
  },
  componentDidMount: function() {
    TagStore.addTagDatasChangeListener(this._onChanged);
    this._getTagsData(this.props, true);
  },

  componentWillReceiveProps: function(nextProps) {
    var that = this;
    if (nextProps.selectedTag !== this.props.selectedTag) {
      that.setState({
        start: this._getInitDate().start,
        end: this._getInitDate().end
      }, () => {
        that._getTagsData(nextProps, true)
      })
    }
  },
  componentWillUnmount: function() {
    TagStore.removeTagDatasChangeListener(this._onChanged);
  },
  render: function() {

    if (this.state.isLoading) {
      return (
        <div style={{
          display: 'flex',
          flex: 1,
          'alignItems': 'center',
          'justifyContent': 'center'
        }}>
                    <CircularProgress  mode="indeterminate" size={2} />
                  </div>
        )

    } else {
      return (
        <div className='jazz-ptag-rawdata'>
          {this._renderToolBar()}
          {this._renderDialog()}
          {this._renderChartComponent()}
        </div>
        )
    }


  },

});
module.exports = PTagRawData;
