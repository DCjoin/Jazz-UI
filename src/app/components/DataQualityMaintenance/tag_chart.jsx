'use strict';

import React, { Component}  from "react";
import Spin from '@emop-ui/piano/spin';
import PropTypes from 'prop-types';
import TagAction from 'actions/customerSetting/TagAction.jsx';
import TagStore from 'stores/customerSetting/TagStore.jsx';
import CommonFuns from 'util/Util.jsx';
import Immutable from 'immutable';
import moment from 'moment';
import DateTimeSelector from 'controls/DateTimeSelector.jsx';
import ChartPanel from 'components/customerSetting/tag/RawDataChartPanel.jsx';

import { CircularProgress, Checkbox, FontIcon,FlatButton} from 'material-ui';

let {dateAdd} = CommonFuns;

export default class TagChart extends Component {
	constructor(props) {
		super(props);
		this.state = {
      tagData: null,
      veeTagStatus: null,
      refresh: false,
      isLoading: true,
      start: this._getInitDate().start,
      end: this._getInitDate().end,
      isRawData: this.props.selectedTag.get('IsAccumulated') ? false : true,
      startDate: this._getInitDate().startDate,
      endDate: this._getInitDate().endDate,
      startTime: this._getInitDate().startTime,
      endTime: this._getInitDate().endTime
		};
		this._onChanged = this._onChanged.bind(this);
		this._onUpdate = this._onUpdate.bind(this);
		this._onSwitchRawDataView = this._onSwitchRawDataView.bind(this);
		this._onDateSelectorChanged = this._onDateSelectorChanged.bind(this);
	}

  _getInitDate() {
    let date = new Date();
    date.setHours(0, 0, 0, 0);
    let last7Days = dateAdd(date, -6, 'days');
    let endDate = dateAdd(date, 1, 'days');
    return ({
      start: last7Days,
      end: endDate,
      startDate: last7Days,
      endDate: endDate,
      startTime: null,
      endTime: null
    })
  }

  _getTagsData(props, refreshTagStatus = false) {
    let d2j = CommonFuns.DataConverter.DatetimeToJson,
      start = d2j(this.state.start, false),
      end = d2j(this.state.end, false);
    TagAction.getTagsData(props.selectedTag.get('Id'), props.selectedTag.get('CalculationStep'), start, end, refreshTagStatus);
    this.setState({
      isLoading: true,
    })
  }

  _onChanged() {
    this.setState({
      tagData: this.state.isRawData ? TagStore.getRawData() : TagStore.getDifferenceData(),
      isLoading: false,
      veeTagStatus: TagStore.getTagStatus(),
    })
  }

  _onUpdate() {
    this._getTagsData(this.props, true);
  }

  _onSwitchRawDataView() {
    var rawDataStatus = this.state.isRawData;
    this.setState({
      tagData: !rawDataStatus ? TagStore.getRawData() : TagStore.getDifferenceData(),
      isLoading: false,
      isRawData: !rawDataStatus,
    })
  }

  _onDateSelectorChanged(startDate, endDate, startTime, endTime) {
    let that = this,
      dateSelector = this.refs.dateTimeSelector,
      timeRange = dateSelector.getDateTime();
    if (timeRange.end - timeRange.start > 30 * 24 * 60 * 60 * 1000) {
      let isStart = dateSelector.getTimeType();
      if (isStart) {
        endDate = dateAdd(startDate, 30, 'days');
        endTime = startTime;
        timeRange.end = new Date(endDate.setHours(endTime, 0, 0, 0));
      } else {
        //jacob 2016-04-05: 开始时间不能出现24点
        startDate = dateAdd(endDate, -30, 'days');
        startTime = endTime;
        if(endTime==24)
        {
          startTime = 0;
          startDate = dateAdd(startDate, 1, 'days');
        }
        timeRange.start = new Date(startDate.setHours(startTime, 0, 0, 0));
      }
    }

    this.setState({
      start: timeRange.start,
      end: timeRange.end,
      startDate: startDate,
      endDate: endDate,
      startTime: startTime,
      endTime: endTime
    }, () => {
      that._getTagsData(that.props)
    })

  }

