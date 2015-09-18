'use strict';
import React from "react";
import { DropDownMenu, DatePicker } from 'material-ui';
import CommonFuns from '../util/Util.jsx';
import ViewableDatePicker from '../controls/ViewableDatePicker.jsx';

let {hourPickerData, dateAdd} = CommonFuns;


let DateTimeSelector = React.createClass({
  propTypes: {
    startDate: React.PropTypes.object,
    endDate: React.PropTypes.object,
    startTime: React.PropTypes.number,
    endTime: React.PropTypes.number,
    showTime: React.PropTypes.bool
  },
  setDateField(startDate, endDate, callback) {
    let startField = this.refs.startDate,
      endField = this.refs.endDate;

    let startTime = startDate.getHours(),
      endTime = endDate.getHours();

    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(0, 0, 0, 0);
    if (endTime === 0) {
      endDate = dateAdd(endDate, -1, 'days');
      endTime = 24;
    }

    //startField.setValue(startDate);
    //endField.setValue(endDate);
    this.setState({
      startDate: startDate,
      endDate: endDate,
      startTime: startTime,
      endTime: endTime
    }, () => {
      if (callback)
        callback();
    });
  //startField.setTime(startTime);
  //endField.setTime(endTime);
  },
  getDateTime() {
    let startField = this.refs.startDate,
      endField = this.refs.endDate;

    let startDate = startField.getValue(),
      endDate = endField.getValue(),
      startTime = startField.getTime(),
      endTime = endField.getTime();

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
  _onChangeDateTime: function(sd, st, ed, et) {

    var startDate = sd,
      startTime = st,
      endDate = ed,
      endTime = et;
    if (sd === null)
      startDate = this.refs.startDate.getValue();
    if (st === null)
      startTime = this.refs.startDate.getTime();
    if (ed === null)
      endDate = this.refs.endDate.getValue();
    if (et === null)
      endTime = this.refs.endDate.getTime();

    startDate.setHours(startTime, 0, 0, 0);
    if (endTime === 24) {
      endDate = dateAdd(endDate, 1, 'days');
      endDate.setHours(0, 0, 0, 0);
    } else {
      endDate.setHours(endTime, 0, 0, 0);
    }
    if (startDate.getTime() >= endDate.getTime()) {
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
    let startTime, endTime;
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
      let startTime, endTime;
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
    var dateStyle = {
      width: '112px',
      height: '32px',
      fontSize: '14px',
      fontFamily: 'Microsoft YaHei'
    };
    var startDateProps = {
      dateFormatStr: 'YYYY/MM/DD',
      defaultValue: this.state.startDate,
      defaultTime: this.state.startTime,
      showTime: this.props.showTime,
      timeType: 0,
      style: dateStyle,
      onChange: function(e, v) {
        me._onChangeDateTime(v, null, null, null);
      },
      onSelectedTime: function(e, v) {
        me._onChangeDateTime(null, v, null, null);
      }
    };
    var endDateProps = {
      dateFormatStr: 'YYYY/MM/DD',
      defaultValue: this.state.endDate,
      defaultTime: this.state.endTime,
      showTime: this.props.showTime,
      timeType: 1,
      style: dateStyle,
      onChange: function(e, v) {
        me._onChangeDateTime(null, null, v, null);
      },
      onSelectedTime: function(e, v) {
        me._onChangeDateTime(null, null, null, v);
      }
    };
    return <div style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fbfbfb'
      }}>
      <div className={'jazz-full-border-datepicker-container'}>
        <ViewableDatePicker ref="startDate" {...startDateProps}/>
      </div>
      <span> {'到'} </span>
      <div className={'jazz-full-border-datepicker-container'}>
        <ViewableDatePicker ref="endDate" {...endDateProps}/>
      </div>
    </div>;

  }
});
module.exports = DateTimeSelector;
