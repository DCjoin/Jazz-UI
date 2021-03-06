import React, { Component } from 'react';
import classnames from 'classnames';
import CircularProgress from 'material-ui/CircularProgress';

import util from 'util/Util.jsx';
import RoutePath from 'util/RoutePath.jsx';
import SwitchBar from 'controls/SwitchBar.jsx';
import LinkButton from 'controls/LinkButton.jsx';
import FlatButton from 'controls/FlatButton.jsx';
import NewDialog from 'controls/NewDialog.jsx';

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

		this._preAction();

		ReportStore.addReportListChangeListener(this._onPreActopn);
		ReportStore.addSelctedPreviewUrlChange(this._onGetPreviewUrl);

	}
	componentWillReceiveProps(nextProps) {
		if( !util.shallowEqual(nextProps.router.params, this.props.router.params)
		 || this.props.hierarchyId !== nextProps.hierarchyId ) {
			this._preAction(nextProps.hierarchyId);
		}
	}
	componentWillUnmount() {
		ReportStore.removeReportListChangeListener(this._onPreActopn);
		ReportStore.removeSelctedPreviewUrlChange(this._onGetPreviewUrl);
	}
	_getInitialState() {
		return {
			year: new Date().getFullYear(),
			reportList: null,
			selectedReprotId: null,
			url: null,
			showDeleteDialog: false,
		}
	}
	update(selectedReprotId) {
		this._preAction();
		this.setState({
			year: this.state.year,
			reportList: this.state.reportList,
			selectedReprotId: selectedReprotId || null,
			url: null,
		});
	}
	_preAction(hierarchyId = this.props.hierarchyId) {
		this.setState(this._getInitialState());
		ReportAction.getReportListByCustomerId(hierarchyId, 'CreateTime', 'asc', 1);
	}
	_onPreActopn() {

		let configCB = this.props.configCB;
		if( configCB ) {
			if( ReportStore.getReportList().size == 0 ) {
				configCB('report', false);
			} else {
				configCB('report', true);
			}
		}
		this.setState({
			reportList: ReportStore.getReportList()
		}, () => {
			if( this.state.reportList && this.state.reportList.size > 0 ) {
				this._selectReport( this.state.selectedReprotId || this.state.reportList.getIn([0, 'Id']) );
			}
		});
	}
	_selectYear(year) {
		this.setState({year}, () => this._selectReport(this.state.selectedReprotId));
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
	_getReportById(reprotId) {
		return this.state.reportList && this.state.reportList.find( report => report.get('Id') === reprotId );
	}
	_getSelectedReportById() {
		return this._getReportById(this.state.selectedReprotId);
	}
	_onEdit(reportId) {
		this.props.showReportEdit(this._getSelectedReportById());
	}
	_onDelete(reportId) {
		this.setState({
			showDeleteDialog: true
		});
	}
	_onSetFirst(reportId) {
		ReportAction.setFirst(this.props.hierarchyId, reportId);
		this.setState({
			reportList: ReportStore.getReportList()
		});
	}
	_onDownload(reportId) {
		ReportAction.download(reportId, this.state.year);
	}
	_renderDeleteDialog() {
		let {showDeleteDialog, selectedReprotId} = this.state,
		actions = [
			(<FlatButton
				label={I18N.Common.Button.Delete}
				inDialog={true}
      			primary={true}
      			onClick={() => {
      				let currentIndex = this.state.reportList
      									.findIndex(report => report.get('Id') === selectedReprotId);
	      			this.setState({
	      				showDeleteDialog: false,
	      				selectedReprotId: currentIndex < this.state.reportList.length - 1 ?
	      									this.state.reportList.get(currentIndex + 1).get('Id') :
	      									this.state.reportList.get(currentIndex - 1).get('Id')
	      			}, () => ReportAction.deleteReportById(selectedReprotId) )
	      		}}/>),
			(<FlatButton label={I18N.Common.Button.Cancel2} onClick={() => this.setState({showDeleteDialog: false})}/>)
		];
		return (<NewDialog
					title={`删除报表“${this._getSelectedReportById().get('Name')}”吗?`}
					open={showDeleteDialog}
					modal='false'
					actions={actions}/>);
	}
	render() {
		let onLastMonth, onNextMonth, currentYear = new Date().getFullYear();
		let selectedReport = this._getSelectedReportById();
		let {preview, showAll} = this.props;
		if( this.state.reportList && this.state.reportList.size === 0 ) {
			return (<div className='flex-center' style={{marginTop: 20, height: 400, border: '1px solid #000', marginRight: 20, marginBottom: 20}}>
					<b>{preview && this.props.isFull  ? '暂无报表，点击上方"+"按钮开始新建吧～' : '当前建筑没有报表'}</b>
				</div>);
		}
		if( !this.state.reportList || !selectedReport ) {
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
		let iconStyle = {
			color: '#505559',
			cursor: 'pointer',
			opacity: 1,
			backgroundColor: '#fff',
			width: 30,
			height: 30,
			lineHeight: '30px',
			textAlign: 'center',
			borderRadius: 2,
			border: '1px solid #e6e6e6',
		};
		return (
			<div className='jazz-report-preview'>
				<SwitchBar
					iconStyle={iconStyle}
					className='switch-year'
        			label={this._getDateLabel()}
        			onLeft={onLastMonth}
        			onRight={onNextMonth}/>
				<div className='jazz-report-chart'>
					<div style={{
						backgroundColor: '#f7f7f7',
						height: 50,
						position: 'absolute',
						width: '100%',
						zIndex: 1,
					}}>
						<div className={classnames('jazz-report-chart-header', {
							'full-width': !preview || !showAll
						})}>
							<div className='jazz-report-chart-excel-list'>
								{this.state.reportList.map(report =>
								<div className={classnames('tab', {
									selected: this.state.selectedReprotId === report.get('Id')
								})} onClick={() => {this.state.selectedReprotId !== report.get('Id') && this._selectReport(report.get('Id'))}}>{report.get('Name')}</div>).toJS()}
							</div>
						</div>
						{preview && showAll && <LinkButton
										disabled={!this.props.hasAll}
										className={'show-full-report'}
										labelStyle={{
											color: '#626469',
										}}
										iconName={'icon-eye'}
										label={I18N.Kpi.ViewProjectReport}
										onClick={() => {
											util.openTab(RoutePath.report.actualityBuildingReport(this.props.router.params));
										}}/>}
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
				{this._renderDeleteDialog()}
			</div>
		);
	}
}
