import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import classnames from 'classnames';
import assign from 'object-assign';
import CircularProgress from 'material-ui/CircularProgress';
import Popover from 'material-ui/Popover';
import {Menu, MenuItem} from 'material-ui/Menu';
import {find} from 'lodash/collection';

import {SettingStatus} from '../../../constants/actionType/KPI.jsx';

import FlatButton from 'controls/FlatButton.jsx';
import LinkButton from 'controls/LinkButton.jsx';
import NewDialog from 'controls/NewDialog.jsx';

import KPIConfig from './KPIConfig.jsx';

import GroupKPIAction from 'actions/KPI/GroupKPIAction.jsx';

import GroupKPIStore from 'stores/KPI/GroupKPIStore.jsx';
import UOMStore from 'stores/UOMStore.jsx';

function getUnit(id) {
	let uomId = find(GroupKPIStore.getCommodityList(), commodity => commodity.payload === id).uomId;
	if(uomId) {
		return find(UOMStore.getUoms(), uom => uom.Id === id).Code || '';
	}
	return '';
}

function getLabelData(value) {
	if( value * 1 !== value ) {
		return null;
	}
	let abbreviations = [
		// {label: '兆', value: Math.pow(10, 12)},
		{label: '亿', value: Math.pow(10, 8)},
		{label: '万', value: Math.pow(10, 4)},
		{label: '', value: Math.pow(10, 0)},
	];
	let label = '';
	for(let i = 0; i < abbreviations.length; i++) {
		let abbreviation = abbreviations[i];
		if( value/abbreviation.value > 1 ) {
			label = abbreviation.label;
			value = value/abbreviation.value + '';
			let firstValue = value.split('.')[0];
			let secondValue = value.split('.')[1] || '0000';
			secondValue = secondValue.substring(0, 4 - firstValue.length);
			value = firstValue + ((secondValue * 1) ? '.' + secondValue : '');
			break;
		}

	}
	return value + label;
}

function getConfigSummary(item) {
	if(item.IndicatorType === 1) {
		return '定额指标 集团定额 ' + getLabelData(item.AnnualQuota) + ' ' + getUnit(item.CommodityId);
	}
	return '节能率指标 节能率 ' + item.AnnualSavingRate.toFixed() + '%'
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
						<MenuItem key={'edit'} primaryText={'编辑'} onClick={() => {
							onChangeState({
								settingStatus: SettingStatus.Edit,
								refId: item.KpiSettingsId,
							});
						}}/>
						<MenuItem key={'delete'} style={{
							color: '#f46a58'
						}} primaryText={'删除'} onClick={() => {
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
		let {Year, GroupKpiItems, onChangeState} = this.props;
		return (
			<section className='year-item'>
				<header className='year-item-header'>
					<span>{Year + '年'}</span>
					<LinkButton ref='add_icon' 
						className={classnames('fa icon-add btn-icon', {
							opened: this.state.opened
						})} onClick={() => {
						this.setState({
							opened: true
						});
					}}/>
					<Popover
          				open={this.state.opened}
          				anchorEl={this.state.opened && ReactDOM.findDOMNode(this.refs.add_icon)}
          				onRequestClose={() => {
          					this.setState( {
          						opened: false
          					} );
          				}}>
						<Menu>
							<MenuItem primaryText={'新建指标'} onClick={() => {
								this._onChangeState({
									settingStatus: SettingStatus.New
								});
							}} />
							<MenuItem primaryText={'延续往年指标'} onClick={() => {
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
	}
	componentWillMount() {
		this._onRefresh();
		GroupKPIStore.addChangeListener(this._onChange);
	}
	componentWillUnmount() {
		GroupKPIStore.removeChangeListener(this._onChange);		
	}
	_onChange() {
		this.setState({
			loading: false
		});
	}
	_onRefresh() {
		this.setState({
			loading: true,
			showDeleteDialog: false,
			settingStatus: null,
			refId: null,
			refYear: null,
		});
		GroupKPIAction.getGroupSettingsList(this.props.router.params.customerId);
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
						onDone={this._onRefresh}
						status={settingStatus}
						year={refYear}
						id={refId}
						name={GroupKPIStore.findKPISettingByKPISettingId(refId).IndicatorName || ''}/>)
		}
		return (
			<div className='jazz-margin-up-main jazz-kpi-config-list'>
				<header className='header-bar'>指标配置</header>
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
					title={'删除指标“' + (GroupKPIStore.findKPISettingByKPISettingId(refId).IndicatorName || '') + '”'}
					actions={[
				      <FlatButton
					      label={I18N.Common.Button.Delete}
					      inDialog={true}
					      primary={true}
					      onClick={this._deleteKPISetting} />,

				      <FlatButton
					      label={I18N.Common.Button.Cancel}
					      onClick={() => {this.setState({
					      	showDeleteDialog: false
					      })}} />
				    ]}
				>{'删除指标将导致所有相关图表都被删除。'}</NewDialog>
			</div>
		);
	}
}