  _renderToolBar() {
    var switchIconStyle = {
        fontSize: '16px',
        margin: '0 -2px 0 8px'
      },
      labelStyle = {
        color: '#464949',
        fontSize: '12px'
      },
      pauseBtnStyle = {
        border: '1px solid #e6e6e6',
        height: '30px',
        lineHeight:'30px',
        width: '92px',
        backgroundColor: '#ffffff',
        marginLeft:'10px'
      },
      listBtnStyle = {
        fontSize: '36px',
        marginLeft: '30px',
        height: '36px',
        marginTop: '-8px',
        cursor: 'pointer',
        color: '#767a7a'
      };
    var autoRepairBtn = <FlatButton key={'autoRepairBtn'} label={I18N.Setting.VEEMonitorRule.AutoRepair}
    style={pauseBtnStyle} labelStyle={labelStyle} onClick={() => {
      TagAction.manualScanTag(
        this.props.selectedTag.get('Id'),
        moment(this.state.start).subtract(8, 'hours').format('YYYY-MM-DDTHH:mm:ss'),
        moment(this.state.end).subtract(8, 'hours').format('YYYY-MM-DDTHH:mm:ss'),
      )
    }}/>;
    var pauseBtn = <FlatButton label={I18N.Setting.Tag.PTagRawData.PauseMonitor}
    style={pauseBtnStyle} labelStyle={labelStyle} onClick={this._onPauseDialogShow}/>;

  var rollbackBtn= <FlatButton label={I18N.Setting.Tag.PTagRawData.RollBack}
  style={pauseBtnStyle} labelStyle={labelStyle} onClick={this._onRollBack}/>

    var label = this.state.isRawData ? I18N.EM.Ratio.RawValue : I18N.Setting.Tag.PTagRawData.DifferenceValue;
    var uom=this.state.tagData.getIn(['TargetEnergyData', 0, 'Target', 'Uom']);
    if(uom==="null") uom=""
        else uom='(' + uom + ')'
    return (
      <div className='jazz-ptag-rawdata-toolbar'>
        <div className='leftside'>
        <div className='switch-accumulated' style={{marginRight:'4px'}}>
          <div className='label'>
            {label + uom}
          </div>
          {this.props.selectedTag.get('IsAccumulated') ? <FontIcon className='icon-change' style={switchIconStyle} ref="switchIcon" onClick={this._onSwitchRawDataView}/> : null}
        </div>
        <DateTimeSelector ref='dateTimeSelector' showTime={true} endLeft='-100px'     startDate= {this.state.startDate}
      endDate={this.state.endDate}
      startTime={this.state.startTime}
      endTime={this.state.endTime}  _onDateSelectorChanged={this._onDateSelectorChanged}/>
        </div>
        <div className='rightside' style={{marginRight:'0'}}>
          {autoRepairBtn}
          {rollbackBtn}
          {this.state.veeTagStatus.size === 0 ? null : pauseBtn}
        </div>
      </div>
      )
  }

    _renderComment() {
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
  }

  _renderChartComponent() {
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
      timeRanges: obj.timeRanges,
      refresh: this.state.refresh
    };
    if (this.state.tagData.getIn(['TargetEnergyData', 0, 'EnergyData']).size === 0) {
      return (
        <div style={{
          display: 'flex',
          'flexDirection': 'column',
          flex: '1'
        }}>
        </div>
        )
    } else {
      return (
        <div style={{
          display: 'flex',
          'flexDirection': 'column',
          flex: '1'
        }}>
          <ChartPanel {...chartProps}/>
          {this._renderComment()}
        </div>
        )
    }

  }


  componentDidMount() {
    TagStore.addTagDatasChangeListener(this._onChanged);
    TagStore.addTagDatasUpdateListener(this._onUpdate);
    this._getTagsData(this.props, true);
  }

    componentWillReceiveProps(nextProps) {
    var that = this;
    if (!nextProps.selectedTag.equals(this.props.selectedTag)) {
      that.setState({
        isRawData: nextProps.selectedTag.get('IsAccumulated') ? false : true
      }, () => {
        that._getTagsData(nextProps, true)
      })
    }
    // || this.props.showRawDataList !== nextProps.showRawDataList
    if (this.props.showLeft !== nextProps.showLeft ) {
      this.setState({
        refresh: true
      })
    } else {
      if (this.state.refresh === true) {
        this.setState({
          refresh: false
        })
      }
    }
  }
  shouldComponentUpdate(nextProps, nextState) {
    //  || this.props.showLeft !== nextProps.showLeft || this.props.showRawDataList !== nextProps.showRawDataList || 
    return (nextProps.selectedTag !== this.props.selectedTag || this.props.showLeft !== nextProps.showLeft || !Immutable.fromJS(nextState).equals(Immutable.fromJS(this.state)));
  }
  componentWillUnmount() {
    TagStore.removeTagDatasChangeListener(this._onChanged);
    TagStore.removeTagDatasUpdateListener(this._onUpdate);
  }



  render() {

    if (this.state.isLoading) {
      return (
        <div style={{
          display: 'flex',
          flex: 1,
          'alignItems': 'center',
          'justifyContent': 'center'
        }}>
                    <Spin/>
                  </div>
        )

    } else {
      return (
        <div className='jazz-ptag-rawdata'>
            {this._renderToolBar()}
            {this._renderChartComponent()}
          </div>
        )
    }


  }

}

TagChart.propTypes= {
  selectedTag:PropTypes.object,
  showLeft:PropTypes.bool,
};