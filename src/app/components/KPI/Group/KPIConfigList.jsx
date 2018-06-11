import React, { Component} from 'react';
import ReactDOM from 'react-dom';
import classnames from 'classnames';
import assign from 'object-assign';
import CircularProgress from 'material-ui/CircularProgress';
import Popover from 'material-ui/Popover';
import {Menu, MenuItem} from 'material-ui/Menu';
import {find} from 'lodash-es';
import PropTypes from 'prop-types';
import util from 'util/Util.jsx';

import {SettingStatus, Type} from 'constants/actionType/KPI.jsx';

import FlatButton from 'controls/FlatButton.jsx';
import LinkButton from 'controls/LinkButton.jsx';
import NewDialog from 'controls/NewDialog.jsx';

import KPIConfig from './NewKPIConfig.jsx';

import HierarchyAction from 'actions/HierarchyAction.jsx';
import GroupKPIAction from 'actions/KPI/GroupKPIAction.jsx';

import HierarchyStore from 'stores/HierarchyStore.jsx';
import GroupKPIStore from 'stores/KPI/GroupKPIStore.jsx';
import UOMStore from 'stores/UOMStore.jsx';
import UserStore from 'stores/UserStore.jsx';

function getAnnualQuotaForUnit(data) {
	if(typeof data.AnnualQuota === 'number') {
		return util.getLabelData(data.AnnualQuota) + getUnit(data.CommodityId);
	}
	return '';
}
function getUnit(id) {
	let uomId = find(GroupKPIStore.getCommodityList(), commodity => commodity.payload === id).uomId;
	if(uomId) {
		let code = find(UOMStore.getUoms(), uom => uom.Id === uomId).Code;
		if( code === 'null' ) {
			return '';
		}
		return code;
	}
	return '';
}

function getConfigSummary(item) {
	let indicatorClassLabel = item.IndicatorClass === 1 ? I18N.Setting.KPI.YearAndType.Dosage : I18N.Setting.KPI.YearAndType.Ratio;
	if(item.IndicatorType === 1) {
		return [
			indicatorClassLabel,
			I18N.Setting.KPI.YearAndType.Quota,
			typeof item.AnnualQuota === 'number' ? I18N.Setting.KPI.GroupQuotaType : '',
			getAnnualQuotaForUnit(item),
		].join(' ');
	}
	return [
		indicatorClassLabel,
		I18N.Setting.KPI.YearAndType.SavingRate,
		typeof item.AnnualSavingRate === 'number' ? I18N.Setting.KPI.GroupSavingRateType : '',
		typeof item.AnnualSavingRate === 'number' ? item.AnnualSavingRate.toFixed(1) * 1 + '%' : ''
	].join(' ');
}

function getCustomerPrivilageById(customerId) {
	return UserStore.getUserCustomers().find(customer => customer.get('CustomerId') === customerId * 1 );
}
function privilegedCustomer(customerId) {
	return getCustomerPrivilageById( customerId ) && getCustomerPrivilageById( customerId ).get('WholeCustomer');
}

