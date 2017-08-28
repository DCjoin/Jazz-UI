import React, { Component } from 'react';

import util from 'util/Util.jsx';

import {getConfigByCommodityId} from './effect_report.jsx';

export default class BuildingTable extends Component {
	render() {
		let {BuildingName, CommoditySavings} = this.props;
		return (
			<div className='effect-table'>
				<header className='effect-table-header'><em className='icon-building'/>{BuildingName}</header>
				<table className='effect-table-content'>
					<tr>
						<th className='effect-table-th'></th>
						<th className='effect-table-th'>{I18N.SaveEffect.Table.SavingCost}</th>
						<th className='effect-table-th'>{I18N.SaveEffect.Table.SavingValue}</th>
						<th className='effect-table-th'>{I18N.SaveEffect.Table.SavingRate}</th>
					</tr>
					{CommoditySavings.map(({CommodityId, SavingCost, SavingValue, SavingRate, UomId}) => (
					<tr>
						<td className='effect-table-td'>
							<em className={getConfigByCommodityId(CommodityId).icon} style={{fontSize: '24px',color: getConfigByCommodityId(CommodityId).color}}/>{getConfigByCommodityId(CommodityId).name}
						</td>
						<td className='effect-table-td'>{util.isNumber(SavingCost) ? util.getLabelData(SavingCost) + ' RMB' : '-'}</td>
						<td className='effect-table-td'>{util.isNumber(SavingValue) ? util.getLabelData(SavingValue) + ' ' + util.getUomById(UomId).Code : '-'}</td>
						<td className='effect-table-td'>{util.isNumber(SavingRate) ? SavingRate * 100 + ' %' : '-'}</td>
					</tr>
					) )}
				</table>
			</div>
		);
	}
}
