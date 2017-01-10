import React, { Component } from 'react';

export default class ReportChart extends Component {
	render() {
		return (
			<div className='jazz-report-chart'>
				<div className='jazz-report-chart-header'>
					<div className='jazz-report-chart-table-header'>{'瑞吉能源成本统计表'}</div>
					<div>{'瑞吉与物业越用电量结算'}</div>
					<div>{'空调机房用电统计'}</div>
				</div>
				<div className='jazz-report-chart-table-wrapper'>
					<iframe 
						src="https://view.officeapps.live.com/op/view.aspx?src=http%3A%2F%2Fsejazz-test.oss-cn-hangzhou.aliyuncs.com%2FChina_Conclusions.xlsx" 
						border="0" 
						height='600'
						width='100%'/>
				</div>
			</div>
		);
	}
}
