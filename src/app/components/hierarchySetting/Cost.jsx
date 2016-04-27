'use strict';

import React from "react";
import classnames from "classnames";
import Immutable from 'immutable';
import { CircularProgress, RadioButtonGroup, RadioButton } from 'material-ui';
import { formStatus } from '../../constants/FormStatus.jsx';
import { Map } from 'immutable';
import HierarchyAction from '../../actions/hierarchySetting/HierarchyAction.jsx';
import HierarchyStore from '../../stores/hierarchySetting/HierarchyStore.jsx';
import YearMonthItem from '../../controls/YearMonthItem.jsx';
import { dataStatus } from '../../constants/DataStatus.jsx';
import DeletableItem from '../../controls/DeletableItem.jsx';
import ViewableNumberField from '../../controls/ViewableNumberField.jsx';
import ViewableTextField from '../../controls/ViewableTextField.jsx';
import ViewableTextFieldUtil from '../../controls/ViewableTextFieldUtil.jsx';
import Regex from '../../constants/Regex.jsx';
import CommonFuns from '../../util/Util.jsx';
var d2j = CommonFuns.DataConverter.DatetimeToJson;
function emptyMap() {
  return new Map();
}

var Cost = React.createClass({
  propTypes: {
    formStatus: React.PropTypes.string,
    hierarchyId: React.PropTypes.number,
    onUpdate: React.PropTypes.func,
  },
  mixins: [React.addons.LinkedStateMixin, ViewableTextFieldUtil],
  getInitialState: function() {
    return ({
      cost: emptyMap(),
      isLoading: true,
    })
  },
  _handlerSave: function() {
    // this.setState({
    //   isLoading: true
    // });
    return this.state.addingTags;
  },
  _onChange: function() {
    this.setState({
      cost: HierarchyStore.getCost(),
      isLoading: false
    })
  },
  merge: function(data) {

    var {status, path, value, index} = data,
      paths = path.split("."),
      value = Immutable.fromJS(value);
    var mData = this.state.cost;
    if (status === dataStatus.DELETED) {
      mData = mData.deleteIn(paths);
    } else if (status === dataStatus.NEW) {
      var children = mData.getIn(paths);
      if (!children) {
        children = emptyList();
      }
      if (Immutable.List.isList(children)) {
        if (index) {
          paths.push(index);
        } else {
          value = children.unshift(value);
        }
      }
      mData = mData.setIn(paths, value);
    } else {
      if (path.indexOf('ComplexItem') > -1) {
        mData = mData.setIn(paths, value);
        paths.pop();
        paths.push('SimpleItem');
        mData = mData.setIn(paths, null);
      } else {
        if (path.indexOf('SimpleItem') > -1) {
          mData = mData.setIn(paths, value);
          paths.pop();
          paths.push('ComplexItem');
          mData = mData.setIn(paths, null);
        } else {
          mData = mData.setIn(paths, value);
        }
      }

    }
    this.setState({
      cost: mData
    });
  },
  _handelAddPower: function() {
    var costCommodities = this.state.cost.get('CostCommodities'),
      that = this,
      power = emptyMap(),
      index = 0;
    if (costCommodities.size !== 0) {
      power = costCommodities.find(item => (item.get('CommodityId') === 1));
      index = costCommodities.findIndex(item => (item.get('CommodityId') === 1));
    }
    if (power.size === 0) {
      power = Immutable.fromJS({
        CommodityId: 1,
        UomId: 1,
        Items: [{
          ComplexItem: null,
          EffectiveDate: d2j(new Date()),
          SimpleItem: null
        }]
      })
      that.merge({
        status: dataStatus.NEW,
        path: 'CostCommodities',
        value: power
      })
    } else {
      power = power.set('Items', power.get('Items').push(
        Immutable.fromJS({
          ComplexItem: null,
          EffectiveDate: d2j(new Date()),
          SimpleItem: null
        })
      ));
      that.merge({
        path: 'CostCommodities' + '.' + index,
        value: power
      })
    }
  },
  _handleDeletePower: function(id) {
    var costCommodities = this.state.cost.get('CostCommodities'),
      that = this,
      power = emptyMap(),
      index = 0;
    if (costCommodities.size !== 0) {
      power = costCommodities.find(item => (item.get('CommodityId') === 1));
      index = costCommodities.findIndex(item => (item.get('CommodityId') === 1));
    }
    this.merge({
      status: dataStatus.DELETED,
      path: 'CostCommodities' + '.' + index + '.' + 'Items' + '.' + id
    })
  },
  _onPowerPriceChange: function(value, index, id) {
    var simpleItem, complexItem,
      that = this;
    if (value === 'simpleItem') {
      complexItem = null;
      simpleItem = {};
      that.merge({
        path: 'CostCommodities' + '.' + index + '.' + 'Items' + '.' + id + '.' + 'SimpleItem',
        value: Immutable.fromJS(simpleItem)
      })
    } else {
      simpleItem = null;
      complexItem = {
        DemandCostType: 1
      };
      that.merge({
        path: 'CostCommodities' + '.' + index + '.' + 'Items' + '.' + id + '.' + 'ComplexItem',
        value: Immutable.fromJS(complexItem)
      });
    }

  },
  _renderSimpleItem: function(item, id) {
    var costCommodities = this.state.cost.get('CostCommodities'),
      isView = this.props.formStatus === formStatus.VIEW,
      that = this,
      power = emptyMap(),
      index = 0;
    if (costCommodities.size !== 0) {
      power = costCommodities.find(item => (item.get('CommodityId') === 1));
      index = costCommodities.findIndex(item => (item.get('CommodityId') === 1));
    }
    var price = power.getIn(['Items', id, 'SimpleItem', 'Price']);
    var priceProps = {
      defaultValue: price,
      isViewStatus: isView,
      title: I18N.MainMenu.Price + '(' + I18N.Setting.Labeling.ElectrovalenceUom + ')',
      didChanged: value => {
        that.merge({
          path: 'CostCommodities' + '.' + index + '.' + 'Items' + '.' + id + '.' + 'SimpleItem' + '.' + 'Price',
          value: value
        })
      },
      unit: ' ' + I18N.Setting.Cost.PriceUom + '/' + HierarchyStore.findUOMById(power.get('UomId'))
    };
    return (
      <div style={{
        display: 'flex',
        marginTop: '10px',
        marginLeft: '40px'
      }}>
                    <ViewableNumberField  {...priceProps} />
                  </div>
      )

  },
  _renderComplexItem: function(item, id) {
    var costCommodities = this.state.cost.get('CostCommodities'),
      isView = this.props.formStatus === formStatus.VIEW,
      that = this,
      power = emptyMap(),
      index = 0;
    if (costCommodities.size !== 0) {
      power = costCommodities.find(item => (item.get('CommodityId') === 1));
      index = costCommodities.findIndex(item => (item.get('CommodityId') === 1));
    }
    var path = 'CostCommodities' + '.' + index + '.' + 'Items' + '.' + id + '.' + 'ComplexItem' + '.';
    var complexItem = item.get('ComplexItem'),
      defaultSelected = complexItem.get('DemandCostType') !== 2 ? '1' : '2';
    var styles = {
      group: {
        display: 'flex',
        'flexDirection': 'row'
      },
      leftradioButton: {
        fontSize: '14px',
        color: '#464949'
      },
      rightradioButton: {
        fontSize: '14px',
        color: '#464949',
        marginLeft: '-350px'
      },
    };
    var renderTransformerMode = function() {
      var {TransformerPrice, TransformerCapacity} = complexItem.toJS();
      var transformerPriceProps = {
          isViewStatus: isView,
          title: I18N.Setting.Cost.DemandPrice,
          defaultValue: TransformerPrice,
          regex: Regex.FactorRule,
          errorMessage: I18N.Setting.CarbonFactor.ErrorContent,
          maxLen: 16,
          isRequired: true,
          style: {
            maxWidth: '200px'
          },
          didChanged: value => {
            // CarbonAction.merge({
            //   value: {
            //     value: value,
            //     factorIndex: index
            //   },
            //   path: "FactorValue"
            // });
          }
        },
        transformerCapacityProps = {
          isViewStatus: isView,
          title: I18N.Setting.Cost.TransformerCapacity,
          defaultValue: TransformerPrice,
          regex: Regex.FactorRule,
          errorMessage: I18N.Setting.CarbonFactor.ErrorContent,
          maxLen: 16,
          isRequired: true,
          style: {
            maxWidth: '200px'
          },
          didChanged: value => {
            // CarbonAction.merge({
            //   value: {
            //     value: value,
            //     factorIndex: index
            //   },
            //   path: "FactorValue"
            // });
          }
        };
      return (
        <div style={{
          display: 'flex',
          flexDirection: 'row'
        }}>
              <ViewableTextField  {...transformerCapacityProps} />
              <div style={isView ? {
          margin: '20px 5px 0 5px'
        } : {
          margin: '35px 5px 0 5px'
        }}>x</div>
              <ViewableTextField  {...transformerPriceProps} />
              <div classnames='jazz-default-font'>{I18N.Setting.Cost.PowerUOM}</div>
            </div>
        )
    };
    return (
      <div>
        <div className='jazz-fromenddate-item-text'>{I18N.Setting.Cost.DemandCostMode}</div>
          <RadioButtonGroup name="price" defaultSelected={defaultSelected} onChange={(event, value) => {
        this.merge({
          path: path + 'DemandCostType',
          value: parseInt(value)
        })
      }} style={styles.group}>
            <RadioButton
      value="1"
      label={I18N.Setting.Cost.TransformerMode}
      style={styles.leftradioButton}
      disabled={isView}
      />
            <RadioButton
      value="2"
      label={I18N.Setting.Cost.TimeMode}
      style={styles.rightradioButton}
      disabled={isView}
      />
          </RadioButtonGroup>
        {defaultSelected === '1' ? renderTransformerMode() : null}
      </div>
      )

  },
  _renderPower: function(power, id) {
    var isView = this.props.formStatus === formStatus.VIEW,
      items = [],
      that = this;
    power.get('Items').forEach((item, index) => {
      var deleteProps = {
        isDelete: !isView,
        onDelete: () => {
          that._handleDeletePower(index);
        }
      };
      var date = item.get('EffectiveDate');
      var complexItem = item.get('ComplexItem'),
        simpleItem = item.get('SimpleItem'),
        defaultSelected = complexItem === null ? 'simpleItem' : 'complexItem';
      var dateProps = {
        ref: 'date',
        key: this.props.hierarchyId + '_power' + index,
        isViewStatus: isView,
        date: date,
        onDateChange: date => {
          that.merge(
            {
              path: 'CostCommodities' + '.' + id + '.' + 'Items' + '.' + index + '.' + 'EffectiveDate',
              value: date
            }
          )
        }
      };
      var styles = {
        group: {
          display: 'flex',
          'flexDirection': 'row'
        },
        leftradioButton: {
          fontSize: '14px',
          color: '#464949'
        },
        rightradioButton: {
          fontSize: '14px',
          color: '#464949',
          marginLeft: '-350px'
        },
      };
      items.unshift(
        <div className='jazz-carbon-factorItem'>
        <DeletableItem {...deleteProps}>
        <YearMonthItem {...dateProps}/>
        <div className='jazz-fromenddate-item-text'>{I18N.Setting.Cost.PriceType}</div>
          <RadioButtonGroup name="price" defaultSelected={defaultSelected} onChange={(event, value) => {
          this._onPowerPriceChange(value, id, index)
        }} style={styles.group}>
            <RadioButton
        value="simpleItem"
        label={I18N.Setting.Cost.FixedPrice}
        style={styles.leftradioButton}
        disabled={isView}
        />
            <RadioButton
        value="complexItem"
        label={I18N.Setting.Cost.ComplexPrice}
        style={styles.rightradioButton}
        disabled={isView}
        />
          </RadioButtonGroup>
          {defaultSelected === 'simpleItem' ? this._renderSimpleItem(item, index) : this._renderComplexItem(item, index)}
        </DeletableItem>
      </div>
      )
    });

    return (
      <div className="pop-manage-detail-content">
        <div className="jazz-carbon-addItem">
          <div>{I18N.Common.Commodity.Electric}</div>
          <div className={classnames({
        "jazz-carbon-addItem-addBtn": true,
        "inactive": isView
      })} onClick={this._handelAddPower}>
          {I18N.Common.Button.Add}
        </div>
        </div>
        {items}
      </div>
      )
  },
  _renderCommodities: function() {
    var costCommodities = this.state.cost.get('CostCommodities'),
      that = this,
      power = emptyMap(),
      index = 0;
    if (costCommodities.size !== 0) {
      power = costCommodities.find(item => (item.get('CommodityId') === 1));
      index = costCommodities.findIndex(item => (item.get('CommodityId') === 1));
    }

    return (
      <div className='jazz-vee-monitor-tag-background'>
        {power.size === 0 ? null : that._renderPower(power, index)}
        </div>
      )
  },
  _renderContent: function() {
    var that = this,
      {CostCommodities} = this.state.cost.toJS();
    if (CostCommodities === null && this.props.formStatus === formStatus.VIEW) {
      return (
        <div style={{
          color: '#767a7a',
          fontSize: '14px'
        }}>
          {I18N.Setting.Cost.NoCommodities}
        </div>
        )
    } else {
      return (
      that._renderCommodities()
      )
    }
  },
  componentWillMount: function() {
    this.initBatchViewbaleTextFiled();
  },
  componentDidMount: function() {
    HierarchyStore.addCostChangeListener(this._onChange);
    HierarchyAction.getCostByHierarchy(this.props.hierarchyId);
  },
  componentWillReceiveProps: function(nextProps) {
    var that = this;
    if (nextProps.formStatus === formStatus.VIEW) {
      that.setState({
        cost: HierarchyStore.getCost(),
        isLoading: false
      })
    }
  },
  componentWillUnmount: function() {
    HierarchyStore.removeCostChangeListener(this._onChange);
  },
  render: function() {
    var isView = this.props.formStatus === formStatus.VIEW;
    var loading = <div style={{
      display: 'flex',
      flex: 1,
      'alignItems': 'center',
      'justifyContent': 'center'
    }}>
            <CircularProgress  mode="indeterminate" size={2} />
          </div>;
    return (
      <div className="pop-manage-detail-content" style={{
        display: 'flex'
      }}>
        {this.state.isLoading ? loading : this._renderContent()}
      </div>
      )
  },

});
module.exports = Cost;
