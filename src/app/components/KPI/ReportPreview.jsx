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
			selectedReprotId: null,
			url: null,
			showDeleteDialog: false,
		}
	}
	update(selectedReprotId) {
		this._preAction();
		this.setState({
			year: this.state.year,
			selectedReprotId: selectedReprotId || null,
			url: null,
		});
	}
	_preAction(hierarchyId = this.props.hierarchyId) {
		this.setState(this._getInitialState());
		ReportAction.getReportListByCustomerId(hierarchyId, 'createTime', 'asc');
	}
	_onPreActopn() {
		if( ReportStore.getReportList().size > 0 ) {
			this._selectReport( this.state.selectedReprotId || ReportStore.getReportList().getIn([0, 'Id']) );
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
	_getReportById(reprotId) {
		return ReportStore.getReportList().find( report => report.get('Id') === reprotId );
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
		this.setState({selectedReprotId: null}, () => {
			ReportAction.setFirst(this.props.hierarchyId, reportId);
		});
	}
	_onDownload(reportId) {
		ReportAction.download(this.props.hierarchyId, reportId);
	}
	_renderDeleteDialog() {
		let {showDeleteDialog, selectedReprotId} = this.state,
		actions = [
			(<FlatButton 
				label={I18N.Common.Button.Delete}
				inDialog={true}
      			primary={true}
      			onClick={() => {
      				let currentIndex = ReportStore.getReportList()
      									.findIndex(report => report.get('Id') === selectedReprotId);
	      			this.setState({
	      				showDeleteDialog: false,
	      				selectedReprotId: currentIndex < ReportStore.getReportList().length - 1 ?
	      									ReportStore.getReportList().get(currentIndex + 1).get('Id') :
	      									ReportStore.getReportList().get(currentIndex - 1).get('Id')
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
		let {preview} = this.props;

		if( !ReportStore.getReportList() || !selectedReport ) {
			if( ReportStore.getReportList().size === 0 ) {
				return (<div className='flex-center' style={{height: 200}}>{preview ? '暂无报表，点击上方"+"按钮开始新建吧～' : '当前建筑没有报表'}</div>);
			}
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
			<div className='jazz-report-preview'>
				<SwitchBar 
					className='switch-year'
        			label={this._getDateLabel()}
        			onLeft={onLastMonth}
        			onRight={onNextMonth}/>
        		{preview && <LinkButton 
        						className={'show-full-report'} 
        						label={'查看各建筑报表 >>'}
        						onClick={() => {
        							util.openTab(RoutePath.report.actualityReport(this.props.router.params));
        						}}/>}
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
				{this._renderDeleteDialog()}
			</div>
		);
	}
}
