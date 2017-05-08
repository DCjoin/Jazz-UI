'use strict';

import React from "react";
import moment from "moment";
import { formStatus } from '../../../constants/FormStatus.jsx';
import { CircularProgress } from 'material-ui';
import Immutable from 'immutable';
import { Map, List } from 'immutable';
import HierarchyAction from '../../../actions/hierarchySetting/HierarchyAction.jsx';
import HierarchyStore from '../../../stores/hierarchySetting/HierarchyStore.jsx';
import ViewableNumberField from '../../../controls/ViewableNumberField.jsx';
import FlatButton from '../../../controls/FlatButton.jsx';
import YearMonthItem from '../../../controls/YearMonthItem.jsx';
import CommonFuns from '../../../util/Util.jsx';
import Regex from '../../../constants/Regex.jsx';

var d2j = CommonFuns.DataConverter.DatetimeToJson;
let PropertyItem = React.createClass({
  propTypes: {
    code: React.PropTypes.string,
    index: React.PropTypes.number,
    merge: React.PropTypes.func,
    data: React.PropTypes.object,
    isViewStatus: React.PropTypes.bool,
    deletePropertyItem: React.PropTypes.func,
    errorText: React.PropTypes.string
  },
  _deletePropertyItem: function() {
    this.props.deletePropertyItem(this.props.code, this.props.index);
  },
  _isValid: function() {
    return this.refs.value.isValid().valid;
  },
  _getTitle: function() {
    var title;
    switch (this.props.code) {
      case 'TotalPopulation':
        title = I18N.Setting.DynamicProperty.PopulationNumber;
        break;
      case 'UsedRoom':
        title = I18N.Setting.DynamicProperty.UsedRoomNumber;
        break;
      case 'UsedBed':
        title = I18N.Setting.DynamicProperty.UsedBedNumber;
        break;
    }
    return title;
  },
  _getUom: function() {
    var uom;
    switch (this.props.code) {
      case 'TotalPopulation':
        uom = I18N.Setting.DynamicProperty.PopulationUnitValue;
        break;
      case 'UsedRoom':
        uom = I18N.Setting.DynamicProperty.RoomUnitValue;
        break;
      case 'UsedBed':
        uom = I18N.Setting.DynamicProperty.BedUnitValue;
        break;
    }
    return uom;
  },
  render: function() {
    var deleteButton = (this.props.isViewStatus ? null : <FlatButton label={I18N.Common.Button.Delete} onClick={this._deletePropertyItem} primary={true}/>);
    var yearMonthProps = {
        ref: 'date',
        key: this.props.code + '_' + this.props.index + 'RandomId' + Math.random(),
        isViewStatus: this.props.isViewStatus,
        date: this.props.data.get('StartDate'),
        errorMsg: this.props.errorText,
        onDateChange: value => {
          this.props.merge({
            value,
            index: this.props.index,
            code: this.props.code,
            path: 'StartDate'
          })
        }
      },
      valueProps = {
        ref: 'value',
        defaultValue: this.props.data.get('Value'),
        isViewStatus: this.props.isViewStatus,
        title: this._getTitle(),
        format: null,
        didChanged: value => {
          this.props.merge({
            value,
            index: this.props.index,
            code: this.props.code,
            path: "Value"
          })
        },
        validate: (value = '') => {
          if ((value !== '' && !Regex.ConsecutiveHoursRule.test(value)) || value === '') {
            return I18N.Setting.VEEMonitorRule.ConsecutiveHoursError
          }
        },
        unit: ' ' + this._getUom()
      };
    return (
      <div className='jazz-hierarchy-property-item'>
        <div className='jazz-hierarchy-property-item-time'>
          <YearMonthItem {...yearMonthProps}/>
          {deleteButton}
        </div>
        <div className='jazz-hierarchy-property-item-value'>
          <ViewableNumberField  {...valueProps} />
        </div>
      </div>
      );
  }
});

