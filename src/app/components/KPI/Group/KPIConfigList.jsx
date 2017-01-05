import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import classnames from 'classnames';
import assign from 'object-assign';
import CircularProgress from 'material-ui/CircularProgress';
import Popover from 'material-ui/Popover';
import {Menu, MenuItem} from 'material-ui/Menu';
import {find} from 'lodash/collection';

import util from 'util/Util.jsx';

import {SettingStatus} from 'constants/actionType/KPI.jsx';

import FlatButton from 'controls/FlatButton.jsx';
import LinkButton from 'controls/LinkButton.jsx';
import NewDialog from 'controls/NewDialog.jsx';

import KPIConfig from './KPIConfig.jsx';

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
		return find(UOMStore.getUoms(), uom => uom.Id === uomId).Code || '';
	}
	return '';
}

function getConfigSummary(item) {
	if(item.IndicatorType === 1) {
		return [
			I18N.Setting.KPI.YearAndType.Quota,
			typeof item.AnnualQuota === 'number' ? I18N.Setting.KPI.GroupQuotaType : '',
			getAnnualQuotaForUnit(item),
		].join(' ');
	}
	return [
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
			<li className='config-item'>
				<span>{item.IndicatorName}</span>
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
			opened: false,
		};
	}
	_onChangeState(data) {
		let {Year, onChangeState} = this.props;
		this.props.onChangeState(assign({}, data, {refYear: Year}));
	}
	render() {
		let {Year, GroupKpiItems, onChangeState, add} = this.props;
		return (
			<section className='year-item'>
				<header className='year-item-header'>
					<span>{util.replacePathParams(I18N.Setting.KPI.Group.HeaderYear, Year)}</span>
					{add && <LinkButton ref='add_icon'
						className={classnames('fa icon-add btn-icon', {
							opened: this.state.opened
						})} onClick={() => {
						this.setState({
							opened: true
						});
					}}/>}
					<Popover
          				open={this.state.opened}
          				anchorEl={this.state.opened && ReactDOM.findDOMNode(this.refs.add_icon)}
          				onRequestClose={() => {
          					this.setState( {
          						opened: false
          					} );
          				}}>
						<Menu>
							<MenuItem primaryText={I18N.Setting.KPI.create} onClick={() => {
								this._onChangeState({
									settingStatus: SettingStatus.New
								});
							}} />
							<MenuItem primaryText={I18N.Setting.KPI.Prolong} onClick={() => {
								this._onChangeState({
									settingStatus: SettingStatus.Prolong
								});
							}}/>
						</Menu>
					</Popover>
				</header>
				<ul>
					{ GroupKpiItems.map( item => (<KPIItem
						key={item.KpiSettingsId}
						item={item}
						onChangeState={this._onChangeState}/>) ) }
				</ul>
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
	router: object,
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
		if(privilegedCustomer(this.props.router.params.customerId)) {
			return GroupKPIAction.getGroupSettingsList(this.props.router.params.customerId);
		}
		this._onChange();
	}
	_onChange() {
		this.setState({
			loading: false
		});
	}
	_onRefresh(props) {
		props = props || this.props;
		this.setState({
			loading: true,
			showDeleteDialog: false,
			settingStatus: null,
			refId: null,
			refYear: null,
		});
		HierarchyAction.getBuildingListByCustomerId(props.router.params.customerId);
		
	}
	_deleteKPISetting() {
		GroupKPIAction.deleteGroupSettings(this.state.refId, this.props.router.params.customerId);
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
		if( settingStatus ) {
			return (<KPIConfig
						onCancel={this._onRefresh}
						onSave={this._onRefresh}
						// onPending={()=>{this.setState({loading: true})}}
						status={settingStatus}
						year={refYear}
						id={refId}
						name={GroupKPIStore.findKPISettingByKPISettingId(refId).IndicatorName || ''}/>)
		}
		if( !privilegedCustomer(this.props.router.params.customerId) ) {
			return (<div className='jazz-margin-up-main flex-center'>{I18N.Kpi.Error.KPINonMoreBuilding}</div>);
		}
		return (
			<div className='jazz-margin-up-main jazz-kpi-config-list'>
				<header className='header-bar'>{I18N.Setting.KPI.GroupList.Header}</header>
				<article className='content'>
					{GroupKPIStore.getGroupSettingsList().map( data => (
					<KPIConfigItem
						key={data.Year}
						onChangeState={(state) => {
							this.setState(state);
						}}
						{...data}/>) )}
				</article>
				<NewDialog
					open={showDeleteDialog}
					title={util.replacePathParams(I18N.Setting.KPI.GroupList.DeleteTitle, GroupKPIStore.findKPISettingByKPISettingId(refId).IndicatorName || '')}
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
			</div>
		);
	}
}
