import React, { Component } from 'react';
import CircularProgress from 'material-ui/CircularProgress';

import LinkButton from 'controls/LinkButton.jsx';

import CurrentUserStore from 'stores/CurrentUserStore.jsx';
import privilegeUtil from 'util/privilegeUtil.jsx';
import PermissionCode from 'constants/PermissionCode.jsx';

function isFull() {
	return privilegeUtil.isFull(PermissionCode.INDEX_AND_REPORT, CurrentUserStore.getCurrentPrivilege());
}
export default class ReportChart extends Component {
	render() {
		let {data, url, onEdit, onDelete, onSetFirst, onDownload} = this.props,
		id = data.get('Id');
		if( url === null ) {
			return (<div className='jazz-report-chart-table-wrapper flex-center' style={{height: 600}}><CircularProgress mode="indeterminate" size={80} /></div>);
		}
		// if( url === false ) {
		// 	return (<div className='jazz-report-chart-table-wrapper flex-center' style={{height: 600}}><b>{'无效模板'}</b></div>);
		// }

		return (
			<div className='jazz-report-chart-table-wrapper'>
				<div className='jazz-report-chart-table-header'>
					<ul className='jazz-report-chart-table-header-action' style={{
						width: url ? false : 100
					}}>
						{isFull() && <li><LinkButton onClick={() => onEdit(id)} label={'设置'}/></li>}{isFull() && '|'}
						{isFull() && <li><LinkButton onClick={() => onDelete(id)} label={'删除'}/></li>}{isFull() && url && '|'}
						<li>{url && <LinkButton onClick={() => onSetFirst(id)} label={'设为首个报表'}/>}</li>
					</ul>
					<div>{data.get('Name')}</div>
					<div>{url && <LinkButton onClick={() => onDownload(id)} iconName='download-icon' label={'下载'}/>}</div>
				</div>
				{url ? <iframe
					src={`https://view.officeapps.live.com/op/view.aspx?src=${encodeURIComponent(url)}`}
					border="0"
					height='550'
					width='100%'/> :
					<div style={{height: 600}} className='flex-center'><b>{'无效模板'}</b></div>}
			</div>
		);
	}
}
