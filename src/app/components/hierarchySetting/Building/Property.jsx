'use strict';

import React from "react";
import classnames from "classnames";
import { formStatus } from '../../../constants/FormStatus.jsx';
import { CircularProgress } from 'material-ui';
import Immutable from 'immutable';
import { Map, List } from 'immutable';
import HierarchyAction from '../../../actions/hierarchySetting/HierarchyAction.jsx';
import HierarchyStore from '../../../stores/hierarchySetting/HierarchyStore.jsx';
import ViewableNumberField from '../../../controls/ViewableNumberField.jsx';
import ViewableDropDownMenu from '../../../controls/ViewableDropDownMenu.jsx';
import FlatButton from '../../../controls/FlatButton.jsx';
import YearMonthItem from '../../../controls/YearMonthItem.jsx';
import Regex from '../../../constants/Regex.jsx';

let PropertyItem = React.createClass({
  propTypes: {
    code: React.PropTypes.string,
    index: React.PropTypes.number,
    merge: React.PropTypes.func,
    data: React.PropTypes.object,
    isViewStatus: React.PropTypes.bool,
    deletePropertyItem: React.PropTypes.func
  },
  _deletePropertyItem: function(type, index) {
    this.props.deletePropertyItem(type, index);
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
        isViewStatus: this.props.isViewStatus,
        date: this.props.data.get('StartDate'),
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
        defaultValue: this.props.data.get('Value'),
        isViewStatus: this.props.isViewStatus,
        title: this._getTitle(),
        didChanged: value => {
          this.props.merge({
            value,
            index: this.props.index,
            code: this.props.code,
            path: "Value"
          })
        },
        validate: (value = '') => {
          if (value !== '' && !Regex.ConsecutiveHoursRule.test(value)) {
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
  _onChange: function() {
    this.setState({
      property: HierarchyStore.getProperty(),
      isLoading: false
    });
  },
  _handlerSave: function() {
    return this.state.property.toJS();
  },
  _isValid: function() {},
  _getDefaultPropertyItem: function(type) {},
  _addPropertyItem: function(type) {
    var property = this.state.property;
    this.setState({
      property: property
    }, () => {
      var isValid = this._isValid();
      this.props.setEditBtnStatus(!isValid);
    });
  },
  _deletePropertyItem: function(type, index) {
    var property = this.state.property;
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
      value = data.value;
    var property = this.state.property;
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
          defaultValue: totalArea.get('Values').getIn([0, 'Value']),
          isViewStatus: isView,
          title: I18N.Setting.DynamicProperty.AArea,
          style: areaWidthStyle,
          didChanged: value => {
            this._.merge({
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
          defaultValue: heatingArea.get('Values').getIn([0, 'Value']),
          isViewStatus: isView,
          title: I18N.Setting.DynamicProperty.WArea,
          style: areaWidthStyle,
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
          defaultValue: coolingArea.get('Values').getIn([0, 'Value']),
          isViewStatus: isView,
          title: I18N.Setting.DynamicProperty.CArea,
          style: areaWidthStyle,
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
            calendarItem: item,
            isViewStatus: isView,
            merge: me._merge,
            data: item,
            deletePropertyItem: me._deletePropertyItem.bind(me, 'TotalPopulation')
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
          defaultValue: totalRoom.get('Values').getIn([0, 'Value']),
          isViewStatus: isView,
          title: I18N.Setting.DynamicProperty.ARoomNumber,
          didChanged: value => {
            this._.merge({
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
              calendarItem: item,
              isViewStatus: isView,
              merge: me._merge,
              data: item,
              deletePropertyItem: me._deletePropertyItem.bind(me, 'UsedRoom')
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
          defaultValue: totalBed.get('Values').getIn([0, 'Value']),
          isViewStatus: isView,
          title: I18N.Setting.DynamicProperty.ABedNumber,
          didChanged: value => {
            this._.merge({
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
              calendarItem: item,
              isViewStatus: isView,
              merge: me._merge,
              data: item,
              deletePropertyItem: me._deletePropertyItem.bind(me, 'UsedBed')
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
        }}><CircularProgress  mode="indeterminate" size={2} /></div>);
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
        property = (<div className="pop-customer-detail-content-left">{I18N.Setting.DynamicProperty.AddPropertyInfo}</div>);
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
