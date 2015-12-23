import React from "react";
import { Route, DefaultRoute, RouteHandler, Link, Navigation, State } from 'react-router';
import { SvgIcon, IconButton, DropDownMenu, TextField, FlatButton, FloatingActionButton, RadioButtonGroup, RadioButton, DatePicker, RaisedButton, CircularProgress } from 'material-ui';
import assign from "object-assign";
import classNames from 'classnames';
import YearPicker from '../../controls/YearPicker.jsx';
import DaytimeSelector from '../../controls/DaytimeSelector.jsx';
import NodeButtonBar from './NodeButtonBar.jsx';
import CommonFuns from '../../util/Util.jsx';
import TBSettingAction from '../../actions/TBSettingAction.jsx';
import TBSettingStore from '../../stores/TBSettingStore.jsx';
import TagStore from '../../stores/TagStore.jsx';
import ViewableDatePicker from '../../controls/ViewableDatePicker.jsx';

var formatDate = function(date) {
  var m = (date.getMonth() + 1),
    d = date.getDate();
  return (m > 9 ? '' + m : '0' + m) + '-' + (d > 9 ? '' + d : '0' + d);
};

var extractNumber = function(str) {
  var value = str.replace(/[^\d\.]/g, '');
  var dotIndex = value.indexOf('.');
  if (dotIndex != -1) {
    if (dotIndex == 0)
      value = '0' + value;
    dotIndex = value.indexOf('.');
    value = value.split('.').join('');
    value = [value.slice(0, dotIndex), '.', value.slice(dotIndex)].join('');
  }
  return value;
};

var fromFormEndDate = function(date) {
  var tmpDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  tmpDate.setDate(tmpDate.getDate() + 1);
  return tmpDate;
};

var toFormEndDate = function(date) {
  var tmpDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  tmpDate.setDate(tmpDate.getDate() - 1);
  return tmpDate;
};

var jsonToFormDate = function(dtJson) {
  return new Date(CommonFuns.DataConverter.JsonToDateTime(dtJson, false));
};

var jsonToFormTime = function(dtJson) {
  var dt = new Date(CommonFuns.DataConverter.JsonToDateTime(dtJson, false));
  return dt.getHours() * 60 + dt.getMinutes();
};

var mergeDateTime = function(date, time) {
  var d = new Date(date);
  if (time)
    d = new Date(d.getFullYear(), d.getMonth(), d.getDate(), Math.floor(time / 60), time % 60);
  else
    d = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  return d;
}

