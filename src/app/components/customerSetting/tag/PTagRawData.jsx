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
let PTagRawData = React.createClass({
  propTypes: {
    selectedTag: React.PropTypes.object,
    onSwitchRawDataListView: React.PropTypes.func,
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
      showErrorDialog: false
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
    var rawDataStatus = this.state.isRawData,
      that = this;
    this.setState({
      tagData: !rawDataStatus ? TagStore.getRawData() : TagStore.getDifferenceData(),
      isLoading: false,
      isRawData: !rawDataStatus,
    }, () => {
      that.props.onSwitchRawDataListView(false, this.state.isRawData);
    })
  },
  _onDateSelectorChanged: function() {
    let that = this,
      dateSelector = this.refs.dateTimeSelector,
      timeRange = dateSelector.getDateTime(),
      showErrorDialog = false;
    if (timeRange.end - timeRange.start > 30 * 24 * 60 * 60 * 1000) {
      showErrorDialog = true;
    }
    if (showErrorDialog) {
      this.setState({
        showErrorDialog: true
      })
    } else {
      this.setState({
        start: timeRange.start,
        end: timeRange.end,
        showErrorDialog: showErrorDialog
      }, () => {
        that._getTagsData(that.props)
      })
    }

  },
  _renderErrorDialog: function() {
    var that = this;
    if (this.state.showErrorDialog) {
      return (<Dialog
        ref = "_dialog"
        title={I18N.Platform.ServiceProvider.ErrorNotice}
        modal={false}
        openImmediately={true}
        onDismiss={() => {
          that.setState({
            showErrorDialog: false
          })
        }}
        >
        {I18N.EM.RawData.Error}
    </Dialog>)
    } else {
      return null;
    }
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
  _onSwitchListView: function() {
    this.props.onSwitchRawDataListView(true, this.state.isRawData);
  },
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
      if (Status.size === 0) {
        content = <div style={{
          fontSize: '14px',
          color: '#464949'
        }}>{I18N.Setting.Tag.PTagRawData.PauseMonitorNoRule}</div>;
      } else {
        ruleType.forEach(rule => {
          let st = Status.find(item => item.get('Type') === rule.id),
            index = Status.findIndex(item => item.get('Type') === rule.id);
          if (index > -1) {
            content.push(
              <div onClick={that._onStatusChanged.bind(this, st)} style={{
                marginRight: '30px',
                display: 'flex'
              }}>
                <Checkbox
              ref=""
              defaultChecked={st.get('Status') === 2}
              style={{
                width: "auto",
                display: "block"
              }}
              />
                <label
              className="jazz-checkbox-label" style={{
                marginLeft: '-6px',
              }}>
                  {rule.type}
                </label>
              </div>
            )
          }
        })
      }

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
      <div className='jazz-ptag-rawdata-pauseMonitor'>
        <div className='subTitile'>
          {I18N.Setting.Tag.PTagRawData.PauseMonitorContent}
        </div>
        <div>
          <div className='ruleName'>
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
    var switchIconStyle = {
        fontSize: '16px',
        margin: '0 -2px 0 8px'
      },
      labelStyle = {
        color: '#464949'
      },
      pauseBtnStyle = {
        border: '1px solid #e4e7e9',
        height: '34px',
        width: '92px'
      },
      listBtnStyle = {
        fontSize: '36px',
        marginLeft: '30px',
        height: '36px',
        marginTop: '-8px',
        cursor: 'pointer'
      };
    var pauseBtn = <FlatButton label={I18N.Setting.Tag.PTagRawData.PauseMonitor}
    style={pauseBtnStyle} labelStyle={labelStyle} onClick={this._onPauseDialogShow}/>;

    var label = this.state.isRawData ? I18N.EM.Ratio.RawValue : I18N.Setting.Tag.PTagRawData.DifferenceValue;
    return (
      <div className='jazz-ptag-rawdata-toolbar'>
        <div className='leftside'>
        <div className='switch-accumulated'>
          <div className='label'>
            {label + '(' + this.state.tagData.getIn(['TargetEnergyData', 0, 'Target', 'Uom']) + ')'}
          </div>
          {this.props.selectedTag.get('IsAccumulated') ? <FontIcon className='icon-sync' style={switchIconStyle} ref="switchIcon" onClick={this._onSwitchRawDataView}/> : null}
        </div>
        <DateTimeSelector ref='dateTimeSelector' endLeft='-100px' startDate={this.state.start} endDate={this.state.end} _onDateSelectorChanged={this._onDateSelectorChanged}/>
        </div>
        <div className='rightside'>
          {this.state.veeTagStatus.size === 0 ? null : pauseBtn}
           <FontIcon className='icon-taglist-fold' style={listBtnStyle} ref="listBtn" onClick={this._onSwitchListView}/>
        </div>
      </div>
      )
  },
  _renderComment: function() {
    return (
      <div className='jazz-ptag-rawdata-comment'>
        <div className='item'>
          <label className='normal-circle'/>
          <div className='label'>{I18N.Setting.Tag.PTagRawData.normal}</div>
        </div>
        <div className='item'>
          <label className='abnormal-circle'/>
          <div className='label'>{I18N.Setting.Tag.PTagRawData.abnormal}</div>
        </div>
        <div className='item'>
          <label className='repair-circle'/>
          <div className='label'>{I18N.Setting.Tag.PTagRawData.repair}</div>
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
      energyRawData: this.state.tagData,
      step: obj.step,
      startTime: obj.start,
      endTime: obj.end,
      timeRanges: obj.timeRanges
    };
    if (this.state.tagData.getIn(['TargetEnergyData', 0, 'EnergyData']).size === 0) {
      return (
        <div style={{
          display: 'flex',
          'flexDirection': 'column',
          marginTop: '77px'
        }}>
        </div>
        )
    } else {
      return (
        <div style={{
          display: 'flex',
          'flexDirection': 'column',
          marginTop: '77px'
        }}>
          <ChartPanel {...chartProps}/>
          {this._renderComment()}
        </div>
        )
    }

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
        end: this._getInitDate().end,
        isRawData: nextProps.selectedTag.get('IsAccumulated') ? false : true,
        showErrorDialog: false
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
            {this._renderErrorDialog()}
          </div>
        )
    }


  },

});
module.exports = PTagRawData;
