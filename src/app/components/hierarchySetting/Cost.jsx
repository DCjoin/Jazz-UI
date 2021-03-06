'use strict';
import PropTypes from 'prop-types';
import React from "react";
import classnames from "classnames";
import Immutable from 'immutable';
import assign from 'object-assign';
import { CircularProgress, RadioButtonGroup, RadioButton } from 'material-ui';
import { formStatus } from '../../constants/FormStatus.jsx';
import { Map, List } from 'immutable';
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
import Dialog from '../../controls/NewDialog.jsx';
import Factor09Detail from './Factor09Detail.jsx';
import Factor085Detail from './Factor085Detail.jsx';
var createReactClass = require('create-react-class');
var d2j = CommonFuns.DataConverter.DatetimeToJson;
function emptyMap() {
  return new Map();
}
function emptyList() {
  return new List();
}
var Cost = createReactClass({
  propTypes: {
    formStatus: PropTypes.string,
    name: PropTypes.string,
    hierarchyId: PropTypes.number,
    onUpdate: PropTypes.func,
    setEditBtnStatus: PropTypes.func,
    onShowFooter: PropTypes.func,
  },
  //mixins: [React.addons.LinkedStateMixin, ViewableTextFieldUtil],
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
  _handlerSave: function(refresh = true) {
    var cost = this.state.cost.toJS();
    cost.Name = this.props.name;
    if (refresh) {
      this.props.onShowFooter(false);
      this.setState({
        isLoading: true
      });
    }

    return cost;

  },
  _onChange: function() {
    var that = this;
    this.props.onShowFooter(true);
    this.setState({
      cost: HierarchyStore.getCost(),
      isLoading: false
    }, () => {
      that._onCheckDisabled();
    })
  },
  _formatTime(time) {
    var h = Math.floor(time / 60),
      m = time % 60;
    return ((h < 10) ? '0' : '') + h + ':' + ((m < 10) ? '0' : '') + m
  },
  _onCheckDisabled: function() {
    var mData = this.state.cost.get('CostCommodities'),
        touTariffs=this.state.cost.get('TouTariffs'),
      flag = false;
    if (mData !== null) {
      mData.forEach(data => {
        if (data.get('CommodityId') === 1) {
          let items = data.get('Items');
          items.forEach(item => {
            if (item.get('ComplexItem') === null) {
              let price = item.getIn(['SimpleItem', 'Price']);
              if (!price || price === '' || !Regex.FactorRule.test(price) || price.length > 16) {
                flag = true;
              }
            }else{
              if(touTariffs.size===0){flag = true;}
            }

          })
        } else {
          let price = data.getIn(['Items', 0, 'SimpleItem', 'Price']);
          if (!price || price === '' || !Regex.FactorRule.test(price) || price.length > 16) {
            flag = true;
          }

        }
      })
    }
    if (HierarchyStore.getCostErrorStatus()) {
      flag = true;
    }
    this.props.setEditBtnStatus(flag);
  },
  merge: function(data) {

    var {status, path, value, index} = data,
      that = this,
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
      if (paths[paths.length - 1] === 'ComplexItem') {
        mData = mData.setIn(paths, value);
        paths.pop();
        paths.push('SimpleItem');
        mData = mData.setIn(paths, null);
      } else if (paths[paths.length - 1] === 'SimpleItem') {
        mData = mData.setIn(paths, value);
        paths.pop();
        paths.push('ComplexItem');
        mData = mData.setIn(paths, null);
      } else if (paths[paths.length - 1] === 'DemandCostType') {
        mData = mData.setIn(paths, value);
        if (value === 1) {
          paths[paths.length - 1] = 'HourPrice';
          let pricePath = assign([], paths);
          paths[paths.length - 1] = 'HourTagId';
          let tagPath = assign([], paths);
          mData = mData.setIn(pricePath, null);
          mData = mData.setIn(tagPath, null);
        } else {
          paths[paths.length - 1] = 'TransformerCapacity';
          let capPath = assign([], paths);
          paths[paths.length - 1] = 'TransformerPrice';
          let pricePath = assign([], paths);
          paths[paths.length - 1] = 'HourTagId';
          let tagIdPath = assign([], paths);
          mData = mData.setIn(capPath, null);
          mData = mData.setIn(pricePath, null);
          mData = mData.setIn(tagIdPath, null);
        }
      } else if (paths[paths.length - 1] === 'CommodityId') {
        mData = mData.setIn(paths, value);
        paths[paths.length - 1] = 'UomId';
        mData = mData.setIn(paths, HierarchyStore.findUOMIdById(value));
      } else {
        mData = mData.setIn(paths, value);
      }
    }
    mData = HierarchyStore.checkoutCostErrorMsg(mData);
    this.setState({
      cost: mData
    }, () => {
      that._onCheckDisabled();
    });
  },
  _handelAddPower: function() {
    var costCommodities = this.state.cost.get('CostCommodities'),
      that = this,
      power = emptyMap(),
      index = -1;
    if (costCommodities !== null) {
      power = costCommodities.find(item => (item.get('CommodityId') === 1));
      index = costCommodities.findIndex(item => (item.get('CommodityId') === 1));
    }
    if (index === -1) {
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
          EffectiveDate: d2j(new Date())
        }],
        UomId: 9
      })
    });
  },
  _handerDeleteOthers: function(id) {
    this.merge({
      status: dataStatus.DELETED,
      path: 'CostCommodities' + '.' + id
    })
  },
  _onPowerPriceChange: function(value, index, id) {
    var simpleItem,
      complexItem,
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
        DemandCostType: 1,
        TouTariffId: that.state.cost.getIn(['TouTariffs', 0, 'Id']),
        FactorType: 1,
        RealTagId: null,
        ReactiveTagId: null
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
      validate: (value) => {
        if (value === '' || value) {
          if (value === '') {
            return I18N.Common.Label.MandatoryEmptyError;
          }
          if (!Regex.FactorRule.test(value) || value.length > 16) {
            return I18N.Setting.CarbonFactor.ErrorContent;
          }

        }

      },
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
        marginTop: '10px'
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
                  {I18N.Setting.TOUTariff.PlainPrice + ' : ' + item.get('Price') + ' ' + I18N.Setting.Cost.PowerUOM}
                </div>
            )
          } else if (item.get('ItemType') === 1) {
            items.push(
              <div className='jazz-building-cost-tou-item'>
                  {I18N.Setting.TOUTariff.PeakPrice + ' : ' + item.get('Price') + ' ' + I18N.Setting.Cost.PowerUOM}
                </div>
            );
            let times = [];
            item.get('TimeRange').forEach(time => {
              times.push(<div>{that._formatTime(time.get('Item1')) + ' - ' + that._formatTime(time.get('Item2'))}</div>)
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
                  {I18N.Setting.TOUTariff.ValleyPrice + ' : ' + item.get('Price') + ' ' + I18N.Setting.Cost.PowerUOM}
                </div>
            );
            let times = [];
            item.get('TimeRange').forEach(time => {
              times.push(<div>{that._formatTime(time.get('Item1')) + ' - ' + that._formatTime(time.get('Item2'))}</div>)
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
        var peakItems = [];
        peakItems.push(<div className='jazz-building-cost-tou-item'>
                        {I18N.Setting.TOUTariff.PulsePeakPrice + ' : ' + peakTariff.get('Price') + ' ' + I18N.Setting.Cost.PowerUOM}
                      </div>);
        peakTariff.get('TimeRanges').forEach(time => {
          peakItems.push(<div className='jazz-building-cost-tou-item'>
                          {I18N.Setting.TOUTariff.PulsePeak + ' : ' + time.get('StartMonth') + I18N.Setting.Cost.Month + time.get('StartDay') + I18N.Setting.Cost.Day + I18N.Setting.Cost.To}
                          {time.get('EndMonth') + I18N.Setting.Cost.Month + time.get('EndDay') + I18N.Setting.Cost.Day}
                        </div>);
          peakItems.push(<div className='jazz-building-cost-tou-item'>
                                        {I18N.Setting.TOUTariff.PeakValueTimeRange + ' : ' + that._formatTime(time.get('StartTime')) + ' - ' + that._formatTime(time.get('EndTime'))}
                                      </div>);

        })
        return (
          <div>{peakItems}</div>
          )
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
          <div className={classnames({
          'jazz-building-cost-tou-item': true,
          'hiddenEllipsis': true
        })} style={{
          maxWidth: '270px'
        }}>
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
        <Dialog open={this.state.showPowerFactorDialog}  modal={false} onRequestClose={closeDialog}>
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
        titleStyle:{fontSize:'14px'},
        iconStyle:{width:'24px',height:'24px',padding:'12px 0 0 0'},
        style: {
          width: '300px'
        },
        didChanged: value => {
          that.merge({
            path: path + 'TouTariffId',
            value: that.state.cost.get('TouTariffs').getIn([value, 'Id'])
          })
        }
      };
      return (
        that.state.cost.get('TouTariffs').size===0?<div>
          <div style={{fontSize:'14px',color: '#9fa0a4',marginBottom: '6px',marginTop: '30px'}}>{I18N.Setting.Cost.UsageCost}</div>
          <div style={{fontSize:'14px',color: '#626469'}}>{I18N.Setting.Cost.NoCost}</div>
        </div>
        :<div style={{
          display: 'flex',
          flexDirection: 'row',
          marginTop: '30px',
          alignItems:'flex-end'
        }}>
        <div className='jazz-building-cost-usagecost'><ViewableDropDownMenu  {...touTariffProps} /></div>

                <div className='jazz-building-cost-detailShow' style={{
          marginBottom: isView?'0px':'19px',
          marginLeft: '20px'
        }} onClick={that._showTouDetailsideNav.bind(this, selectedId)}>{I18N.Setting.Cost.SearchTouDetail}</div>
              </div>
        )
    };

    return (
      <div>
        {renderUsageCost()}
      </div>
      )
  },
  _renderPower: function(power = emptyMap(), id) {
    var isView = this.props.formStatus === formStatus.VIEW,
      items = [],
      that = this;
    if (power.size !== 0) {
      power.get('Items').forEach((item, index) => {
        var deleteProps = {
          isDelete: !isView,
          onDelete: () => {
            that._handleDeletePower(index);
          }
        };
        var date = item.get('EffectiveDate'),
          errorMsg = item.get('ErrorMsg');
        var complexItem = item.get('ComplexItem'),
          defaultSelected = complexItem === null ? 'simpleItem' : 'complexItem';
        var dateProps = {
          ref: 'date',
          key: this.props.hierarchyId + '_power' + index + 'RandomId' + Math.random(),
          isViewStatus: isView,
          date: date,
          errorMsg: errorMsg,
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
            'flexDirection': 'row',
            marginTop: '15px'
          },
          leftradioButton: {
            fontSize: '14px',
            color: '#464949',
            width: '200px'
          },
          rightradioButton: {
            fontSize: '14px',
            color: '#464949',
          },
        };
        items.unshift(
          <div className='jazz-carbon-factorItem' key={'power_simple_' + index} style={{
            marginLeft: '0'
          }}>
            <DeletableItem {...deleteProps}>
            <YearMonthItem {...dateProps}/>
            <div className='jazz-fromenddate-item-text'>{I18N.Setting.Cost.PriceType}</div>
              <RadioButtonGroup name="price" valueSelected={defaultSelected} onChange={(event, value) => {
            this._onPowerPriceChange(value, id, index)
          }} style={styles.group}>
                <RadioButton
          value="simpleItem"
          label={I18N.Setting.Cost.FixedPrice}
          style={styles.leftradioButton}
          iconStyle={{marginRight:'12px'}}
          disabled={isView}
          />
                <RadioButton
          value="complexItem"
          label={I18N.Setting.Cost.ComplexPrice}
          style={styles.rightradioButton}
          iconStyle={{marginRight:'12px'}}
          disabled={isView}
          />
              </RadioButtonGroup>
              {defaultSelected === 'simpleItem' ? this._renderSimpleItem(item, index) : this._renderComplexItem(item, index)}
            </DeletableItem>
          </div>
        )
      });

    }


    return (
      <div>
        <div className={classnames({
        "jazz-carbon-addItem": true,
        "jazz-hide": isView && power.size === 0
      })}>
          <div style={{
        color: '#464949'
      }}>{I18N.Common.Commodity.Electric}</div>
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
    if (costCommodities !== null) {
      costCommodities.forEach((commodity, id) => {
        var {CommodityId, Items, UomId} = commodity.toJS();
        if (CommodityId !== 1) {
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
                that.merge({
                  path: 'CostCommodities' + '.' + id + '.' + 'CommodityId',
                  value: HierarchyStore.getCommodities()[value].Id
                })
              }
            },
            dateProps = {
              ref: 'date',
              key: this.props.hierarchyId + '_commodity' + id + 'RandomId' + Math.random(),
              isViewStatus: isView,
              date: Items[0].EffectiveDate,
              errorMsg: Items[0].ErrorMsg,
              onDateChange: date => {
                that.merge(
                  {
                    path: 'CostCommodities' + '.' + id + '.' + 'Items' + '.' + '0' + '.' + 'EffectiveDate',
                    value: date
                  }
                )
              }
            },
            priceProps = {
              ref:id+""+Immutable.fromJS(Items).getIn([0, 'SimpleItem', 'Price']),
              defaultValue: Immutable.fromJS(Items).getIn([0, 'SimpleItem', 'Price']) || '',
              isViewStatus: isView,
              title: I18N.MainMenu.Price + '(' + I18N.Setting.Cost.PriceUom + '/' + HierarchyStore.findUOMById(UomId) + ')',
              didChanged: value => {
                that.merge({
                  path: 'CostCommodities' + '.' + id + '.' + 'Items' + '.' + '0' + '.' + 'SimpleItem' + '.' + 'Price',
                  value: value
                })
              },
              validate: (value) => {
                if (value === '' || value) {
                  if (value === '') {
                    return I18N.Common.Label.MandatoryEmptyError;
                  }
                  if (!Regex.FactorRule.test(value) || value.length > 16) {
                    return I18N.Setting.CarbonFactor.ErrorContent;
                  }

                }
              },
              unit: ' ' + I18N.Setting.Cost.PriceUom + '/' + HierarchyStore.findUOMById(UomId)
            };
          var deleteProps = {
            isDelete: !isView,
            onDelete: () => {
              that._handerDeleteOthers(id);
            }
          };
          commodityItems.push(
            <div className='jazz-carbon-factorItem' style={{
              marginLeft: '0'
            }}>
                  <DeletableItem {...deleteProps}>
                    <div style={{
              marginTop: '25px'
            }}><ViewableDropDownMenu {...commodityProps}/></div>
                    <div style={{
              marginTop: '30px'
            }}><YearMonthItem {...dateProps}/></div>
                    <div style={{
              marginTop: '30px'
            }}><ViewableNumberField {...priceProps}/></div>

                    </DeletableItem>
                  </div>
          )
        }
      })
    }

    return (
      <div style={{
        marginTop: '25px'
      }}>
        <div className={classnames({
        "jazz-carbon-addItem": true,
        "jazz-hide": isView && commodityItems.length === 0
      })}>
          <div style={{
        color: '#464949'
      }}>{I18N.Setting.Cost.OtherCommodities}</div>
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
    if (costCommodities !== null) {
      power = costCommodities.find(item => (item.get('CommodityId') === 1));
      index = costCommodities.findIndex(item => (item.get('CommodityId') === 1));
    }

    return (
      <div className='jazz-vee-monitor-tag-background'>
        <div className='pop-manage-detail-content' style={{
        padding: '0'
      }}>
          {that._renderPower(power, index)}
          {that._renderOthers()}
        </div>



        </div>
      )
  },
  _renderContent: function() {
    var that = this,
      {CostCommodities} = this.state.cost.toJS();
    if (CostCommodities === null) {
      if (this.props.formStatus === formStatus.VIEW) {
        return (
          <div style={{
            color: '#464949',
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
    } else if (CostCommodities.length === 0 && this.props.formStatus === formStatus.VIEW) {
      return (
        <div style={{
          color: '#464949',
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
    //this.initBatchViewbaleTextFiled();
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
            <CircularProgress  mode="indeterminate" size={80} />
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