var datetimeTojson = function(date, time) {
  var d = mergeDateTime(date, time);
  return CommonFuns.DataConverter.DatetimeToJson(d);
};
var SpecialItem = React.createClass({
  propTypes: {
    tag: React.PropTypes.object,
    year: React.PropTypes.number,
    index: React.PropTypes.number,
    settingId: React.PropTypes.number,
    start: React.PropTypes.string,
    end: React.PropTypes.string,
    value: React.PropTypes.number,
    isViewStatus: React.PropTypes.bool,
    onRemove: React.PropTypes.func,
    onDateTimeChange: React.PropTypes.func,
  },

  getInitialState: function() {
    return {
      valueError: '',
      tbSettingError: '',
      specialError: '',
      start: this.props.start,
      end: this.props.end,
      value: this.props.value,
    };
  },

  componentWillReceiveProps: function(nextProps) {
    if (nextProps) {
      if (nextProps.start && nextProps.start != this.state.start) {
        this.refs.startDateField.setValue(jsonToFormDate(nextProps.start));
      }
      ;
      if (nextProps.end && nextProps.end != this.props.end) {
        this.refs.endDateField.setValue(toFormEndDate(jsonToFormDate(nextProps.end)));
      }
      ;
      if (nextProps.value != this.props.value) {
        this.refs.valueField.setValue(nextProps.value);
      }
      this.setState({
        start: nextProps.start,
        end: nextProps.end,
        value: nextProps.value,
      });
    }
  },

  validate: function(tbsItem, specials) {
    this.setState({
      valueError: '',
      tbSettingError: '',
    });
    if (!specials)
      specials = tbsItem.SpecialDates;
    var val = specials[this.props.index];
    return (
      this.validateTBSettingItem(tbsItem, specials) &&
      this.validateSpecialItem(specials) &&
      this.validateValue(val));
  },

  validateValue: function(special) {
    var val,
      valid = true;
    if (special)
      val = special.Value; else
      val = this.refs.valueField.getValue();
    if (special.StartTime >= special.EndTime) {
      valid = false;
      this.setState({
        specialError: valid ? '' : I18N.Baseline.Error.SpecialOtherError
      });
    }
    return valid && this._validateValue(val) != '';
  },

  validateTBSettingItem: function(tbsItem, specials) {
    if (!specials)
      specials = tbsItem.SpecialDates;
    var tbSetting = tbsItem.TbSetting,
      val = specials[this.props.index],
      valid = jsonToFormDate(tbSetting.EndTime) >= jsonToFormDate(val.EndTime) && jsonToFormDate(tbSetting.StartTime) <= jsonToFormDate(val.EndTime);
    this.setState({
      tbSettingError: valid ? '' : I18N.Baseline.Error.TbSettingError
    });
    return valid;
  },

  validateSpecialItem: function(specials) {
    var val = specials[this.props.index],
      len = specials.length,
      valid = true;
    for (var i = 0; i < len; i++) {
      if (i != this.props.index) {
        valid = valid && (jsonToFormDate(specials[i].EndTime) <= jsonToFormDate(val.StartTime) || jsonToFormDate(specials[i].StartTime) >= jsonToFormDate(val.EndTime));
        if (!valid) break;
      }
    }
    this.setState({
      specialError: valid ? '' : I18N.Baseline.Error.SpecialError
    });
    return valid;
  },

  getValue: function() {
    return {
      TBSettingId: this.props.settingId,
      StartTime: this._getStartTime(),
      EndTime: this._getEndTime(),
      Value: this.refs.valueField.getValue()
    };
  },

  _getStartTime: function() {
    var startDate = this.refs.startDateField.getValue(),
      startTime = this.refs.startTimeField.getValue();
    return datetimeTojson(startDate, startTime);
  },

  _getEndTime: function() {
    var endDate = this.refs.endDateField.getValue(),
      endTime = this.refs.endTimeField.getValue();
    return datetimeTojson(endDate, endTime);
  },

  _validateValue: function(val) {
    var value = extractNumber(val);
    if (val != value) this.refs.valueField.setValue(value);
    this.setState({
      valueError: (value == '' ? I18N.Baseline.Error.TbnameError : '')
    });
    return value;
  },

  _onValueChange: function(e) {
    this._validateValue(e.target.value);
  },

  _onRemove: function() {
    var me = this;
    if (this.props.onRemove) {
      this.props.onRemove(me, this.props.index);
    }
  },

  _slideDateTime: function(sd, st, ed, et) {
    var startDate = sd,
      startTime = st,
      endDate = ed,
      endTime = et;
    if (!startDate)
      startDate = this.refs.startDateField.getValue();
    if (!startTime)
      startTime = this.refs.startTimeField.getValue();
    if (!endDate)
      endDate = this.refs.endDateField.getValue();
    if (!endTime)
      endTime = this.refs.endTimeField.getValue();
    var computedStartTime = mergeDateTime(startDate, startTime),
      computedEndTime = mergeDateTime(endDate, endTime);

    if (computedStartTime >= computedEndTime) {
      if (sd || st) {
        if (startTime == 1440) {
          endDate.setDate(endDate.getValue() + 1);
          this.refs.endDateField.setValue(endDate);
          this.refs.endTimeField.setValue(30);
        } else {
          this.refs.endTimeField.setValue(startTime + 30);
        }
        computedEndTime.setMinutes(computedEndTime.getMinutes() + 30);
      } else if (ed || dt) {
        if (endTime == 0) {
          startDate.setDate(startDate.getValue() - 1);
          this.refs.startDateField.setValue(startDate);
          this.refs.startTimeField.setValue(1410);
        } else {
          this.refs.startTimeField.setValue(endTime - 30);
        }
        computedStartTime.setMinutes(computedStartTime.getMinutes() - 30);
      }
    }
    var jstart = CommonFuns.DataConverter.DatetimeToJson(computedStartTime),
      jend = CommonFuns.DataConverter.DatetimeToJson(computedEndTime),
      val = this.refs.valueField.getValue();
    var tmpVal = {
      start: jstart,
      end: jend,
      value: val
    };
    this.setState(tmpVal);

    if (this.props.onDateTimeChange) {
      this.props.onDateTimeChange({
        StartTime: jstart,
        EndTime: jend,
        Value: val
      }, this.props.index);
    }
  },

  render: function() {
    if (this.props.isViewStatus) {
      var me = this,
        st = jsonToFormTime(this.state.start),
        et = jsonToFormTime(this.state.end),
        startDate = jsonToFormDate(me.state.start),
        endDate = jsonToFormDate(me.state.end);

      if (et === 0) {
        et = 1440;
        endDate = toFormEndDate(endDate);
      }
      var startDateStr = formatDate(startDate),
        endDateStr = formatDate(endDate),
        startTimeStr = CommonFuns.numberToTime(st),
        endTimeStr = CommonFuns.numberToTime(et),
        val = this.state.value;

      var style = {
        padding: '2px 10px',
        border: '1px solid #efefef',
        marginRight: '10px',
        color: '#b3b3b3'
      };

      return (<div style={{
          marginTop: '10px'
        }}>
          <span style={style}>{startDateStr}</span>
          <span style={style}>{startTimeStr}</span>
          <span style={{
          marginRight: '10px'
        }} >到</span>
          <span style={style}>{endDateStr}</span>
          <span style={style}>{endTimeStr}</span>
          <div style={{
          display: 'flex',
          flexFlow: 'row',
          marginTop: '10px'
        }}>
            <div style={style}>
              {this.state.value}
            </div>
            <span> {this.props.tag.uom}</span>
          </div>
        </div>
        );
    } else {
      var me = this,
        menuItems = [],
        minutes = 0,
        st = jsonToFormTime(this.state.start),
        et = jsonToFormTime(this.state.end),
        startDate = new Date(me.props.year, 0, 1),
        endDate = new Date(me.props.year, 11, 31),
        dstartDate = me.state.start ? jsonToFormDate(me.state.start) : startDate,
        dendDate = me.state.end ? jsonToFormDate(me.state.end) : endDate;

      if (et == 0) {
        et = 1440;
        dendDate = toFormEndDate(dendDate);
      }

      for (var i = 1;; i++) {
        var hmstr = CommonFuns.numberToTime(minutes);
        menuItems.push({
          payload: i.toString(),
          text: hmstr
        });

        minutes = minutes + 30;
        if (minutes > 1440) break;
      }

      var datapickerStyle = {
          width: '90px',
          height: '32px',
          fontSize: '14px',
          fontFamily: 'Microsoft YaHei',
          color: '#767a7a'
        },
        flatButtonStyle = {
          padding: '0',
          minWidth: '20px',
          width: '30px',
          height: '20px',
          verticalAlign: 'middle',
          lineHeight: '20px',
          marginLeft: '5px',
          marginTop: '7px'
        },
        daytimeStyle = {
          display: "block",
          border: '1px solid #efefef',
          width: '100px',
          fontSize: '14px',
          marginLeft: '10px'
        };

      var startDateProps = {
          dateFormatStr: 'MM-DD',
          defaultValue: dstartDate,
          minDate: startDate,
          maxDate: endDate,
          style: datapickerStyle,
          onChange: function(e, v) {
            me._slideDateTime(v);
          }
        },
        endDateProps = {
          dateFormatStr: 'MM-DD',
          defaultValue: dendDate,
          minDate: startDate,
          maxDate: endDate,
          style: datapickerStyle,
          onChange: function(e, v) {
            me._slideDateTime(null, null, v);
          }
        },
        startTimeProps = {
          from: 0,
          to: 1410,
          step: 30,
          isViewStatus: this.props.isViewStatus,
          style: daytimeStyle,
          minute: st,
          onChange: function(e, v) {
            me._slideDateTime(null, v);
          }
        },
        endTimeProps = {
          from: 30,
          to: 1440,
          step: 30,
          isViewStatus: this.props.isViewStatus,
          style: daytimeStyle,
          minute: et,
          onChange: function(e, v) {
            me._slideDateTime(null, null, null, v);
          }
        };

      return (
        <div>
          <div style={{
          clear: 'both',
          display: 'flex',
          flexFlow: 'row',
          marginTop: '18px'
        }}>
              <div className="jazz-setting-basic-datepicker-container">
            <ViewableDatePicker showTime={false} ref='startDateField' {...startDateProps} />
            </div>
            <DaytimeSelector ref='startTimeField' {...startTimeProps} />
            <div className='jazz-setting-basic-datespan'>{I18N.EM.To}</div>
              <div className="jazz-setting-basic-datepicker-container">
            <ViewableDatePicker showTime={false} ref='endDateField' {...endDateProps} />
            </div>
            <DaytimeSelector ref='endTimeField' {...endTimeProps} />
            <FlatButton style={flatButtonStyle} labelStyle={{
          padding: '0'
        }} className='icon-delete' label="－"  ref="remove"  onClick={this._onRemove} /><br/>
          </div>
          <div style={{
          color: 'red',
          fontSize: 12
        }}>{this.state.tbSettingError}</div>
          <div style={{
          color: 'red',
          fontSize: 12
        }}>{this.state.specialError}</div>
          <div>
            <div style={{
          display: 'block',
          float: 'left',
          verticalAlign: 'top',
          width: 270
        }}>
              <TextField ref='valueField' defaultValue={this.state.value}
        errorText={this.state.valueError} onChange={this._onValueChange} />
            </div>
            <div style={{
          display: 'block',
          float: 'left',
          verticalAlign: 'top',
          width: 100,
          paddingTop: '15px'
        }}>{this.props.tag.uom}</div>
          </div>
        </div>
        );
    }
  }
});


module.exports = SpecialItem;
