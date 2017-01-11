import React, { Component } from 'react';
import CircularProgress from 'material-ui/CircularProgress';

import LinkButton from 'controls/LinkButton.jsx';

export default class ReportChart extends Component {
	render() {
		let {data, url, onEdit, onDelete, onSetFirst, onDownload} = this.props,
		id = data.get('Id');
		if( !url ) {
			return (<div className='jazz-report-chart-table-wrapper flex-center' style={{height: 600}}><CircularProgress mode="indeterminate" size={80} /></div>);
		}
		return (
			<div className='jazz-report-chart-table-wrapper'>
				<div className='jazz-report-chart-table-header'>
					<ul className='jazz-report-chart-table-header-action'>
						<li><LinkButton onClick={() => onEdit(id)} label={'设置'}/></li>|
						<li><LinkButton onClick={() => onDelete(id)} label={'删除'}/></li>|
						<li><LinkButton onClick={() => onSetFirst(id)} label={'设置为首个报表'}/></li>
					</ul>
					<div>{data.get('Name')}</div>
					<LinkButton onClick={() => onDownload(id)} iconName='download-icon' label={'下载'}/>
				</div>
				<iframe 
					src={`https://view.officeapps.live.com/op/view.aspx?src=${encodeURIComponent(url)}`}
					border="0" 
					height='600'
					width='100%'/>
			</div>
		);
	}
}
