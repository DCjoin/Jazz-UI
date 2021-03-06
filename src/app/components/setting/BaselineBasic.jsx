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
import TBSettingItems from './TBSettingItems.jsx';
import CalDetail from './CalDetail.jsx';
import CommodityStore from '../../stores/CommodityStore.jsx';
var createReactClass = require('create-react-class');
import PropTypes from 'prop-types';
var BaselineBasic = createReactClass({
  //mixins: [Navigation, State],

  propTypes: {
    tag: PropTypes.object,
    dateRange: PropTypes.object,
    tbId: PropTypes.number,

    name: PropTypes.string,
    year: PropTypes.number,
    items: PropTypes.array,

    isViewStatus: PropTypes.bool,
    onNameChanged: PropTypes.func,
    onDataLoaded: PropTypes.func,
    onRequestShowMask: PropTypes.func,
    onRequestHideMask: PropTypes.func,
  },

  getDefaultProps: function() {
    return {
      items: [],
      isViewStatus: true,
    };
  },

  getInitialState: function() {
    return {
      items: this.props.items || [],
      name: this.props.name,
      isViewStatus: this.props.isViewStatus,
      calButton: I18N.Baseline.Button.DisplayCal,
      showCalDetail: false,
      year: TBSettingStore.getYear(),
      validationError: '',
      hasCal: null,
      tbnameError: '',
      isCalDetailLoading: false
    };
  },

  componentDidMount: function() {
    var hierId = TagStore.getCurrentHierarchyId();
    TBSettingStore.addCalDetailListener(this._onChange);
    TBSettingStore.addCalDetailLoadingListener(this._onCalDetailLoadingChange);
    TBSettingAction.calDetailData(hierId);
    this._fetchServerData(TBSettingStore.getYear());
  },

  componentWillReceiveProps: function(nextProps) {
    this.setState({
      year: TBSettingStore.getYear()
    });
    if (nextProps && nextProps.tag && nextProps.tag.tagId) {
      this._fetchServerData(TBSettingStore.getYear());
    }
    if (nextProps && nextProps.isViewStatus != this.props.isViewStatus) {
      this.setState({
        isViewStatus: nextProps.isViewStatus
      });
    }
    var hierId = TagStore.getCurrentHierarchyId();
    TBSettingAction.calDetailData(hierId);
  },

  fetchServerData(force) {
    this._fetchServerData(TBSettingStore.getYear(), force);
  },

  tryGetValue: function() {
    var items = this.refs.TBSettingItems.tryGetValue();
    items[1] = this.getValue(items[1]);
    return items;
  },

  getValue: function(items) {
    if (!items)
      items = this.refs.TBSettingItems.getValue();
    return {
      TBId: this.props.tbId,
      Year: TBSettingStore.getYear(),
      TBSettings: items
    };
  },

  _onTBNameChanged: function() {
    var tbname = this.refs.TBName.getValue();
    if (tbname != this.state.name) {
      var pattern = /^[\u4e00-\u9fa50-9a-zA-Z_\(\)\-\[\]\{\}\#\&\,\;\.\~\+\%]+( +[\u4e00-\u9fa50-9a-zA-Z_\(\)\-\[\]\{\}\#\&\,\;\.\~\+\%]+)*$/;
      if (tbname === '') {
        this.setState({
          tbnameError: I18N.Baseline.Error.TbnameError
        });
      } else if (!pattern.test(tbname)) {
        this.setState({
          tbnameError: I18N.Baseline.Error.TbnameValidError
        });
      } else {
        if (this.props.onNameChanged) {
          this.props.onNameChanged(tbname);
        }
        this.setState({
          tbnameError: ''
        });
      }
    }
  },

  _onYearChanged: function(yearstr) {
    var year = parseInt(yearstr);
    this.setState({
      year: year
    });
    this._fetchServerData(year);
    if (year != TBSettingStore.getYear()) {
      TBSettingAction.setYear(year);

      var data = TBSettingStore.getCalDetailData();
      if (data) {
        this.setState({
          hasCal: true,
          calButton: I18N.Baseline.Button.DisplayCal,
          showCalDetail: false,
        });
      } else {
        this.setState({
          hasCal: false,
          showCalDetail: false,
        });
      }
    }
  },

  _bindData: function(tbSetting) {
    this.setState({
      items: tbSetting.TBSettings
    });
  },

  _fetchServerData: function(year, force) {
    if (this.props.shouldLoad || force) {
      var me = this;
      TBSettingAction.loadData(me.props.tbId, year, function(data) {
        me._bindData(data);
        if (me.props.onDataLoaded) {
          me.props.onDataLoaded(me);
        }
      });
    }
  },

  _saveDataToServer: function(val, callback, fail) {
    var me = this;
    TBSettingAction.saveData(val, callback, fail);
  },

  _handleEdit: function() {
    this.setState({
      isViewStatus: false,
    });
  },

  _handleSave: function() {
    var me = this;
    var valArr = this.tryGetValue();
    if (valArr) {
      var val = valArr[1];
      if (valArr[0]) {
        if (this.props.onRequestShowMask) {
          this.props.onRequestShowMask(this);
        }
        this._bindData(val);
        this._saveDataToServer(val,
          function(setting) {
            me._bindData(setting);
            if (me.props.onRequestHideMask) {
              me.props.onRequestHideMask(me);
            }
            me.setState({
              isViewStatus: true
            });
            TagStore.emitSettingData();
          },
          function(err, res) {
            if (me.props.onRequestHideMask) {
              me.props.onRequestHideMask(me);
            }
            me.setState({
              isViewStatus: true
            });
          }
        );
      } else {
        this._bindData(val);
      }
    }
  },

  _handleCancel: function() {
    this.setState({
      isViewStatus: true,
    });
    this._fetchServerData(TBSettingStore.getYear());
  },
  showCalDetail: function() {
    this.setState({
      showCalDetail: !this.state.showCalDetail,
      calButton: ((this.state.calButton == I18N.Baseline.Button.DisplayCal) ? I18N.Baseline.Button.HiddenCal : I18N.Baseline.Button.DisplayCal)
    });
  },
  _onChange: function() {
    var data = TBSettingStore.getCalDetailData();
    if (data) {
      this.setState({
        hasCal: true,
        isCalDetailLoading: TBSettingStore.getCalDetailLoading()
      });
    } else {
      this.setState({
        hasCal: false,
        isCalDetailLoading: TBSettingStore.getCalDetailLoading()
      });
    }
  },
  _onCalDetailLoadingChange: function() {
    this.setState({
      isCalDetailLoading: TBSettingStore.getCalDetailLoading()
    });
  },
  componentWillUnmount: function() {
    TBSettingStore.removeCalDetailListener(this._onChange);
    TBSettingStore.removeCalDetailLoadingListener(this._onCalDetailLoadingChange);
  },
  render: function() {
    if (!this.props.shouldLoad) {
      return null;
    }

    var itemProps = {
      tag: this.props.tag,
      items: this.state.items,
      year: TBSettingStore.getYear(),
      isViewStatus: this.state.isViewStatus,
      dateRange: this.props.dateRange,
    };
    var tbNameProps = {
      defaultValue: this.props.name,
      onBlur: this._onTBNameChanged,
      disabled: !this.state.isViewStatus,
      errorText: this.state.tbnameError,
      style: {
        fontSize: '14px',
        marginTop: '8px',
        color: '#767a7a'
      }
    };

    var curYear = (new Date()).getFullYear();
    var yearProps = {
      noUnderline: true,
      isViewStatus: !this.state.isViewStatus,
      ref: "YearField",
      selectedIndex: ((this.state.year || curYear) - curYear + 10),
      onYearPickerSelected: this._onYearChanged,
      style: {
        margin: '0px 10px',
        width: '100px'
      //zIndex: 2,
      },
      labelStyle:{
        fontSize:'16px',lineHeight:'32px',paddingRight:'0',left:'24px'
      }
      //className: "yearpicker",

    };
    var calDetailButton, showCalDetail, editButton;
    if (!(this.state.hasCal === null)) {
      calDetailButton = ((!!this.state.hasCal) ? <div className="jazz-setting-basic-calbutton" onClick={this.showCalDetail}>{this.state.calButton}</div>
        : <div>{I18N.Baseline.Error.Cal}</div>);

      if (this.state.hasCal == false) {
        editButton = (
          <button type="submit" ref="editButton" disabled="disabled" hidden={!this.state.isViewStatus} className={classNames({
            "jazz-setting-basic-editbutton": true,
            "disabled": !this.state.hasCal
          })} onClick={this._handleEdit}> {I18N.Baseline.Button.Edit} </button>
        )
      } else {
        editButton = (
          <button type="submit" ref="editButton" hidden={!this.state.isViewStatus} className={classNames({
            "jazz-setting-basic-editbutton": true,
            "disabled": !this.state.hasCal
          })} onClick={this._handleEdit}> {I18N.Baseline.Button.Edit} </button>
        )
      }

    }
    ;

    if (this.state.showCalDetail) {
      var data = TBSettingStore.getCalDetailData(),
        calDetailprops = {};
      if (data.Calendar) {
        calDetailprops.calendar = data.Calendar;
        calDetailprops.calendarName = data.Calendar.Name;
      }
      ;
      if (data.WorkTimeCalendar) {
        calDetailprops.workTimeCalendar = data.WorkTimeCalendar;
        calDetailprops.workTimeCalendarName = data.WorkTimeCalendar.Name;
      }
      ;
      var showCalDetail = <CalDetail  {...calDetailprops}/>
    }
    ;

    var spanStyle = {
      padding: '2px 10px',
      border: '1px solid #efefef'
    };

    var yearPicker = null;
    if (this.state.isViewStatus) {
      yearPicker = <div className='jazz-setting-basic-year'><YearPicker {...yearProps} /></div>;
    } else {
      yearPicker = <span style={spanStyle}>{this.state.year}</span>;
    }
    if (this.state.isCalDetailLoading) {
      return (
        <div style={{
          flex: 1,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: '160px'
        }}>
          <CircularProgress  mode="indeterminate" size={80} />
        </div>
        );
    } else {
      return (
        <div className='jazz-setting-basic-container'>
        <div className='jazz-setting-basic-content'>
          <div>
            <div><TextField ref="TBName" {...tbNameProps} /></div>
            <div className="jazz-setting-basic-firstline"><span>{I18N.Baseline.BaselineBasic.Firstline}</span>{yearPicker}
            <span>{calDetailButton}</span>
            </div>

            <div ref="TBSettingContainer">
              <TBSettingItems ref="TBSettingItems" {...itemProps} />
            </div>
          </div>
          {showCalDetail}

        </div>
        <div>{this.state.validationError}</div>
        <div>
        {editButton}
          <span>
            <button type="submit" hidden={this.state.isViewStatus} className="jazz-setting-basic-editbutton" onClick={this._handleSave}> {I18N.Baseline.Button.Save} </button>
            <button type="submit" hidden={this.state.isViewStatus} className="jazz-setting-basic-editbutton" onClick={this._handleCancel}> {I18N.Baseline.Button.Cancel} </button>
          </span>
        </div>
       </div>);
    }

  }
});

module.exports = BaselineBasic;