class KPIItem extends Component {
	constructor(props) {
		super(props);
		this.state = {
			opened: false,
		};
	}
	render() {
		let {item, onChangeState} = this.props;
		return (
			<li className='config-item hiddenEllipsis'>
				<span className='hiddenEllipsis'>{item.IndicatorName}</span>
				<span className='config-item-action'>
					<LinkButton label={I18N.Setting.KPI.Group.Config} onClick={() => {
						onChangeState({
							settingStatus: SettingStatus.Edit,
							refId: item.KpiSettingsId,
						});
					}}/>
					<span style={{margin: '0 10px', color: '#e6e6e6',}}>|</span>
					<LinkButton iconName='icon-delete' onClick={() => {
						onChangeState({
							showDeleteDialog: true,
							refId: item.KpiSettingsId,
						});
					}}/>
				</span>
				{/*
				<span className='config-item-summary'>{getConfigSummary(item)}</span>
				<LinkButton ref={'edit_icon'}
					className={'fa icon-edit btn-icon'} onClick={() => {
					this.setState({
						opened: true
					});
				}}/>
				<Popover
      				open={this.state.opened}
      				anchorEl={this.state.opened && ReactDOM.findDOMNode(this.refs['edit_icon'])}
      				anchorOrigin={{
      					vertical: 'bottom',
      					horizontal: 'right',
      				}}
      				targetOrigin={{
      					vertical: 'top',
      					horizontal: 'right',
      				}}
      				onRequestClose={() => {
      					this.setState( {
      						opened: false
      					} );
      				}}>
					<Menu autoWidth={false}>
						<MenuItem key={'edit'} primaryText={I18N.Common.Button.Edit} onClick={() => {
							onChangeState({
								settingStatus: SettingStatus.Edit,
								refId: item.KpiSettingsId,
							});
						}}/>
						<MenuItem key={'delete'} style={{
							color: '#f46a58'
						}} primaryText={I18N.Common.Button.Delete} onClick={() => {
							this.setState({
								opened: false
							});
							onChangeState({
								showDeleteDialog: true,
								refId: item.KpiSettingsId,
							});
						}}/>
					</Menu>
				</Popover>
				*/}
			</li>
		);
	}
}
KPIItem.defaultProps = {
	item: PropTypes.object.isRequired,
	onChangeState: PropTypes.func.isRequired,
}


class KPIConfigItem extends Component {
	constructor(props) {
		super(props);
		this._onChangeState = this._onChangeState.bind(this);
		this.state = {
			// opened: false,
			rolongDisabled: true
		};

		GroupKPIAction.getGroupByYear(props.CustomerId, props.Year, null, (data) => {
			this.setState({
				rolongDisabled: !data || data.length === 0
			});
		});
	}
	componentWillReceiveProps(nextProps) {
		// GroupKPIAction.getGroupByYear(nextProps.CustomerId, nextProps.Year, null, (data) => {
		// 	this.setState({
		// 		rolongDisabled: !data || data.length === 0
		// 	});
		// });
	}
	_onChangeState(data) {
		let {Year, onChangeState} = this.props;
		this.props.onChangeState(assign({}, data, {refYear: Year}));
	}
	render() {
		let {Year, GroupKpiItems, onChangeState, add, CustomerId} = this.props;
		return (
			<section className='year-item'>
				<header className='year-item-header'>
					<span>{util.replacePathParams(I18N.Setting.KPI.Group.HeaderYear, Year)}</span>
					<span className='year-item-header-action'>
						<LinkButton label={I18N.Setting.KPI.create} onClick={() => {
							this._onChangeState({
								settingStatus: SettingStatus.New
							});
						}}/>
						<span style={{margin: '0 10px', color: '#e6e6e6',}}>|</span>
						<LinkButton disabled={this.state.rolongDisabled} label={I18N.Setting.KPI.Prolong} onClick={() => {
							if(this.state.rolongDisabled) {
								return;
							}
							this._onChangeState({
								settingStatus: SettingStatus.Prolong
							});
						}}/>
					</span>
				</header>
				{GroupKpiItems && GroupKpiItems.length > 0 && <ul className='year-item-content'>
					{ GroupKpiItems.map( item => (<KPIItem
						key={item.KpiSettingsId}
						item={item}
						onChangeState={this._onChangeState}/>) ) }
				</ul>}
			</section>
		);
	}
}
KPIConfigItem.defaultProps = {
	add: PropTypes.boolean,
	Year: PropTypes.number.isRequired,
	GroupKpiItems: PropTypes.array.isRequired,
	onChangeState: PropTypes.func.isRequired,
}


type Props = {
	customerId: number,
};

type State = {
	loading: boolean,
};

