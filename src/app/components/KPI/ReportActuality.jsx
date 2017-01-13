import React, { Component } from 'react';
import CircularProgress from 'material-ui/CircularProgress';

import ViewableDropDownMenu from 'controls/ViewableDropDownMenu.jsx';

import ReportPreview from './ReportPreview.jsx';
import ReportConfig from './Report/ReportConfig.jsx';

import HierarchyAction from 'actions/HierarchyAction.jsx';

import HierarchyStore from 'stores/HierarchyStore.jsx';

export default class ReportActuality extends Component {
	constructor(props) {
		super(props);

		this._onChange = this._onChange.bind(this);
		this._showReportEdit = this._showReportEdit.bind(this);

		HierarchyStore.addBuildingListListener(this._onChange);

		this.state = {
			edit: null,
			hierarchyId: null,
			buildingList: null,
		}

		this._loadInitData(this.props, this.context);
	}
	componentWillUnmount() {
		HierarchyStore.removeBuildingListListener(this._onChange);
	}
	_onChange() {
		this.setState({
			buildingList: HierarchyStore.getBuildingList()
		});
	}
	_loadInitData(props, context) {
		HierarchyAction.getAvailableDataReportBuildingListByCustomerId(props.router.params.customerId);
	}
	_showReportEdit(data) {
		this.setState({
			edit: {
				data: data
			}
		});
	}
	_removeEditPage() {
		this.setState({
			edit: null
		});
	}
	_getHierarchyId(props) {
		return +props.router.location.query.hierarchyId || null;
	}
	_getSelectedHierarchy() {
		let selectedHierarchyId = this._getHierarchyId(this.props);
		return find(HierarchyStore.getBuildingList().concat(getCustomerById(this.props.router.params.customerId)), building => building.Id === selectedHierarchyId);
	}
	_renderHeader() {
		let {hierarchyId, buildingList} = this.state,
		buildingProps = {
	        isViewStatus: false,
	        defaultValue: hierarchyId,
	        style: {
	        	width: 240,
	        	margin: '0 20px',
	        },
	        didChanged: (hierarchyId) => {
	        	this.setState({hierarchyId});
	        },
	        disabled: false,
	        textField: 'Name',
	        valueField: 'Id',
	        dataItems: [{
	        	Id: null,
	        	disabled: true,
	        	Name: I18N.Setting.KPI.SelectProject
	        }].concat(buildingList),
	    };
		return (<div style={{marginLeft: 20}}>
			<span>{'建筑报表'}</span>
			<ViewableDropDownMenu {...buildingProps}/>
		</div>)
	}
	_renderContent() {
		if(this.state.hierarchyId) {
			return (
				<ReportPreview 
					preview={false}
					ref={'report_preview'}
					showReportEdit={this._showReportEdit}
					router={this.props.router} 
					hierarchyId={this.state.hierarchyId}/>);
		} else {

		return (<div className='flex-center' style={{height: 200}}>{'请在上方选择要查看的建筑'}</div>);
		}
	}
	_renderEdit() {
		let {edit} = this.state;
		if( edit ) {
			let data = edit.data;
			return (<div className='jazz-actuality-edit'>
				<ReportConfig 
					hierarchyName={this._getSelectedHierarchy().Name} 
					report={data} 
					onSave={() => {
						data && data.get('Id') && this.refs.report_preview.update(data.get('Id'));
						this._removeEditPage();
					}} 
					onCancel={this._removeEditPage}/>
			</div>);
		}
		return null;
	}
	render() {
		if( !this.state.buildingList ) {
			return (<div className='jazz-margin-up-main flex-center'><CircularProgress mode="indeterminate" size={80} /></div>);
		}
		return (
			<div className='jazz-margin-up-main'>
				{this._renderHeader()}
				{this._renderContent()}
				{this._renderEdit()}
			</div>
		);
	}
}
