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
  render: function() {
    return (
      <div className='jazz-hierarchy-property-item'>
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
    if (hasTotalArea || hasHeatingArea || hasCoolingArea) {
      var areaTitle = <div className='jazz-hierarchy-property-totalarea-title'>
        {I18N.Setting.DynamicProperty.PopulationArea}
      </div>;
      var totalAreaDom = null,
        heatingAreaDom = null,
        coolingAreaDom = null;
      if (hasTotalArea) {
        var totalAreaProps = {
          defaultValue: totalArea.get('Values').getIn([0, 'Value']),
          isViewStatus: isView,
          title: I18N.Setting.DynamicProperty.AArea,
          didChanged: value => {
            this._.merge({
              value,
              index: 0,
              path: "TotalArea"
            })
          },
          validate: (value = '') => {
            if (value !== '' && !Regex.ConsecutiveHoursRule.test(value)) {
              return I18N.Setting.VEEMonitorRule.ConsecutiveHoursError
            }
          },
          unit: ' ' + I18N.Setting.DynamicProperty.AreaUnitValue
        }
        totalAreaDom = <ViewableNumberField  {...totalAreaProps} />;
      }
      if (hasHeatingArea) {
        var heatingAreaProps = {
          defaultValue: heatingArea.get('Values').getIn([0, 'Value']),
          isViewStatus: isView,
          title: I18N.Setting.DynamicProperty.WArea,
          didChanged: value => {
            this._merge({
              value,
              index: 0,
              path: "HeatingArea"
            })
          },
          validate: (value = '') => {
            if (value !== '' && !Regex.ConsecutiveHoursRule.test(value)) {
              return I18N.Setting.VEEMonitorRule.ConsecutiveHoursError
            }
          },
          unit: ' ' + I18N.Setting.DynamicProperty.AreaUnitValue
        }
        heatingAreaDom = <ViewableNumberField  {...heatingAreaProps} />;
      }
      if (hasCoolingArea) {
        var coolingAreaProps = {
          defaultValue: coolingArea.get('Values').getIn([0, 'Value']),
          isViewStatus: isView,
          title: I18N.Setting.DynamicProperty.CArea,
          didChanged: value => {
            this._merge({
              value,
              index: 0,
              path: "CoolingArea"
            })
          },
          validate: (value = '') => {
            if (value !== '' && !Regex.ConsecutiveHoursRule.test(value)) {
              return I18N.Setting.VEEMonitorRule.ConsecutiveHoursError
            }
          },
          unit: ' ' + I18N.Setting.DynamicProperty.AreaUnitValue
        }
        coolingAreaDom = <ViewableNumberField  {...coolingAreaProps} />;
      }
      area = (<div className='jazz-hierarchy-property-totalarea'>
      {areaTitle}
      <div className='jazz-hierarchy-property-totalarea-content'>
        {totalAreaDom}
        {heatingAreaDom}
        {coolingAreaDom}
      </div>
    </div>)
    }
    return area;
  },
  _renderProperty: function() {
    var property = null;
    return property;
  },
  _renderOther: function() {
    var other = null;
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
        {this._renderArear()}
        {this._renderProperty()}
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
