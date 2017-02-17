'use strict';
import React from "react";
import moment from 'moment';
import CommonFuns from '../util/Util.jsx';
import ViewableDatePicker from '../controls/ViewableDatePicker.jsx';
import CalendarTime from '../controls/CalendarTime.jsx';

let {hourPickerData, dateAdd} = CommonFuns;

let _isStart = null;

let DateTimeSelector = React.createClass({
  propTypes: {
    startDate: React.PropTypes.object,
    endDate: React.PropTypes.object,
    startTime: React.PropTypes.number,
    endTime: React.PropTypes.number,
    showTime: React.PropTypes.bool,
    isTimeFixed:React.PropTypes.bool,
  },
  getDefaultProps(){
    return {
      showTime: true,
      isTimeFixed:false
    };
  },
  setDateField(startDate, endDate, callback) {

    let startTime = startDate.getHours(),
      endTime = endDate.getHours();

    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(0, 0, 0, 0);
    if (endTime === 0) {
      endDate = dateAdd(endDate, -1, 'days');
      endTime = 24;
    }

    this.setState({
      startDate: startDate,
      endDate: endDate,
      startTime: startTime,
      endTime: endTime
    }, () => {
      if (callback)
        callback(startDate, endDate, startTime, endTime);
    });

  },
  getDateTime() {

    let startDate = this.state.startDate,
      endDate = this.state.endDate,
      startTime = this.state.startTime,
      endTime = this.state.endTime;

    startDate.setHours(startTime, 0, 0, 0);
    if (endTime === 24) {
      endDate = dateAdd(endDate, 1, 'days');
      endDate.setHours(0, 0, 0, 0);
    } else {
      endDate.setHours(endTime, 0, 0, 0);
    }
    return {
      start: startDate,
      end: endDate
    };
  },
  getTimeType() {
    return _isStart;
  },
  _onChangeDateTime: function(sd, st, ed, et) {
    var multiDate = false;
    var startDate = sd,
      startTime = st,
      endDate = ed,
      endTime = et;
    if (sd === null) {
      startDate = new Date(this.state.startDate);
    }
    if (st === null) {
      startTime = this.state.startTime;
    }
    if (ed === null) {
      endDate = new Date(this.state.endDate);
    }
    if (et === null) {
      endTime = this.state.endTime;
    }
    if ((sd !== null) || (st !== null)) {
      _isStart = true;
    } else if ((ed !== null) || (et !== null)) {
      _isStart = false;
    }
    if (startDate === null) {
      startDate = new Date();
      multiDate = true;
    }
    if (endDate === null) {
      endDate = new Date();
    }

    startDate.setHours(startTime, 0, 0, 0);
    if (endTime === 24) {
      endDate = dateAdd(endDate, 1, 'days');
      endDate.setHours(0, 0, 0, 0);
    } else {
      endDate.setHours(endTime, 0, 0, 0);
    }
    if (startDate.getTime() >= endDate.getTime() || multiDate) {
      if ((sd !== null) || (st !== null)) {
        if (this.props.showTime === false) {
          endDate = dateAdd(startDate, 1, 'days');
        } else {
          endDate = dateAdd(startDate, 1, 'hours');
        }
      } else if ((ed !== null) || (et !== null)) {
        if (this.props.showTime === false) {
          startDate = dateAdd(endDate, -1, 'days');
        } else {
          startDate = dateAdd(endDate, -1, 'hours');
        }
      }
    }
    this.setDateField(startDate, endDate, this.props._onDateSelectorChanged);
  },
  getDefaultProps() {
    return {
      startDate: null,
      endDate: null,
      startTime: null,
      endTime: null
    };
  },
  getInitialState: function() {
    let startDate = this.props.startDate || null;
    let endDate = this.props.endDate || null;
    let startTime,
      endTime;
    if (this.props.startTime) {
      startTime = this.props.startTime;
    } else {
      startTime = this.props.startDate ? this.props.startDate.getHours() : 0;
    }
    if (this.props.endTime) {
      endTime = this.props.endTime;
    } else {
      if (this.props.endDate) {
        endTime = this.props.endDate.getHours();
        if (endTime === 0) {
          endDate = dateAdd(endDate, -1, 'days');
          endTime = 24;
        }
      } else {
        endTime = 24;
      }
    }

    return {
      startDate: startDate,
      endDate: endDate,
      startTime: startTime,
      endTime: endTime
    };
  },
  componentWillReceiveProps(nextProps) {
    if (nextProps.startDate) {
      let startDate = nextProps.startDate,
        endDate = nextProps.endDate;
      let startTime,
        endTime;
      if (nextProps.startTime) {
        startTime = nextProps.startTime;
      } else {
        startTime = nextProps.startDate ? nextProps.startDate.getHours() : 0;
      }
      if (nextProps.endTime) {
        endTime = nextProps.endTime;
      } else {
        if (nextProps.endDate) {
          endTime = nextProps.endDate.getHours();
          if (endTime === 0) {
            endDate = dateAdd(endDate, -1, 'days');
            endTime = 24;
          }
        } else {
          endTime = 24;
        }
      }
      this.setState({
        startDate: startDate,
        endDate: endDate,
        startTime: startTime,
        endTime: endTime
      });
    }
  },
  render() {
    var me = this;
    var {showTime,isTimeFixed}=this.props;
    var dateStyle = {
      width: '112px',
      height: '32px',
      fontSize: '14px',
      fontFamily: 'Microsoft YaHei'
    };
    var startDateProps = {
      datePickerClassName:'jazz-energy-date-picker',
      dateFormatStr: 'YYYY/MM/DD',
      value: this.state.startDate && moment(this.state.startDate).format("YYYY/MM/DD"),
      isViewStatus:false,
      width: '90px',
      onChange: function(value) {
        value=moment(value)._d;
        me._onChangeDateTime(value, null, null, null);
      }
    },
    startTimeProps={
      selectedTime:this.state.startTime,
      onTimeChange:(e, selectedIndex, value)=>{this._onChangeDateTime(null, value, null, null)},
      timeType: 0,
      isView:isTimeFixed
    };
    var endDateProps = {
      datePickerClassName:'jazz-energy-date-picker',
      dateFormatStr: 'YYYY/MM/DD',
      value: this.state.endDate && moment(this.state.endDate).format("YYYY/MM/DD"),
      timeType: 1,
      //left: this.props.endLeft,
      width: '90px',
      onChange: function(value) {
        value=moment(value)._d;
        me._onChangeDateTime(null, null, value, null);
      },
    },
    endTimeProps={
      selectedTime:this.state.endTime,
      onTimeChange:(e, selectedIndex, value)=>{this._onChangeDateTime(null, null, null, value)},
      timeType: 1,
      isView:isTimeFixed
    };
    return <div className='jazz-full-border-datepicker'>
      <div className='jazz-full-border-datepicker-container'>
        <ViewableDatePicker {...startDateProps}/>
        {showTime &&  <CalendarTime ref='startTime' {...startTimeProps}/>}
      </div>
      <span>{I18N.EM.To}</span>
      <div className='jazz-full-border-datepicker-container'>
        <ViewableDatePicker {...endDateProps}/>
        {this.props.showTime && <CalendarTime ref='endTime' {...endTimeProps}/>}
      </div>
    </div>;

  }
});
module.exports = DateTimeSelector;
