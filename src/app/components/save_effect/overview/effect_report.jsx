import React, { Component } from 'react';

import classnames from 'classnames';
import find from 'lodash-es/find';

import util from 'util/Util.jsx';

import AllCommodityStore from 'stores/AllCommodityStore.jsx';

import BuildChart from '../chart/building_chart.jsx';
import CustomerChart from '../chart/customer_chart.jsx';

const CommodityMap = {
  ElectricOther: 1,
  Water: 2,
  Gas: 3,
  CoolQ: 9,
  HeatQ: 8,
  LiquidGas: 14,
  CoalOther: 10,
  DieselOil: 7,
  HeavyOil: 15,
  Kerosene: 11,
};

function getCommodityNameById(commodityId){
  return {
    [1]: I18N.Common.Commodity.ElectricOther,
    [2]: I18N.Common.Commodity.Water,
    [3]: I18N.Common.Commodity.Gas,
    [5]: I18N.Common.Commodity.Petrol,
    [7]: I18N.Common.Commodity.DieselOil,
    [11]: I18N.Common.Commodity.Kerosene,
    [9]: I18N.Common.Commodity.CoolQ,
    [8]: I18N.Common.Commodity.HeatQ,
    [10]: I18N.Common.Commodity.CoalOther,
    [13]: I18N.Common.Commodity.Cost,
    [14]: I18N.Common.Commodity.LiquidGas,
    [15]: I18N.Common.Commodity.HeavyOil,
    [16]: I18N.Common.Commodity.Carbon,
    [17]: I18N.Common.Commodity.StandardCoal,
  }[commodityId];
}

export function getConfigByCommodityId(commodityId) {

  switch(commodityId) {
    case CommodityMap.ElectricOther:
      return {
        name: I18N.Common.Commodity.ElectricOther,
        reportName: I18N.Common.Commodity.ElectricOther + I18N.SaveEffect.Saving3,
        icon: 'icon-electricity',
        color: '#4CAF50',
      };
      break;
    case CommodityMap.Water:
      return {
        name: I18N.Common.Commodity.WaterOther,
        reportName: I18N.Common.Commodity.WaterOther + I18N.SaveEffect.Saving2,
        icon: 'icon-water',
        color: '#2196f3',
      };
      break;
    case CommodityMap.Gas:
      return {
        name: I18N.Common.Commodity.Gas,
        reportName: I18N.Common.Commodity.Gas + I18N.SaveEffect.Saving3,
        icon: 'icon-gas',
        color: '#6C7FFE',
      };
      break;
    case CommodityMap.CoolQ:
      return {
        name: I18N.Common.Commodity.CoolQ,
        reportName: I18N.Common.Commodity.CoolQ + I18N.SaveEffect.Saving3,
        icon: 'icon-cool',
        color: '#86BAFD',
      };
      break;
    case CommodityMap.HeatQ:
      return {
        name: I18N.Common.Commodity.HeatQ,
        reportName: I18N.Common.Commodity.HeatQ + I18N.SaveEffect.Saving3,
        icon: 'icon-heat',
        color: '#FFB300',
      };
      break;
    case CommodityMap.LiquidGas:
      return {
        name: I18N.Common.Commodity.LiquidGas,
        reportName: I18N.Common.Commodity.LiquidGas + I18N.SaveEffect.Saving3,
        icon: 'icon-liquefied-gas',
        color: '#82e2ff',
      };
      break;
    case CommodityMap.CoalOther:
      return {
        name: I18N.Common.Commodity.CoalOther,
        reportName: I18N.Common.Commodity.CoalOther + I18N.SaveEffect.Saving3,
        icon: 'icon-coal',
        color: '#7A91B5',
      };
      break;
    case CommodityMap.DieselOil:
      return {
        name: I18N.Common.Commodity.DieselOil,
        reportName: I18N.Common.Commodity.DieselOil + I18N.SaveEffect.Saving3,
        icon: 'icon-diesel',
        color: '#ab47bc',
      };
      break;
    case CommodityMap.HeavyOil:
      return {
        name: I18N.Common.Commodity.HeavyOil,
        reportName: I18N.Common.Commodity.HeavyOil + I18N.SaveEffect.Saving3,
        icon: 'icon-diesel',
        color: '#009688',
      };
      break;
    case CommodityMap.Kerosene:
      return {
        name: I18N.Common.Commodity.Kerosene,
        reportName: I18N.Common.Commodity.Kerosene + I18N.SaveEffect.Saving3,
        icon: 'icon-diesel',
        color: '#795548',
      };
      break;
    default:
      let name = find(AllCommodityStore.getAllCommodities(), comm => comm.Id === commodityId).Comment;
      // let name = getCommodityNameById(commodityId) || I18N.Setting.ECM.Other;
      return {
        name,
        reportName: name + I18N.SaveEffect.Saving3,
        icon: 'icon-other',
        color: '#59715b',
      };
      break;
  }
}