var Property = React.createClass({
  propTypes: {
    hierarchyId: React.PropTypes.number,
    formStatus: React.PropTypes.string,
    setEditBtnStatus: React.PropTypes.func
  },
  getInitialState: function() {
    return ({
      property: null,
      isLoading: true
    });
  },
  _getInitError: function(code, property = this.state.property) {
    var errorTextArr = [];
    var properties = property.get('Properties'),
      propertyIndex = properties.findIndex(item => (item.get('Code') === code)),
      propertyItemValue = properties.getIn([propertyIndex, 'Values']);
    for (var i = 0; i < propertyItemValue.size; i++) {
      errorTextArr.push('');
    }
    return errorTextArr;
  },
  _onChange: function() {
    var property = HierarchyStore.getProperty();
    this.setState({
      property: property,
      TotalPopulationErrorTextArr: this._getInitError('TotalPopulation', property),
      UsedRoomErrorTextArr: this._getInitError('UsedRoom', property),
      UsedBedErrorTextArr: this._getInitError('UsedBed', property),
      isLoading: false
    });
  },
  _handlerSave: function() {
    this.setState({
      isLoading: true
    });
    return this.state.property.toJS();
  },
  _isValid: function() {
    var areaIsValid = this._areaIsValid();
    var populationIsvalid = this._dynamicIsValid('TotalPopulation');
    var otherIsValid = this._otherIsValid();
    return areaIsValid && populationIsvalid && otherIsValid;
  },
  _areaIsValid: function() {
    var totalAreaIsValid = this.refs.totalArea.isValid().valid;
    var heatingAreaIsValid = this.refs.heatingArea.isValid().valid;
    var coolingAreaIsValid = this.refs.coolingArea.isValid().valid;

    return totalAreaIsValid && heatingAreaIsValid && coolingAreaIsValid;
  },
  _compareDate(date, compDate) {
    var m = moment(date);
    var comp = moment(compDate);
    if (m.get('year') === comp.get('year') && m.get('month') === comp.get('month')) {
      return true;
    }
    return false;
  },
  _getErrorText: function(code) {
    var errorText = '';
    switch (code) {
      case 'TotalPopulation':
        errorText = I18N.Setting.DynamicProperty.PopulationStartDateDuplicated;
        break;
      case 'UsedRoom':
        errorText = I18N.Setting.DynamicProperty.RoomStartDateDuplicated;
        break;
      case 'UsedBed':
        errorText = I18N.Setting.DynamicProperty.BedStartDateDuplicated;
        break;
    }
    return errorText;
  },
  _dynamicIsValid: function(code) {
    var errorText = this._getErrorText(code);
    var obj = {};
    var property = this.state.property,
      properties = property.get('Properties'),
      propertyIndex = properties.findIndex(item => (item.get('Code') === code)),
      propertyItemValue = properties.getIn([propertyIndex, 'Values']);
    var length = propertyItemValue.size;
    var everyItemIsValid = true,
      itemsIsValid = true;
    var errorTextArr = this._getInitError(code);

    for (var i = 0; i < length; i++) {
      everyItemIsValid = everyItemIsValid && this.refs[code + (i + 1)]._isValid();
    }

    for (var i = 0; i < length; i++) {
      for (var j = (i + 1); j < length; j++) {
        if (this._compareDate(propertyItemValue.getIn([i, 'StartDate']), propertyItemValue.getIn([j, 'StartDate']))) {
          errorTextArr[i] = errorText;
          errorTextArr[j] = errorText;
          itemsIsValid = false;
        }
      }
    }
    obj[code + 'ErrorTextArr'] = errorTextArr;
    this.setState(obj);
    return everyItemIsValid && itemsIsValid;
  },
  _otherIsValid: function() {
    var totalRoomIsValid = this.refs.totalRoom.isValid().valid;
    var totalBedIsValid = this.refs.totalBed.isValid().valid;
    var usedRoomIsValid = this._dynamicIsValid('UsedRoom');
    var usedBedIsValid = this._dynamicIsValid('UsedBed');
    return totalRoomIsValid && totalBedIsValid && usedRoomIsValid && usedBedIsValid;
  },
  _addPropertyItem: function(code) {
    var property = this.state.property,
      properties = property.get('Properties'),
      propertyIndex = properties.findIndex(item => (item.get('Code') === code)),
      propertyItemValue = properties.getIn([propertyIndex, 'Values']);
    var addPropertyItem = Immutable.fromJS({
      StartDate: null,//d2j(new Date()),
      Value:''
    });
    propertyItemValue = propertyItemValue.unshift(addPropertyItem);
    properties = properties.setIn([propertyIndex, 'Values'], propertyItemValue);
    property = property.set('Properties', properties);
    this.setState({
      property: property
    }, () => {
      var isValid = this._isValid();
      this.props.setEditBtnStatus(!isValid);
    });
  },
  _deletePropertyItem: function(code, index) {
    var property = this.state.property,
      properties = property.get('Properties'),
      propertyIndex = properties.findIndex(item => (item.get('Code') === code)),
      propertyItemValue = properties.getIn([propertyIndex, 'Values']);
    propertyItemValue = propertyItemValue.delete(index);
    properties = properties.setIn([propertyIndex, 'Values'], propertyItemValue);
    property = property.set('Properties', properties);
    this.setState({
      property: property
    }, () => {
      var isValid = this._isValid();
      this.props.setEditBtnStatus(!isValid);
    });
  },
  _merge: function(data) {
    var index = data.index,
      path = data.path,
      value = data.value,
      code = data.code;
    var property = this.state.property,
      properties = property.get('Properties'),
      propertyIndex = properties.findIndex(item => (item.get('Code') === code)),
      propertyItemValue = properties.getIn([propertyIndex, 'Values']);
    if (value === '' && code !== 'TotalPopulation' && code !== 'UsedRoom' && code !== 'UsedBed') {
      propertyItemValue = propertyItemValue.delete(index);
    } else {
      propertyItemValue = propertyItemValue.setIn([index, path], value);
    }

    properties = properties.setIn([propertyIndex, 'Values'], propertyItemValue);
    property = property.set('Properties', properties);
    this.setState({
      property: property
    }, () => {
      var isValid = this._isValid();
      this.props.setEditBtnStatus(!isValid);
    });
  },
  _renderArea: function() {
    var isView = this.props.formStatus === formStatus.VIEW;
    var area = null;
    var properties = this.state.property.get('Properties'),
      totalArea = properties.find(item => (item.get('Code') === 'TotalArea')),
      heatingArea = properties.find(item => (item.get('Code') === 'HeatingArea')),
      coolingArea = properties.find(item => (item.get('Code') === 'CoolingArea'));
    var hasTotalArea = totalArea.get('Values').size === 0 ? false : true,
      hasHeatingArea = heatingArea.get('Values').size === 0 ? false : true,
      hasCoolingArea = coolingArea.get('Values').size === 0 ? false : true;
    var areaWidthStyle = {
      width: '200px'
    };
    if (hasTotalArea || hasHeatingArea || hasCoolingArea || !isView) {
      var areaTitle = (<div className='jazz-hierarchy-property-title'>
        <div className='jazz-hierarchy-property-title-text'>{I18N.Setting.DynamicProperty.Area}</div>
      </div>);
      var totalAreaDom = null,
        heatingAreaDom = null,
        coolingAreaDom = null;
      if (hasTotalArea || !isView) {
        var totalAreaProps = {
          ref: 'totalArea',
          defaultValue: totalArea.get('Values').getIn([0, 'Value']),
          isViewStatus: isView,
          title: I18N.Setting.DynamicProperty.AArea,
          style: areaWidthStyle,
          format: null,
          didChanged: value => {
            this._merge({
              value,
              index: 0,
              code: 'TotalArea',
              path: 'Value'
            })
          },
          validate: (value = '') => {
            if (value !== '' && !Regex.ConsecutiveHoursRule.test(value)) {
              return I18N.Setting.VEEMonitorRule.ConsecutiveHoursError
            }
          },
          unit: ' ' + I18N.Setting.DynamicProperty.AreaUnitValue
        }
        totalAreaDom = <div className='jazz-hierarchy-property-area-item'><ViewableNumberField  {...totalAreaProps} /></div>;
      }
      if (hasHeatingArea || !isView) {
        var heatingAreaProps = {
          ref: 'heatingArea',
          defaultValue: heatingArea.get('Values').getIn([0, 'Value']),
          isViewStatus: isView,
          title: I18N.Setting.DynamicProperty.WArea,
          style: areaWidthStyle,
          format: null,
          didChanged: value => {
            this._merge({
              value,
              index: 0,
              code: 'HeatingArea',
              path: 'Value'
            })
          },
          validate: (value = '') => {
            if (value !== '' && !Regex.ConsecutiveHoursRule.test(value)) {
              return I18N.Setting.VEEMonitorRule.ConsecutiveHoursError
            }
          },
          unit: ' ' + I18N.Setting.DynamicProperty.AreaUnitValue
        }
        heatingAreaDom = <div className='jazz-hierarchy-property-area-item'><ViewableNumberField  {...heatingAreaProps} /></div>;
      }
      if (hasCoolingArea || !isView) {
        var coolingAreaProps = {
          ref: 'coolingArea',
          defaultValue: coolingArea.get('Values').getIn([0, 'Value']),
          isViewStatus: isView,
          title: I18N.Setting.DynamicProperty.CArea,
          style: areaWidthStyle,
          format: null,
          didChanged: value => {
            this._merge({
              value,
              index: 0,
              code: 'CoolingArea',
              path: 'Value'
            })
          },
          validate: (value = '') => {
            if (value !== '' && !Regex.ConsecutiveHoursRule.test(value)) {
              return I18N.Setting.VEEMonitorRule.ConsecutiveHoursError
            }
          },
          unit: ' ' + I18N.Setting.DynamicProperty.AreaUnitValue
        }
        coolingAreaDom = <div className='jazz-hierarchy-property-area-item'><ViewableNumberField  {...coolingAreaProps} /></div>;
      }
      area = (<div className='jazz-hierarchy-property'>
      {areaTitle}
      <div className='jazz-hierarchy-property-area'>
        {totalAreaDom}
        {heatingAreaDom}
        {coolingAreaDom}
      </div>
    </div>);
    }
    return area;
  },
  _renderPopulation: function() {
    var me = this;
    var isView = this.props.formStatus === formStatus.VIEW;
    var population = null;
    var properties = this.state.property.get('Properties'),
      totalPopulation = properties.find(item => (item.get('Code') === 'TotalPopulation')),
      hasTotalPopulation = totalPopulation.get('Values').size === 0 ? false : true;
    if (hasTotalPopulation || !isView) {
      var populationItems = null;
      var addButton = isView ? null : (<FlatButton label={I18N.Common.Button.Add} onClick={this._addPropertyItem.bind(this, 'TotalPopulation')} primary={false}/>);
      var populationTitle = (<div className='jazz-hierarchy-property-title'>
        <div className='jazz-hierarchy-property-title-text'>{I18N.Setting.DynamicProperty.Population}</div>
        {addButton}
      </div>);
      if (hasTotalPopulation) {
        populationItems = totalPopulation.get('Values').map((item, i) => {
          let props = {
            key: i,
            index: i,
            code: 'TotalPopulation',
            ref: 'TotalPopulation' + (i + 1),
            calendarItem: item,
            isViewStatus: isView,
            merge: me._merge,
            data: item,
            errorText: me.state.TotalPopulationErrorTextArr[i],
            deletePropertyItem: me._deletePropertyItem
          };
          return (
            <PropertyItem {...props}/>
            );
        });
      }
      population = (<div className='jazz-hierarchy-property'>
      {populationTitle}
      <div className='jazz-hierarchy-property-list'>
        {populationItems}
      </div>
    </div>);
    }
    return population;
  },
  _renderOther: function() {
    var me = this;
    var other = null;
    var isView = this.props.formStatus === formStatus.VIEW;
    var other = null;
    var addButton;
    var properties = this.state.property.get('Properties'),
      totalRoom = properties.find(item => (item.get('Code') === 'TotalRoom')),
      usedRoom = properties.find(item => (item.get('Code') === 'UsedRoom')),
      totalBed = properties.find(item => (item.get('Code') === 'TotalBed')),
      usedBed = properties.find(item => (item.get('Code') === 'UsedBed'));
    var hasTotalRoom = totalRoom.get('Values').size === 0 ? false : true,
      hasUsedRoom = usedRoom.get('Values').size === 0 ? false : true,
      hasTotalBed = totalBed.get('Values').size === 0 ? false : true,
      hasUsedBed = usedBed.get('Values').size === 0 ? false : true;
    if (hasTotalRoom || hasUsedRoom || hasTotalBed || hasUsedBed || !isView) {
      var otherTitle = (<div className='jazz-hierarchy-property-title'>
        <div className='jazz-hierarchy-property-title-text'>{I18N.Setting.DynamicProperty.Other}</div>
      </div>);
      var totalRoomDom = null,
        usedRoomDom = null,
        totalBedDom = null,
        usedBedDom = null;
      if (hasTotalRoom || !isView) {
        var totalRoomProps = {
          ref: 'totalRoom',
          defaultValue: totalRoom.get('Values').getIn([0, 'Value']),
          isViewStatus: isView,
          title: I18N.Setting.DynamicProperty.ARoomNumber,
          format: null,
          didChanged: value => {
            this._merge({
              value,
              index: 0,
              code: 'TotalRoom',
              path: 'Value'
            })
          },
          validate: (value = '') => {
            if (value !== '' && !Regex.ConsecutiveHoursRule.test(value)) {
              return I18N.Setting.VEEMonitorRule.ConsecutiveHoursError
            }
          },
          unit: ' ' + I18N.Setting.DynamicProperty.RoomUnitValue
        }
        totalRoomDom = (<div className='jazz-hierarchy-property-other-item'><ViewableNumberField  {...totalRoomProps} /></div>);
      }
      if (hasUsedRoom || !isView) {
        var usedRoomItems = null;
        addButton = isView ? null : (<FlatButton label={I18N.Common.Button.Add} onClick={this._addPropertyItem.bind(this, 'UsedRoom')} primary={false}/>);
        var usedRoomTitle = (<div className='jazz-hierarchy-property-title'>
          <div className='jazz-hierarchy-property-title-text'>{I18N.Setting.DynamicProperty.UsedRoom}</div>
          {addButton}
        </div>);
        if (hasUsedRoom) {
          usedRoomItems = usedRoom.get('Values').map((item, i) => {
            let props = {
              key: i,
              index: i,
              code: 'UsedRoom',
              ref: 'UsedRoom' + (i + 1),
              calendarItem: item,
              isViewStatus: isView,
              merge: me._merge,
              data: item,
              errorText: me.state.UsedRoomErrorTextArr[i],
              deletePropertyItem: me._deletePropertyItem
            };
            return (
              <PropertyItem {...props}/>
              );
          });
        }
        usedRoomDom = (<div className='jazz-hierarchy-property-other-item'>
        {usedRoomTitle}
        <div className='jazz-hierarchy-property-list'>
          {usedRoomItems}
        </div>
      </div>);
      }
      if (hasTotalBed || !isView) {
        var totalBedProps = {
          ref: 'totalBed',
          defaultValue: totalBed.get('Values').getIn([0, 'Value']),
          isViewStatus: isView,
          title: I18N.Setting.DynamicProperty.ABedNumber,
          format: null,
          didChanged: value => {
            this._merge({
              value,
              index: 0,
              code: 'TotalBed',
              path: 'Value'
            })
          },
          validate: (value = '') => {
            if (value !== '' && !Regex.ConsecutiveHoursRule.test(value)) {
              return I18N.Setting.VEEMonitorRule.ConsecutiveHoursError
            }
          },
          unit: ' ' + I18N.Setting.DynamicProperty.BedUnitValue
        }
        totalBedDom = (<div className='jazz-hierarchy-property-other-item'><ViewableNumberField  {...totalBedProps} /></div>);
      }
      if (hasUsedBed || !isView) {
        var usedBedItems = null;
        addButton = isView ? null : (<FlatButton label={I18N.Common.Button.Add} onClick={this._addPropertyItem.bind(this, 'UsedBed')} primary={false}/>);
        var usedBedTitle = (<div className='jazz-hierarchy-property-title'>
          <div className='jazz-hierarchy-property-title-text'>{I18N.Setting.DynamicProperty.UsedBed}</div>
          {addButton}
        </div>);
        if (hasUsedBed) {
          usedBedItems = usedBed.get('Values').map((item, i) => {
            let props = {
              key: i,
              index: i,
              code: 'UsedBed',
              ref: 'UsedBed' + (i + 1),
              calendarItem: item,
              isViewStatus: isView,
              merge: me._merge,
              data: item,
              errorText: me.state.UsedBedErrorTextArr[i],
              deletePropertyItem: me._deletePropertyItem
            };
            return (
              <PropertyItem {...props}/>
              );
          });
        }
        usedBedDom = (<div className='jazz-hierarchy-property-other-item'>
        {usedBedTitle}
        <div className='jazz-hierarchy-property-list'>
          {usedBedItems}
        </div>
      </div>);
      }
      other = (<div className='jazz-hierarchy-property'>
        {otherTitle}
        <div className='jazz-hierarchy-property-other'>
          {totalRoomDom}
          {usedRoomDom}
          {totalBedDom}
          {usedBedDom}
        </div></div>);
    }
    return other;
  },
  _renderDetail: function() {
    var me = this;
    var isView = this.props.formStatus === formStatus.VIEW;
    if (me.state.isLoading) {
      return (<div style={{
          display: 'flex',
          flex: 1,
          'alignItems': 'center',
          'justifyContent': 'center'
        }}><CircularProgress  mode="indeterminate" size={80} /></div>);
    } else {
      var properties = this.state.property.get('Properties');
      var property = null;
      var allIsNull = true;
      for (var i = 0; i < properties.size; i++) {
        if (properties.getIn([i, 'Values']).size !== 0) {
          allIsNull = false;
          break;
        }
      }
      if (isView && allIsNull) {
        property = (<div  style={{
          color: '#464949',
          fontSize: '14px'
        }}>{I18N.Setting.DynamicProperty.AddPropertyInfo}</div>);
      } else {
        property = (<div className="pop-customer-detail-content-left">
        {this._renderArea()}
        {this._renderPopulation()}
        {this._renderOther()}
      </div>);
      }
      return (
        <div>
          <div className={"pop-customer-detail-content"}>
            {property}
          </div>
        </div>
        );
    }
  },
  componentDidMount: function() {
    HierarchyAction.getProperty(this.props.hierarchyId);
    HierarchyStore.addPropertyChangeListener(this._onChange);
  },
  componentWillUnmount: function() {
    HierarchyStore.removePropertyChangeListener(this._onChange);
  },
  render: function() {
    return (
      <div className="pop-manage-detail-content" style={{
        display: 'flex'
      }}>
        {this._renderDetail()}
      </div>
      );

  },
});
module.exports = Property;
