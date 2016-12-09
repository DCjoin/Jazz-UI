import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import classnames from 'classnames';
import CircularProgress from 'material-ui/CircularProgress';
import Popover from 'material-ui/Popover';
import {Menu, MenuItem} from 'material-ui/Menu';

import LinkButton from 'controls/LinkButton.jsx';
import {SettingStatus} from '../../constants/actionType/KPI.jsx';

import GroupKPIAction from 'actions/KPI/GroupKPIAction.jsx';

import GroupKPIStore from 'stores/KPI/GroupKPIStore.jsx';
import UOMStore from 'stores/UOMStore.jsx';

function getUnit(id) {
	return find(UOMStore.getUoms(), uom => uom.Id === id).Code || '';
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
		return '定额指标 集团定额 ' + getLabelData(item.AnnualQuota) + ' ' + getUnit(item);
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
		let {item} = this.props;
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
								settingStatus: SettingStatus.Edit
							});
						}}/>
						<MenuItem key={'delete'} style={{
							color: '#f46a58'
						}} primaryText={'删除'} />
					</Menu>
				</Popover>
			</li>
		);
	}
}


class KPIConfigItem extends Component {
	constructor(props) {
		super(props);
		this.state = {
			opened: false,
		};
	}
	render() {
		let {Year, GroupKpiItems, onChangeState} = this.props;
		return (
			<section className='year-item'>
				<header className='year-item-header'>
					<span>{Year}</span>
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
								onChangeState({
									settingStatus: SettingStatus.New
								});
							}} />
							<MenuItem primaryText={'延续往年指标'} onClick={() => {
								onChangeState({
									settingStatus: SettingStatus.Prolong
								});
							}}/>
						</Menu>
					</Popover>
				</header>
				<ul>
					{ GroupKpiItems.map( item => (<KPIItem key={item.KpiSettingsId} item={item}/>) ) }
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
	};
	constructor(props) {
		super(props);

		this._onChange = this._onChange.bind(this);
	}
	componentWillMount() {
		GroupKPIAction.getGroupSettingsList(this.props.router.params.customerId);
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
	render(): ?React.Element {
		if( this.state.loading ) {
			return (<div className='jazz-margin-up-main flex-center'><CircularProgress size={80}/></div>);
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
			</div>
		);
	}
}
