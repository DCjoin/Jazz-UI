import React, { Component, PropTypes } from 'react';
import CircularProgress from 'material-ui/CircularProgress';
import {find} from 'lodash/collection';

import ViewableDropDownMenu from 'controls/ViewableDropDownMenu.jsx';
import RoutePath from 'util/RoutePath.jsx';

import ReportPreview from './ReportPreview.jsx';
import ReportConfig from './Report/ReportConfig.jsx';

import HierarchyAction from 'actions/HierarchyAction.jsx';

import CurrentUserCustomerStore from 'stores/CurrentUserCustomerStore.jsx';
import HierarchyStore from 'stores/HierarchyStore.jsx';

function getCustomerById(customerId) {
	return find(CurrentUserCustomerStore.getAll(), customer => customer.Id === customerId * 1 );
}

export default class ReportActuality extends Component {
	static contextTypes = {
		hierarchyId: PropTypes.string
	};
	constructor(props) {
		super(props);

		this._onChange = this._onChange.bind(this);
		this._showReportEdit = this._showReportEdit.bind(this);
		this._removeEditPage = this._removeEditPage.bind(this);

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
	componentWillReceiveProps(nextProps, nextContext) {
		if(nextContext.hierarchyId !== nextProps.params.customerId*1) {
			nextProps.router.push(RoutePath.Actuality(nextProps.params));
		}
	}
	_onChange() {
		this.setState({
			buildingList: HierarchyStore.getActiveBuildingList()
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
		return this.state.hierarchyId;
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
	        	Name: I18N.Setting.KPI.SelectBuilding
	        }].concat(buildingList),
	    };
		return (<div className='jazz-report-actuality-header' style={{marginLeft: 20,paddingTop: 20,position: 'relative'}}>
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
					hierarchyId={this.state.hierarchyId} 
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
			<div className='jazz-margin-up-main jazz-report-actuality'>
				{this._renderHeader()}
				{this._renderContent()}
				{this._renderEdit()}
			</div>
		);
	}
}
