'use strict';
import classnames from 'classnames';
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
import RawDataList from './drawer_datalist.jsx';
import Toast from '@emop-ui/piano/toast';
import IconButton from 'material-ui/IconButton';

import { CircularProgress, Checkbox, FontIcon,FlatButton} from 'material-ui';
import PermissionCode from 'constants/PermissionCode.jsx';
import privilegeUtil from 'util/privilegeUtil.jsx';
import CurrentUserStore from 'stores/CurrentUserStore.jsx';

var isDataQualityFull=()=>privilegeUtil.isFull( PermissionCode.DATA_QUALITY_MAINTENANCE, CurrentUserStore.getCurrentPrivilege() )

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
      endTime: this._getInitDate().endTime,
      onDrawerShow: false,  // 抽屉浮层
      openToast: false  // toast显示
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
  // 点击数据修复显示浮层操作
  _onDrawerShow = () => {
    this.setState({onDrawerShow: true})
  }
  _onDrawerRequestChange = () => {
      this.setState({onDrawerShow: false})
  }
  // 撤销修复
  _onRollback = () => {
    let d2j = CommonFuns.DataConverter.DatetimeToJson,
        start = d2j(this.state.start, false),
        end = d2j(this.state.end, false),
        tagId= this.props.selectedTag.get('Id');
        TagAction.rollBack(tagId,start,end,()=>{
          this.setState({openToast: true})
      });
  }
  // 空值修复
  _onNullValRepair = () => {
      let tagId = this.props.selectedTag.get('Id'),
          start = moment(this.state.start).subtract(8, 'hours').format('YYYY-MM-DDTHH:mm:ss'),
          end = moment(this.state.end).subtract(8, 'hours').format('YYYY-MM-DDTHH:mm:ss');
        TagAction.manualScanTag(tagId,start,end);
  }
  _renderToolBar() {
    var switchIconStyle = {
        fontSize: '16px',
        margin: '0 -2px 0 8px',
        lineHeight:'21px'
      },
      labelStyle = {
        color: '#464949',
        fontSize: '14px',
        height: '30px',
        lineHeight:'30px'
      },
      pauseBtnStyle = {
        border: '1px solid #e6e6e6',
        height: '30px',
        lineHeight:'30px',
        width: '92px',
        backgroundColor: '#ffffff',
        marginLeft:'10px'
      };
    // var autoRepairBtn = <FlatButton key={'autoRepairBtn'} label={I18N.Setting.VEEMonitorRule.AutoRepair}
    // style={pauseBtnStyle} labelStyle={labelStyle} onClick={() => {
    //   TagAction.manualScanTag(
    //     this.props.selectedTag.get('Id'),
    //     moment(this.state.start).subtract(8, 'hours').format('YYYY-MM-DDTHH:mm:ss'),
    //     moment(this.state.end).subtract(8, 'hours').format('YYYY-MM-DDTHH:mm:ss'),
    //   )
    // }}/>;
    // var pauseBtn = <FlatButton label={I18N.Setting.Tag.PTagRawData.PauseMonitor}
    //   style={pauseBtnStyle} labelStyle={labelStyle} onClick={this._onPauseDialogShow}/>;

    // var rollbackBtn= <FlatButton label={I18N.Setting.Tag.PTagRawData.RollBack}
    //   style={pauseBtnStyle} labelStyle={labelStyle} onClick={this._onRollBack}/>


   // 新增的数据修复按钮
    let dataRepairBtn = <FlatButton
                          label={I18N.Setting.Tag.PTagRawData.DataRepair}
                          style={pauseBtnStyle}
                          labelStyle={labelStyle}
                          onClick={this._onDrawerShow}
                          />;

    var label = this.state.isRawData ? I18N.EM.Ratio.RawValue : I18N.Setting.Tag.PTagRawData.DifferenceValue;
    var uom=this.state.tagData.getIn(['TargetEnergyData', 0, 'Target', 'Uom']);
    if(uom==="null") uom=""
        else uom='(' + uom + ')'
    return (
      <div className='jazz-ptag-rawdata-toolbar'>
        <div className='leftside'>
        <div className='switch-accumulated' style={{marginRight:'4px'}}>
          <div className='label' style={{lineHeight:'20px'}}>
            {label + uom}
          </div>
          {this.props.selectedTag.get('IsAccumulated') ?
          <FontIcon className={classnames('icon-change','hover')}
           color={"#32AD3C"} hoverColor={"#3DCD58"} style={switchIconStyle} ref="switchIcon" onClick={this._onSwitchRawDataView}/> : null}
        </div>
        <DateTimeSelector ref='dateTimeSelector' showTime={true} endLeft='-100px'
                          startDate= {this.state.startDate}
                          endDate={this.state.endDate}
                          startTime={this.state.startTime}
                          endTime={this.state.endTime}
                          _onDateSelectorChanged={this._onDateSelectorChanged}/>
        </div>
        {isDataQualityFull() && <div className='rightside' style={{marginRight:'0'}}>
          {dataRepairBtn}
        </div>}

        <Toast autoHideDuration={3000}
               className="toast-tip"
               open={this.state.openToast}
               onRequestClose={() => {
                this.setState({
                  openToast: false,
              })
            }}>
            {I18N.VEE.Notice.RollBackSuccess}
        </Toast>
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
  _onRawDataChange(newData,orgData) {
      // this.refs.tagDetail._setLoading();
      console.log(newData, orgData, 'tag_chart')
      TagAction.modifyTagRawData(newData, orgData);
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
    let listProps = {
      isRawData: this.state.isRawData,
      step: this.props.selectedTag.get('CalculationStep'),
      selectedTag: this.props.selectedTag,
      openDrawer: this.state.onDrawerShow,
      filterType: this.props.filterType,
      onRequestChange: this._onDrawerRequestChange, // 点击其他区域关闭的func
      rollBack: this._onRollback,  // 侧消修复的func
      nullValRepair: this._onNullValRepair, // 空值修复的func
      onRawDataChange:this._onRawDataChange // 渲染列表的func
    }
      return(
            <div className='jazz-ptag-rawdata'>
              {
                this.state.isLoading
                  ? <div style={{display: 'flex', flex: 1, alignItems: 'center', justifyContent: 'center'}}><Spin/></div>
                  :  <div style={{display:'flex',flex:'1',flexDirection:'column'}}>{this._renderToolBar()}
                      {this._renderChartComponent()}</div>
                }
                <div style={{display: 'flex'}}>
                    <RawDataList {...listProps} />
                </div>
            </div>
      )
  }
}

TagChart.propTypes= {
  selectedTag:PropTypes.object,
  showLeft:PropTypes.bool,
};