export default class KPIConfigList extends Component<void, Props, State> {
	state: State = {
		loading: true,
		showDeleteDialog: false,
		settingStatus: null,
		refId: null,
		refYear: null,
	};
	constructor(props) {
		super(props);

		this._deleteKPISetting = this._deleteKPISetting.bind(this);
		this._onCancel = this._onCancel.bind(this);
		this._onRefresh = this._onRefresh.bind(this);
		this._onChange = this._onChange.bind(this);
		this._onGetBuildingList = this._onGetBuildingList.bind(this);
	}
	componentWillMount() {
		this._onRefresh();
		HierarchyStore.addBuildingListListener(this._onGetBuildingList);
		GroupKPIStore.addChangeListener(this._onChange);
	}
	componentWillUnmount() {
		HierarchyStore.removeBuildingListListener(this._onGetBuildingList);
		GroupKPIStore.removeChangeListener(this._onChange);
	}
	_onGetBuildingList() {
		if(privilegedCustomer(this.props.customerId)) {
			return GroupKPIAction.getGroupSettingsList(this.props.customerId);
		}
		this._onChange();
	}
	_onChange() {
		this.setState({
			loading: false
		});
	}
	_onCancel() {
		this.setState({
			loading: false,
			showDeleteDialog: false,
			settingStatus: null,
			refId: null,
			refYear: null,
		});
	}
	_onRefresh(id) {
		let newState = {			
			loading: true,
			showDeleteDialog: false,
		}
		if( !this.state.settingStatus || this.state.settingStatus === SettingStatus.Edit ) {
			newState.refId = null;
			newState.refYear = null;
			newState.settingStatus = null;
		} else {
			newState.refId = id;
			newState.settingStatus = SettingStatus.Edit;
		}
		this.setState(newState);
		HierarchyAction.getBuildingListByCustomerId(this.props.customerId);
	}
	_deleteKPISetting() {
		GroupKPIAction.deleteGroupSettings(this.state.refId, this.props.customerId);
		this.setState({
			loading: true,
			showDeleteDialog: false,
			settingStatus: null,
			refId: null,
			refYear: null,
		});
	}
	render(): ?React.Element {
		let {loading, settingStatus, refId, refYear, showDeleteDialog} = this.state;
		if( loading ) {
			return (<div className='jazz-margin-up-main flex-center'><CircularProgress size={80}/></div>);
		}
		let dialog = null;
		if( settingStatus ) {
			let configProps = {
				onCancel: this._onCancel,
				onSave: this._onRefresh,
				status: settingStatus,
				year: refYear,
				id: refId,
			};
			if( settingStatus === SettingStatus.Edit ) {
				configProps.name = GroupKPIStore.findKPISettingByKPISettingId(refId).IndicatorName || '';

				return (<KPIConfig {...configProps}/>)
			} else {
				dialog = (
					<div style={{position: 'fixed', left: 0, top: 0, width: '100%', height: '100%', display: 'flex'}}>
						<KPIConfig {...configProps}/>
					</div>
				);
			}
		}
		if( !privilegedCustomer(this.props.customerId) ) {
			return (<div className='jazz-margin-up-main flex-center'>{I18N.Kpi.Error.KPINonMoreBuilding}</div>);
		}
		return (
			<div className='jazz-margin-up-main jazz-kpi-config-list'>
				<div className='jazz-main-content'>
					<header className='header-bar'>
						<em onClick={this.props.onClose} className='icon-return' style={{marginRight: 20}}/>
						{I18N.Setting.KPI.GroupList.Header}
					</header>
					<article className='content'>
						{GroupKPIStore.getGroupSettingsList().map( data => (
						<KPIConfigItem
							key={data.Year}
							CustomerId={parseInt(this.props.customerId)}
							onChangeState={(state) => {
								this.setState(state);
							}}
							{...data}/>) )}
					</article>
				</div>
				<NewDialog
					open={showDeleteDialog}
					actionsContainerStyle={{textAlign: 'right'}}
					actions={[
				      <FlatButton
					      label={I18N.Common.Button.Delete}
					      inDialog={true}
					      primary={true}
					      onClick={this._deleteKPISetting} />,

				      <FlatButton
					      label={I18N.Common.Button.Cancel2}
					      onClick={() => {this.setState({
					      	showDeleteDialog: false
					      })}} />
				    ]}
				>{I18N.Setting.KPI.GroupList.DeleteComment}</NewDialog>
				{dialog}
			</div>
		);
	}
}
