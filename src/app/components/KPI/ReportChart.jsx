import React, { Component } from 'react';
import CircularProgress from 'material-ui/CircularProgress';

import LinkButton from 'controls/LinkButton.jsx';

import CurrentUserStore from 'stores/CurrentUserStore.jsx';
import privilegeUtil from 'util/privilegeUtil.jsx';
import PermissionCode from 'constants/PermissionCode.jsx';

function isFull() {
	return privilegeUtil.isFull(PermissionCode.INDEX_AND_REPORT, CurrentUserStore.getCurrentPrivilege());
}

function onload() {

	var scrollListener = function(e) {
		let src = e.srcElement;
		if( e.deltaY < 0 ) {
			if( e.currentTarget.getElementById && e.currentTarget.getElementById('m_excelWebRenderer_ewaCtl_sheetContentDiv') && e.currentTarget.getElementById('m_excelWebRenderer_ewaCtl_sheetContentDiv').scrollTop === 0 ) {
				e.preventDefault();
			}
		}
	}
	var subIframe = document.getElementById('iframe1').contentWindow
					.document.getElementById('wacframe');
	subIframe.onload = function() {
		var w = subIframe.contentWindow;
		var d = w.document;
		if(d.addEventListener){
			d.addEventListener('DOMMouseScroll', scrollListener, false);
		}
		w.onmousewheel = d.onmousewheel = scrollListener;
	}
}

export default class ReportChart extends Component {
	render() {
		let {data, url, onEdit, onDelete, onSetFirst, onDownload} = this.props,
		id = data.get('Id');
		if( url === null ) {
			return (<div className='jazz-report-chart-table-wrapper flex-center' style={{height: 600}}><CircularProgress mode="indeterminate" size={80} /></div>);
		}

		return (
			<div className='jazz-report-chart-table-wrapper'>
				<div className='jazz-report-chart-table-header'>
					<ul className='jazz-report-chart-table-header-action' style={{
						width: url ? false : 100
					}}>
						{isFull() && <li><LinkButton iconName='icon-edit' onClick={() => onEdit(id)} label={'编辑'}/></li>}
						{isFull() && <li><LinkButton iconName='icon-delete' onClick={() => onDelete(id)} label={'删除'}/></li>}
						<li>{url && <LinkButton iconName='icon-check-circle' onClick={() => onSetFirst(id)} label={'设为首个报表'}/>}</li>
					</ul>
					<li>{url && <LinkButton iconName='icon-download' onClick={() => onDownload(id)} label={'下载'}/>}</li>
				</div>
				{url ? <iframe
					id='iframe1'
					onLoad={onload}
					onMouseOut={(e) => {
						if( e.currentTarget.nextElementSibling.type === 'checkbox' ) {
							e.currentTarget.nextElementSibling.checked = false;
						}
					}}
					src={`https://view.officeapps.live.com/op/view.aspx?src=${encodeURIComponent(url)}`}
					border="0"
					height='550'/> :
					<div style={{height: 600}} className='flex-center'><b>{'无效模板'}</b></div>}
				<input type='checkbox' className='jazz-report-chart-overlay-iframe'/>
			</div>
		);
	}
}