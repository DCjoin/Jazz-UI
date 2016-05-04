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
import ViewableDropDownMenu from '../../controls/ViewableDropDownMenu.jsx';
import Regex from '../../constants/Regex.jsx';
import CommonFuns from '../../util/Util.jsx';
import SideNav from '../../controls/SideNav.jsx';
import Dialog from '../../controls/PopupDialog.jsx';
import Factor09Detail from './Factor09Detail.jsx';
import Factor085Detail from './Factor085Detail.jsx';

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
      showTouDetailSideNav: false,
      showPowerFactorDialog: false,
      touIndex: null,
      factorIndex: null
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
  _formatTime(time) {
    var h = Math.floor(time / 60),
      m = time % 60;
    return ((h < 10) ? '0' : '') + h + ':' + ((m < 10) ? '0' : '') + m
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
          SimpleItem: {}
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
          SimpleItem: {}
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
  _handelAddOthers: function() {
    var costCommodities = this.state.cost.get('CostCommodities'),
      that = this;
    that.merge({
      status: dataStatus.NEW,
      path: 'CostCommodities',
      value: Immutable.fromJS({
        CommodityId: 2,
        Items: [{
          EffectiveDate: new Date()
        }],
        UomId: 9
      })
    })
  },
  _handerDeleteOthers: function() {},
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
  _showTouDetailsideNav: function(touIndex) {
    this.setState({
      showTouDetailSideNav: true,
      touIndex: touIndex
    });
  },

  _onCloseTouDetailSideNav: function() {
    this.setState({
      showTouDetailSideNav: false,
      touIndex: null
    });
  },
  _showPowerFactorDialog: function(factorIndex) {
    this.setState({
      showPowerFactorDialog: true,
      factorIndex: factorIndex
    });
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
  _renderTouDetailSideNav: function() {
    var that = this;
    if (this.state.showTouDetailSideNav) {
      var tou = that.state.cost.get('TouTariffs').getIn([that.state.touIndex]);
      var touTariffItems = tou.get('TouTariffItems'),
        peakTariff = tou.get('PeakTariff');
      var renderTouTariffItems = function() {
        var items = [];
        touTariffItems.forEach(item => {
          if (item.get('ItemType') === 2) {
            items.push(
              <div className='jazz-building-cost-tou-item'>
                  {I18N.Setting.TOUTariff.PlainPrice + ' : ' + item.get('Price')}
                </div>
            )
          } else if (item.get('ItemType') === 1) {
            items.push(
              <div className='jazz-building-cost-tou-item'>
                  {I18N.Setting.TOUTariff.PeakPrice + ' : ' + item.get('Price')}
                </div>
            );
            let times = [];
            item.get('TimeRange').forEach(time => {
              times.push(<div>{that._formatTime(time.get('m_Item1')) + ' - ' + that._formatTime(time.get('m_Item2'))}</div>)
            });
            items.push(
              <div className='jazz-building-cost-tou-item'>
                  {I18N.Setting.TOUTariff.PeakTimeRange + ' : '}
                <div style={{
                marginLeft: '5px'
              }}>{times}</div>
                </div>
            );
          } else if (item.get('ItemType') === 3) {
            items.push(
              <div className='jazz-building-cost-tou-item'>
                  {I18N.Setting.TOUTariff.ValleyPrice + ' : ' + item.get('Price')}
                </div>
            );
            let times = [];
            item.get('TimeRange').forEach(time => {
              times.push(<div>{that._formatTime(time.get('m_Item1')) + ' - ' + that._formatTime(time.get('m_Item2'))}</div>)
            });
            items.push(
              <div className='jazz-building-cost-tou-item'>
                  {I18N.Setting.TOUTariff.ValleyTimeRange + ' : '}
                <div style={{
                marginLeft: '5px'
              }}>{times}</div>
                </div>
            );
          }
        })
        return (
          <div>{items}</div>
          )
      };
      var renderPeakTariff = function() {
        var items = [];
        items.push(<div className='jazz-building-cost-tou-item'>
                        {I18N.Setting.TOUTariff.PulsePeakPrice + ' : ' + peakTariff.get('Price')}
                      </div>);
        peakTariff.get('TimeRanges').forEach(time => {
          items.push(<div className='jazz-building-cost-tou-item'>
                          {I18N.Setting.TOUTariff.PulsePeak + ' : ' + time.get('StartMonth') + I18N.Setting.Cost.Month + time.get('StartDay') + I18N.Setting.Cost.Day + I18N.Setting.Cost.To}
                          {time.get('EndMonth') + I18N.Setting.Cost.Month + time.get('EndDay') + I18N.Setting.Cost.Day}
                        </div>);
          items.push(<div className='jazz-building-cost-tou-item'>
                                        {I18N.Setting.TOUTariff.PeakValueTimeRange + ' : ' + that._formatTime(time.get('StartTime')) + ' - ' + that._formatTime(time.get('EndTime'))}
                                      </div>);
          return (
            <div>{items}</div>
            )
          })

        };
        return (<SideNav open={true} side="right" onClose={this._onCloseTouDetailSideNav}>
        <div className='jazz-default-font'>
          <div className="sidebar-title" title={tou.get('Name')} style={{
            overflow: ' hidden',
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis'
          }}>
          {I18N.Setting.Cost.TouDetail}
        </div>
        <div className="sidebar-content">
          <div className='jazz-building-cost-tou-item'>
            {I18N.Common.Glossary.PriceStrategy + ' : ' + tou.get('Name')}
          </div>
          <div className='jazz-building-cost-tou-item'>
            {I18N.Setting.TOUTariff.BasicPropertyTip}
          </div>
          {renderTouTariffItems()}
          {peakTariff === null ? null : renderPeakTariff()}
        </div>

        </div>
      </SideNav>);
      }
      return null;
    },
    _renderFactorTypeDialog: function() {
      var that = this;
      var closeDialog = function() {
        that.setState({
          showPowerFactorDialog: false
        });
      };
      if (!this.state.showPowerFactorDialog) {
        return null;
      } else {
        return (
          <Dialog openImmediately={this.state.showPowerFactorDialog}  modal={false} onClose={closeDialog}>
          {this.state.factorIndex === 1 ? <Factor09Detail/> : <Factor085Detail/>}
        </Dialog>
          );
      }
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
      var renderTimeMode = function() {
        var {HourPrice, HourTagId} = complexItem.toJS();
        var selectedId = 0,
          titleItems = [];
        that.state.cost.get('HourTags').forEach((tag, index) => {
          titleItems.push({
            payload: index,
            text: tag.get('Name')
          });
          if (tag.get('Id') === HourTagId) {
            selectedId = index;
          }
        });

        var hourTagProps = {
            isViewStatus: isView,
            title: I18N.Setting.Cost.DemandHourLabel,
            selectedIndex: selectedId,
            textField: "text",
            dataItems: titleItems,
            style: {
              maxWidth: '200px'
            },
            didChanged: value => {
              // CarbonAction.merge({
              //   value: {
              //     value: value,
              //     titleItems: titleItems,
              //     factorIndex: index
              //   },
              //   path: "EffectiveYear"
              // });
            }
          },
          hourPriceProps = {
            isViewStatus: isView,
            title: I18N.Setting.Cost.DemandPrice,
            defaultValue: HourPrice,
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
              <ViewableDropDownMenu  {...hourTagProps} />

              <ViewableTextField  {...hourPriceProps} />
              <div classnames='jazz-default-font'>{I18N.Setting.Cost.PowerUOM}</div>
            </div>
          )
      };
      var renderUsageCost = function() {
        var {TouTariffId} = complexItem.toJS();
        var selectedId = 0,
          titleItems = [];
        that.state.cost.get('TouTariffs').forEach((tou, index) => {
          titleItems.push({
            payload: index,
            text: tou.get('Name')
          });
          if (tou.get('Id') === TouTariffId) {
            selectedId = index;
          }
        });

        var touTariffProps = {
          isViewStatus: isView,
          title: I18N.Setting.Cost.UsageCost,
          selectedIndex: selectedId,
          textField: "text",
          dataItems: titleItems,
          style: {
            maxWidth: '200px'
          },
          didChanged: value => {
            // CarbonAction.merge({
            //   value: {
            //     value: value,
            //     titleItems: titleItems,
            //     factorIndex: index
            //   },
            //   path: "EffectiveYear"
            // });
          }
        };
        return (
          <div style={{
            display: 'flex',
            flexDirection: 'row'
          }}>
                <ViewableDropDownMenu  {...touTariffProps} />
                <div className='jazz-building-cost-showTou' onClick={that._showTouDetailsideNav.bind(this, selectedId)}>{I18N.Setting.Cost.SearchTouDetail}</div>
              </div>
          )
      };
      var renderFactorType = function() {
        var {FactorType} = complexItem.toJS();
        var selectedId = 0,
          titleItems = [{
            payload: 0,
            text: 0.85
          },
            {
              payload: 1,
              text: 0.9
            }];
        if (FactorType === 1) {
          selectedId = 1;
        }
        var factorProps = {
          isViewStatus: isView,
          title: I18N.Setting.Cost.PowerFactorFee,
          selectedIndex: selectedId,
          textField: "text",
          dataItems: titleItems,
          style: {
            maxWidth: '200px'
          },
          didChanged: value => {
            // CarbonAction.merge({
            //   value: {
            //     value: value,
            //     titleItems: titleItems,
            //     factorIndex: index
            //   },
            //   path: "EffectiveYear"
            // });
          }
        };
        return (
          <div style={{
            display: 'flex',
            flexDirection: 'row'
          }}>
                <ViewableDropDownMenu  {...factorProps} />
                <div className='jazz-building-cost-showTou' onClick={that._showPowerFactorDialog.bind(this, selectedId)}>{I18N.Setting.Cost.SearchPowerFactor}</div>
              </div>
          )
      };
      var renderTags = function() {
        var {RealTagId, ReactiveTagId} = complexItem.toJS();
        var selectedRealId = 0,
          selectedReactiveId = 0,
          realTitleItems = [],
          reactiveTitleItems = [];
        that.state.cost.get('RealTags').forEach((tag, index) => {
          realTitleItems.push({
            payload: index,
            text: tag.get('Name')
          });
          if (tag.get('Id') === RealTagId) {
            selectedRealId = index;
          }
        });
        that.state.cost.get('ReactiveTags').forEach((tag, index) => {
          reactiveTitleItems.push({
            payload: index,
            text: tag.get('Name')
          });
          if (tag.get('Id') === ReactiveTagId) {
            selectedReactiveId = index;
          }
        });
        var realTagProps = {
            isViewStatus: isView,
            title: I18N.Setting.Cost.RealPower,
            selectedIndex: selectedRealId,
            textField: "text",
            dataItems: realTitleItems,
            style: {
              maxWidth: '200px'
            },
            didChanged: value => {
              // CarbonAction.merge({
              //   value: {
              //     value: value,
              //     titleItems: titleItems,
              //     factorIndex: index
              //   },
              //   path: "EffectiveYear"
              // });
            }
          },
          reactiveTagProps = {
            isViewStatus: isView,
            title: I18N.Setting.Cost.ReactivePower,
            selectedIndex: selectedReactiveId,
            textField: "text",
            dataItems: reactiveTitleItems,
            style: {
              maxWidth: '200px'
            },
            didChanged: value => {
              // CarbonAction.merge({
              //   value: {
              //     value: value,
              //     titleItems: titleItems,
              //     factorIndex: index
              //   },
              //   path: "EffectiveYear"
              // });
            }
          };
        return (
          <div className='jazz-building-cost-tou-item'>
                <ViewableDropDownMenu  {...realTagProps}/>
                <ViewableDropDownMenu  {...reactiveTagProps}/>
              </div>
          )
      };
      var paddingCostProps = {
        isViewStatus: isView,
        title: I18N.Setting.Cost.PaddingCost,
        defaultValue: complexItem.get('PaddingCost'),
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
        {defaultSelected === '1' ? renderTransformerMode() : renderTimeMode()}
        {renderUsageCost()}
        {renderFactorType()}
        {renderTags()}
        <ViewableTextField  {...paddingCostProps} />
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
        <div>
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
        {that._renderTouDetailSideNav()}
        {that._renderFactorTypeDialog()}
      </div>
        )
    },
    _renderOthers: function() {
      var isView = this.props.formStatus === formStatus.VIEW,
        that = this,
        costCommodities = this.state.cost.get('CostCommodities'),
        commodityItems = [];
      costCommodities.forEach((commodity, id) => {
        var {CommodityId, Items, UomId} = commodity.toJS();
        if (CommodityId !== 1) {
          var coItem = [];
          Items.forEach((item, itemId) => {
            var selectedId = 0,
              titleItems = [];
            HierarchyStore.getCommodities().forEach((co, index) => {
              titleItems.push({
                payload: index,
                text: co.Comment
              });
              if (co.Id === CommodityId) {
                selectedId = index;
              }
            });
            var commodityProps = {
                isViewStatus: isView,
                title: I18N.Setting.Cost.CostCommodity,
                selectedIndex: selectedId,
                textField: "text",
                dataItems: titleItems,
                style: {
                  maxWidth: '200px'
                },
                didChanged: value => {
                  // CarbonAction.merge({
                  //   value: {
                  //     value: value,
                  //     titleItems: titleItems,
                  //     factorIndex: index
                  //   },
                  //   path: "EffectiveYear"
                  // });
                }
              },
              dateProps = {
                ref: 'date',
                key: this.props.hierarchyId + '_commodity' + id + '_item' + itemId,
                isViewStatus: isView,
                date: item.EffectiveDate,
                onDateChange: date => {
                  // that.merge(
                  //   {
                  //     path: 'CostCommodities' + '.' + id + '.' + 'Items' + '.' + index + '.' + 'EffectiveDate',
                  //     value: date
                  //   }
                  // )
                }
              },
              priceProps = {
                defaultValue: item.SimpleItem.Price,
                isViewStatus: isView,
                title: I18N.MainMenu.Price + '(' + I18N.Setting.Cost.PriceUom + '/' + HierarchyStore.findUOMById(UomId) + ')',
                didChanged: value => {
                  // that.merge({
                  //   path: 'CostCommodities' + '.' + index + '.' + 'Items' + '.' + id + '.' + 'SimpleItem' + '.' + 'Price',
                  //   value: value
                  // })
                },
                unit: ' ' + I18N.Setting.Cost.PriceUom + '/' + HierarchyStore.findUOMById(UomId)
              };
            var deleteProps = {
              isDelete: !isView,
              onDelete: () => {
                that._handerDeleteOthers(id, itemId);
              }
            };
            coItem.unshift(
              <div className='jazz-carbon-factorItem'>
              <DeletableItem {...deleteProps}>
                  <ViewableDropDownMenu {...commodityProps}/>
                  <YearMonthItem {...dateProps}/>
                  <ViewableNumberField {...priceProps}/>
                </DeletableItem>
              </div>
            )
          })
          commodityItems.push(coItem)
        }



      })
      return (
        <div>
        <div className="jazz-carbon-addItem">
          <div>{I18N.Setting.Cost.OtherCommodities}</div>
          <div className={classnames({
          "jazz-carbon-addItem-addBtn": true,
          "inactive": isView
        })} onClick={this._handelAddOthers}>
          {I18N.Common.Button.Add}
        </div>
        </div>
        {commodityItems}
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
          <div className='pop-manage-detail-content'>
            {power.size === 0 ? null : that._renderPower(power, index)}
            {that._renderOthers()}
          </div>

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