export default class EffectReport extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isStack: true
    };
  }
	render() {
    let {data, year, isCustomer} = this.props,
    config = getConfigByCommodityId(data.CommodityId),
    isStack = this.state.isStack,
    isWater = data.CommodityId === CommodityMap.Water,
    currentYear = year === new Date().getFullYear(),

    Comp = BuildChart;
    if( isCustomer ) {
      Comp = CustomerChart;
    }

		return (
			<div className='save-effect-report'>
				<header className='save-effect-report-header'>
          <div className='save-effect-report-name'>
            <em className={'save-effect-report-icon ' + config.icon} style={{color: config.color}} />
            <span>{config.reportName}</span>
          </div>
          <div className='save-effect-report-actions'>
            <a href='javascript:void(0)' className={classnames('save-effect-report-actions-item', {active: isStack})} onClick={() => {
              this.setState({
                isStack: true
              });
            }}>
              <em className='action-icon icon-area-chart1'/>
              <span>{I18N.Setting.Tag.isAccumulated}</span>
            </a>
            <a href='javascript:void(0)' className={classnames('save-effect-report-actions-item', {active: !isStack})} onClick={() => {
              this.setState({
                isStack: false
              });
            }}>
              <em className='action-icon icon-stacked-chart2'/>
              <span>{I18N.SaveEffect.Chart.ByMonthValue}</span>
            </a>
          </div>
        </header>
				<div className='save-effect-report-content'>
					<ul className='save-effect-report-content-sum'>
            <li className='save-effect-report-content-sum-item'>
              <div>
                <header className='report-sum-header hiddenEllipsis'>
                  <em className='report-sum-icon icon-cost_saving'/>
                  <span>{I18N.SaveEffect.Table.SavingCost}</span>
                </header>
                <div className='report-sum-content'>
                  <span className='report-sum-value'>{util.getLabelData(data.SavingCost)}</span>
                  <span className='report-sum-unit'>{'RMB'}</span>
                </div>
              </div>
            </li>
            <li className='save-effect-report-content-sum-item'>
              <div>
                <header className='report-sum-header hiddenEllipsis'>
                  <em className='report-sum-icon icon-energy_saving'/>
                  <span>{
                    (isWater ? I18N.SaveEffect.Chart.SavingWaterValue : I18N.SaveEffect.Chart.SavingValue)
                    + (currentYear ? '/' : '') +
                    (currentYear ? (isWater ? I18N.SaveEffect.Chart.PredictSavingWater : I18N.SaveEffect.Chart.PredictSaving) : '')
                }</span>
                </header>
                <div className='report-sum-content'>
                  <span className='report-sum-value'>{util.getLabelData(data.EnergySaving) + (currentYear ? '/' : '') + (currentYear ? util.getLabelData(data.PredictionSaving): '')}</span>
                  <span className='report-sum-unit'>{util.getUomById(data.UomId).Code}</span>
                </div>
              </div>
            </li>
            <li className='save-effect-report-content-sum-item'>
              <div>
                <header className='report-sum-header hiddenEllipsis'>
                  <em className='report-sum-icon icon-energy-saving-rate'/>
                  <span>{isWater ? I18N.SaveEffect.Chart.SavingWaterRate : I18N.SaveEffect.Chart.SavingRate}</span>
                </header>
                <div className='report-sum-content'>
                  <span className='report-sum-value'>{
                    (currentYear || data.EnergySavingRate === null) ? '-' : util.toFixed(data.EnergySavingRate * 100, 1) + '%'
                  }</span>
                </div>
              </div>
            </li>
            {data.CommodityId !== CommodityMap.Water && <li className='save-effect-report-content-sum-item'>
              <div>
                <header className='report-sum-header hiddenEllipsis'>
                  <em className='report-sum-icon icon-kgce'/>
                  <span>{I18N.SaveEffect.SavingCoalValue}</span>
                </header>
                <div className='report-sum-content'>
                  <span className='report-sum-value'>{util.getLabelData(data.SavingStandardCoal)}</span>
                  <span className='report-sum-unit'>{'kgce'}</span>
                </div>
              </div>
            </li>}
          </ul>
          <Comp currentYear={currentYear} isStack={isStack} isWater={isWater} data={data} color={config.color}/>
				</div>
			</div>
		);
	}
}
