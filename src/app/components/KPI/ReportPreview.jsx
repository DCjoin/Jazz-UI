import React, { Component } from 'react';
import classnames from 'classnames';
import CircularProgress from 'material-ui/CircularProgress';

import util from 'util/Util.jsx';
import SwitchBar from 'controls/SwitchBar.jsx';

import ReportChart from './ReportChart.jsx';

import ReportAction from 'actions/ReportAction.jsx';

import ReportStore from 'stores/ReportStore.jsx';

export default class ReportPreview extends Component {
	constructor(props) {
		super(props);

		this.state = this._getInitialState();

		this._selectReport = this._selectReport.bind(this);
		this._onPreActopn = this._onPreActopn.bind(this);
		this._onGetPreviewUrl = this._onGetPreviewUrl.bind(this);
		this._onEdit = this._onEdit.bind(this);
		this._onDelete = this._onDelete.bind(this);
		this._onSetFirst = this._onSetFirst.bind(this);
		this._onDownload = this._onDownload.bind(this);

		this._preAction(this.props.router.params.customerId);

		ReportStore.addReportListChangeListener(this._onPreActopn);
		ReportStore.addSelctedPreviewUrlChange(this._onGetPreviewUrl);

	}
	componentWillReceiveProps(nextProps) {
		if( !util.shallowEqual(nextProps.router.params, this.props.router.params)
		 || !util.shallowEqual(nextProps.router.location.query, this.props.router.location.query) ) {
			this._preAction(nextProps.router.params.customerId);
		}
	}
	componentWillUnmount() {
		ReportStore.removeReportListChangeListener(this._onPreActopn);
		ReportStore.removeSelctedPreviewUrlChange(this._onGetPreviewUrl);
	}
	_getInitialState() {
		return {
			year: new Date().getFullYear(),
			selectedReprotId: null,
			url: null,
		}
	}
	_preAction() {
		ReportAction.getReportListByCustomerId(this.props.hierarchyId, 'createTime', 'asc');
	}
	_onPreActopn() {
		if( ReportStore.getReportList().size > 0 ) {
			this._selectReport(ReportStore.getReportList().getIn([0, 'Id']));
		}
	}
	_selectYear(year) {
		this.setState({year}, () => this._selectReport(ReportStore.getReportList().getIn([0, 'Id'])));
	}
	_selectReport(selectedReprotId) {
		this.setState({selectedReprotId, url: null}, ()=>{
			if(selectedReprotId) {
				ReportAction.getPreviewUrl( selectedReprotId, this.state.year );
			}
		});
	}
	_onGetPreviewUrl() {
		this.setState({
			url: ReportStore.getSelctedPreviewUrl()
		});
	}
	_getDateLabel() {
		return this.state.year;
	}
	_getSelectedReportById() {
		return ReportStore.getReportList().find( report => report.get('Id') === this.state.selectedReprotId );
	}
	_onEdit(reportId) {
		this.props.showReportEdit(this._getSelectedReportById());
	}
	_onDelete(reportId) {
		
	}
	_onSetFirst(reportId) {
		this.setState({selectedReprotId: null}, () => {
			ReportAction.setFirst(this.props.hierarchyId, reportId);
		});
	}
	_onDownload(reportId) {
		ReportAction.download(this.props.hierarchyId, reportId);
	}
	render() {
		let onLastMonth, onNextMonth, currentYear = new Date().getFullYear();
		let selectedReport = this._getSelectedReportById();
		if( !ReportStore.getReportList() || !selectedReport ) {
			return (<div className='flex-center'><CircularProgress mode="indeterminate" size={80} /></div>);
		}
		if(this.state.year > currentYear - 3 ){
			onLastMonth = () => {
				this._selectYear(this.state.year - 1);
			}
		}
		if(this.state.year < currentYear ){
			onNextMonth = () => {
				this._selectYear(this.state.year + 1);
			}
		}
		return (
			<div>
				<SwitchBar 
					className='switch-year'
        			label={this._getDateLabel()}
        			onLeft={onLastMonth}
        			onRight={onNextMonth}/>
				<div className='jazz-report-chart'>
					<div className='jazz-report-chart-header'>
						{ReportStore.getReportList().map(report => 
						<div className={classnames('tab', {
							selected: this.state.selectedReprotId === report.get('Id')
						})} onClick={() => {this._selectReport(report.get('Id'))}}>{report.get('Name')}</div>).toJS()}
					</div>
					<ReportChart 
						onEdit={this._onEdit}
						onDelete={this._onDelete}
						onSetFirst={this._onSetFirst}
						onDownload={this._onDownload}
						url={this.state.url}
						data={selectedReport}
						/>
				</div>
			</div>
		);
	}
}
