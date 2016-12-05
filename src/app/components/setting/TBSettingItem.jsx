import React from "react";
import { Route, DefaultRoute, RouteHandler, Link, Navigation, State } from 'react-router';
import { SvgIcon, IconButton, DropDownMenu, TextField, FlatButton, FloatingActionButton, RadioButtonGroup, RadioButton, DatePicker, RaisedButton, CircularProgress } from 'material-ui';
import assign from "object-assign";
import moment from 'moment';
import classNames from 'classnames';
import YearPicker from '../../controls/YearPicker.jsx';
import DaytimeSelector from '../../controls/DaytimeSelector.jsx';
import NodeButtonBar from './NodeButtonBar.jsx';
import CommonFuns from '../../util/Util.jsx';
import TBSettingAction from '../../actions/TBSettingAction.jsx';
import TBSettingStore from '../../stores/TBSettingStore.jsx';
import TagStore from '../../stores/TagStore.jsx';
import ViewableDatePicker from '../../controls/ViewableDatePicker.jsx';


import NormalSetting from './NormalSetting.jsx';
import SpecialSetting from './SpecialSetting.jsx';
import CalcSetting from './CalcSetting.jsx';


var formatDate = function(date) {
  var m = (date.getMonth() + 1),
    d = date.getDate();
  return (m > 9 ? '' + m : '0' + m) + '-' + (d > 9 ? '' + d : '0' + d);
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
var TBSettingItem = React.createClass({
  propTypes: {
    index: React.PropTypes.number,
    tag: React.PropTypes.object,
    year: React.PropTypes.number,
    start: React.PropTypes.string,
    end: React.PropTypes.string,

    normals: React.PropTypes.array,
    specials: React.PropTypes.array,
    avgs: React.PropTypes.array,

    isViewStatus: React.PropTypes.bool,
    onRemove: React.PropTypes.func,
    onSettingItemDateChange: React.PropTypes.func,

    dateRange: React.PropTypes.object,
  },

  getDefaultProps: function() {
    return {
      isViewStatus: false,
      normals: [],
      avgs: [],
      specials: [],
      error: '',
    };
  },

  getInitialState: function() {
    var s = {
      start: this.props.start,
      end: this.props.end,
      avgs: this.props.avgs,
      radio: "NormalRadio",
      normals: this.props.normals,
      specials: this.props.specials,
    };
    if (this.props.avgs && this.props.avgs.length > 0) {
      s.radio = "CalcRadio";
    }
    return s;
  },

  componentWillReceiveProps: function(nextProps) {
    if (nextProps) {
      var s = {};
      s.avgs = nextProps.avgs;
      s.normals = nextProps.normals;
      s.specials = nextProps.specials;
      if (nextProps.avgs && nextProps.avgs.length > 0) {
        s.radio = "CalcRadio";
      } else if (nextProps.normals && nextProps.normals.length > 0) {
        s.radio = "NormalRadio";
      } else {
        s.radio = "NormalRadio";
      }
      s.start = nextProps.start;
      s.end = nextProps.end;
      this.setState(s);
    }
  },

  _onRemove: function() {
    var me = this;
    if (this.props.onRemove) {
      this.props.onRemove(me, this.props.index);
    }
  },

  _onNormalCheck: function(e, newSel) {
    var specialVal = this.refs.SpecialSettingCtrl.getValue();
    this.setState({
      radio: "NormalRadio",
      specials: specialVal
    });
  //this.refs.NormalSettingCtrl.
  },

  _onCalcCheck: function(e, newSel) {
    var specialVal = this.refs.SpecialSettingCtrl.getValue();
    this.setState({
      radio: "CalcRadio",
      specials: specialVal
    });
  //this._calcValues();
  },

  _calcValues: function() {
    var dateRange = this.props.dateRange;
    var me = this;
    var tr = {
      StartTime: CommonFuns.DataConverter.DatetimeToJson(dateRange.start),
      EndTime: CommonFuns.DataConverter.DatetimeToJson(dateRange.end)
    };
    TBSettingAction.calcData(tr, me.props.tag.tagId, function(data) {
      me.setState({
        avgs: data
      });
    });
  },

  validate: function(tbsItems) {
    this.setState({
      error: ''
    });
    var curTbsItem = tbsItems[this.props.index];
    if (this.refs.NormalRadio.isChecked()) {
      return (
        this.validateTbSettingItem(tbsItems) &&
        this.validateSpecialItems(curTbsItem)
      );
    } else {
      return (
        this.validateTbSettingItem(tbsItems) &&
        this.validateSpecialItems(curTbsItem) &&
        this.validateValue()
      );
    }

  },

  validateTbSettingItem: function(tbsItems) {
    var curItem = tbsItems[this.props.index],
      curSetting = curItem.TbSetting,
      error = "";

    for (var i = 0; i < tbsItems.length; i++) {
      var tmpSetting = tbsItems[i].TbSetting;
      if (i != this.props.index) {
        var valid = (tmpSetting.EndTime <= curSetting.StartTime ||
          tmpSetting.StartTime >= curSetting.EndTime);
        if (!valid) {
          error = I18N.Baseline.TBSettingItem.Error;
          break;
        }
      }
    }
    this.setState({
      error: error
    });
    return error == '';
  },

  validateSpecialItems: function(tbsItem) {
    if (!tbsItem)
      tbsItem = this.getValue();
    return this.refs.SpecialSettingCtrl.validate(tbsItem);
  },

  validateValue: function() {
    var calcCtrl = this.refs.CalcSettingCtrl,
      valid = true;
    if (calcCtrl) {
      valid = valid & calcCtrl.validate();
    }
    return valid;
  },

  getValue: function() {
    var startDate = new Date(CommonFuns.DataConverter.JsonToDateTime(this.state.start)),
      endDate = fromFormEndDate(new Date(CommonFuns.DataConverter.JsonToDateTime(this.state.end)));
    startDate = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate(), 0, 0, 0);
    endDate = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate(), 0, 0, 0);
    var rtn = {
      TbSetting: {
        Year: this.props.year,
        TBId: this.props.tbId,
        StartTime: CommonFuns.DataConverter.DatetimeToJson(startDate),
        EndTime: CommonFuns.DataConverter.DatetimeToJson(endDate)
      },
      SpecialDates: this.refs.SpecialSettingCtrl.getValue()
    };
    if (this.state.radio == "CalcRadio") {
      rtn.TbAvgDtos = this.refs.CalcSettingCtrl.getValue();
    } else {
      rtn.NormalDates = this.refs.NormalSettingCtrl.getValue();
    }
    return rtn;
  },

  render: function() {
    var me = this,
      menuItems = [],
      minutes = 0,
      step = (me.props.step || 30);

    var startDate = new Date(me.props.year, 0, 1),
      dstartDate = startDate,
      endDate = new Date(me.props.year, 11, 31),
      dendDate = endDate;
    if (me.state.start)
      dstartDate = jsonToFormDate(me.state.start);
    if (me.state.end) {
      var tmpDate = jsonToFormDate(me.state.end);
      dendDate = toFormEndDate(tmpDate);
    }

    var normalProps = {
        tag: me.props.tag,
        isViewStatus: me.props.isViewStatus,
        items: me.state.normals
      },
      avgProps = {
        tag: me.props.tag,
        isViewStatus: me.props.isViewStatus,
        items: me.state.avgs,
        start: me.state.start,
        end: me.state.end,
        onCalc: me._calcValues,
        dateRange: me.props.dateRange,
      },
      specialProps = {
        tag: me.props.tag,
        year: me.props.year,
        isViewStatus: me.props.isViewStatus,
        items: me.state.specials
      },
      clearStyle = {
        clear: 'both',
        fontSize: '14px'
      },
      labelStyle = {
        color: '#767a7a'
      },
      datapickerStyle = {
        width: '90px',
        height: '32px',
        marginLeft: '10px',
        fontSize: '14px',
        color: '#767a7a'
      },
      datePickerAreaStyle = {
        display: 'flex',
        flexFlow: 'row',
        marginTop: '18px',
        alignItems: 'center'
      },
      flatButtonStyle = {
        padding: '0',
        minWidth: '20px',
        width: '30px',
        height: '20px',
        verticalAlign: 'middle',
        lineHeight: '20px',
        marginLeft: '5px'
      };

    if (this.props.isViewStatus) {
      var middleCtrl;
      // Middle
      if (this.state.avgs && this.state.avgs.length) {
        avgProps.isDisplay = true;
        middleCtrl = <div style={clearStyle}>
          <RadioButton name='CalcRadio' key='CalcRadio' ref='CalcRadio' value="CalcRadio"
        label={I18N.Baseline.TBSettingItem.CalcRadio} disabled="true" checked="true"  />
          <CalcSetting ref="CalcSettingCtrl" {...avgProps} />
        </div>
      } else {
        normalProps.isDisplay = true;
        middleCtrl = <div className="jazz-setting-basic-clear">
          <RadioButton name='NormalRadio' key='NormalRadio' ref='NormalRadio' value="NormalRadio"
        label={I18N.Baseline.TBSettingItem.NormalRadio} disabled="true" checked="true" />
          <NormalSetting ref="NormalSettingCtrl" {...normalProps} />
        </div>
      }
      var startDateStr = formatDate(dstartDate); //dstartDate.getFullYear() + '-' +(dstartDate.getMonth() + 1) + '-' + dstartDate.getDate();
      var endDateStr = formatDate(dendDate); //dendDate.getFullYear() + '-' +(dendDate.getMonth() + 1) + '-' + dendDate.getDate();

      return (<div>
          <div style={clearStyle}>
            <div style={datePickerAreaStyle}>
              <span style={{
          fontSize: '14px',
          color: '#b3b3b3',
          border: '1px solid #efefef',
          padding: '10px'
        }}>{startDateStr}</span>
              <span style={{
          margin: '0 10px'
        }}>{I18N.EM.To}</span>
              <span style={{
          fontSize: '14px',
          color: '#b3b3b3',
          border: '1px solid #efefef',
          padding: '10px'
        }}>{endDateStr}</span>
            </div>
            {middleCtrl}
          </div>
          <div ref="SpecialSettingContainer" style={clearStyle}>
            <SpecialSetting ref="SpecialSettingCtrl" {...specialProps} />
          </div>
        </div>
        );
    }

    var datapickerStyle = {
        width: '90px',
        height: '32px',
        fontSize: '14px',
        fontFamily: 'Microsoft YaHei',
        color: '#767a7a'
      },
      datePickerAreaStyle = {
        display: 'flex',
        flexFlow: 'row',
        marginTop: '18px',
        alignItems: 'center'
      },
      flatButtonStyle = {
        padding: '0',
        minWidth: '20px',
        width: '30px',
        height: '20px',
        verticalAlign: 'middle',
        lineHeight: '20px',
        marginLeft: '5px'
      };

    var startProps = {
      value: moment(dstartDate).format("MM-DD"),
      dateFormatStr: 'MM-DD',
      minDate: startDate,
      maxDate: endDate,
      style: datapickerStyle,
      //className: 'jazz-setting-basic-date',
      onChange: function(v) {
        v=moment(v)._d;
        var endDate =new Date(CommonFuns.DataConverter.JsonToDateTime(me.state.end));
        if (endDate && endDate < v) {
          endDate = v;
        }
        var jstart = CommonFuns.DataConverter.DatetimeToJson(v),
          jend = CommonFuns.DataConverter.DatetimeToJson(fromFormEndDate(endDate)),
          myVal = me.getValue();

        myVal.TbSetting.StartTime = jend;
        myVal.TbSetting.EndTime = jend;

        me.setState({
          start: jstart,
          end: jend,
          normals: myVal.NormalDates,
          avgs: myVal.TbAvgDtos,
          specials: myVal.SpecialDates,
        });

        if (me.props.onSettingItemDateChange) {
          me.props.onSettingItemDateChange(myVal, me.props.index);
        }
        me.refs.SpecialSettingCtrl.validate(myVal);
      }
    };
    var endProps = {
      dateFormatStr: 'MM-DD',
      value: moment(dendDate).format("MM-DD"),
      minDate: startDate,
      maxDate: endDate,
      style: datapickerStyle,
      //className: 'jazz-setting-basic-date',
      onChange: function(v) {
        v=moment(v)._d;
        var startDate = new Date(CommonFuns.DataConverter.JsonToDateTime(me.state.start));
        if (startDate && startDate > v) {
          //me.refs.startFeild.setValue(v);
          startDate = v;
        }
        var jstart = CommonFuns.DataConverter.DatetimeToJson(startDate),
          jend = CommonFuns.DataConverter.DatetimeToJson(fromFormEndDate(v)),
          myVal = me.getValue();

        myVal.TbSetting.StartTime = jstart;
        myVal.TbSetting.EndTime = jend;

        me.setState({
          start: jstart,
          end: jend,
          normals: myVal.NormalDates,
          avgs: myVal.TbAvgDtos,
          specials: myVal.SpecialDates,
        });

        if (me.props.onSettingItemDateChange) {
          me.props.onSettingItemDateChange(myVal, me.props.index);
        }
        me.refs.SpecialSettingCtrl.validate(myVal);
      }
    };

    for (var i = 1;; i++) {
      var hmstr = CommonFuns.numberToTime(minutes);
      menuItems.push({
        payload: i.toString(),
        text: hmstr
      });

      minutes = minutes + step;
      if (minutes > 1440) break;
    }

    return (<div>
        <div style={clearStyle}>
          <div style={datePickerAreaStyle}>
            <div className="jazz-setting-basic-datepicker-container">
              <ViewableDatePicker  datePickerClassName="jazz-energy-date-picker" showTime={false} ref='startFeild' {...startProps} />
            </div>
            <div style={{
        marginLeft: '10px'
      }}>{I18N.EM.To}</div>
            <div className="jazz-setting-basic-datepicker-container">
              <ViewableDatePicker  datePickerClassName="jazz-energy-date-picker" showTime={false} ref='endFeild' {...endProps} />
            </div>
            <FlatButton style={flatButtonStyle} labelStyle={{
        padding: '0'
      }} className='icon-delete' label="－"  ref="remove"  onClick={this._onRemove} />
          </div>
          <div style={{
        color: 'red',
        fontSize: 12
      }}>{this.state.error}</div>
          <div className="jazz-setting-basic-clear">
            <RadioButton name='NormalRadio' ref='NormalRadio' value="NormalRadio" style={{
        zIndex: 0
      }}
      label={I18N.Baseline.TBSettingItem.NormalRadio} onCheck={this._onNormalCheck} checked={this.state.radio == 'NormalRadio'} />
            <NormalSetting ref="NormalSettingCtrl" {...normalProps} isDisplay={this.state.radio == "NormalRadio"} />

            <RadioButton name='CalcRadio' ref='CalcRadio' value="CalcRadio" style={{
        zIndex: 0
      }}
      label={I18N.Baseline.TBSettingItem.CalcRadio} onCheck={this._onCalcCheck} checked={this.state.radio == 'CalcRadio'}  />
            <CalcSetting ref="CalcSettingCtrl" {...avgProps} isDisplay={this.state.radio == "CalcRadio"}  />
          </div>
        </div>
        <div ref="SpecialSettingContainer" style={clearStyle}>
          <SpecialSetting ref="SpecialSettingCtrl" {...specialProps} />
        </div>
      </div>
      );
  }
});


module.exports = TBSettingItem;
