import React, { Component } from 'react';
import moment from 'moment';

import KPIAction from 'actions/KPI/KPIAction.jsx'
import KPIStore from 'stores/KPI/KPIStore.jsx'
import ViewableDropDownMenu from 'controls/ViewableDropDownMenu.jsx';
import FlatButton from 'controls/FlatButton.jsx';
import LinkButton from 'controls/LinkButton.jsx';

import CreateKPI from './KPI.jsx';

class ActualityHeader extends Component {
	render() {
		return (
			<div className='header-bar'>
				<div>指标现状</div>
				<ViewableDropDownMenu {...this.props.buildingProps}/>
				<FlatButton label={'添加'} onClick={this.props.goCreate}/>
			</div>
		);
	}
}

class ActualityContent extends Component {
	render() {
		let {tags, year, onChangeYear} = this.props;
		return (
			<div className='content'>
				<div className='action-bar'>
					<LinkButton iconName={ "icon-arrow-left" } onClick={() => {
						onChangeYear(year - 1);
					}}/>
					<span className='current-year'>{year}</span>
					<LinkButton iconName={ "icon-arrow-right" } onClick={() => {
						onChangeYear(year + 1);
					}}/>
				</div>
	      		<div>
				{(tags && tags.length > 0) ?
					tags.map( tag => <KPIReport data={tag}/> ) :
				<div>本年度为配置指标，切换其他年份看看～</div>}
			</div>
			</div>
		);
	}
}

class KPIReport extends Component {
	render() {
		return (
			<div className='jazz-kpi-report'>
				<div className='jazz-kpi-report-chart'>图标</div>
				<div className='jazz-kpi-report-summary'>指标值</div>
			</div>
		);
	}
}


export default class Actuality extends Component {
	constructor(props) {
		super(props);
		this._goCreate = this._goCreate.bind(this);
		this._onChange = this._onChange.bind(this);
		this._onChange = this._onChange.bind(this);
		this.state = {
			showCreate: false,
			year: moment().year()
		}
	}
	componentWillMount() {
		KPIAction.getKPIPeriod(this.props.router.params.customerId);
		KPIStore.addChangeListener(this._onChange);
	}
	componentWillReceiveProps(nextProps) {
		KPIAction.getKPIPeriod(this.props.router.params.customerId);
		
	}
	componentWillUnmount() {
		KPIStore.removeChangeListener(this._onChange);
	}
	_init() {
		this.actioning = {
			quotaperiod: true,
			buildinglist: true,
			tagsData: true,
			tagsFullVal: true,
		}
	}
	_onChange() {
		this.forceUpdate();
	}
	_goCreate() {
		this.setState({
			showCreate: true
		});
	}
	_backCreate() {
		this.setState({
			showCreate: false
		});
	}
	render() {
		if(!KPIStore.getKPIPeriod()) {
			return (
				<div>{I18N.Kpi.Error.NonQuotaperiod}</div>
			)
		}
		if( this.state.showCreate ) {
			return (<CreateKPI/>);
		} else {
			let buildingProps = {
		        ref: 'commodity',
		        isViewStatus: false,
		        title: I18N.Setting.KPI.SelectBuilding,
		        dataItems: [{
		        	payload: 0,
		        	text: '长城脚下的公社'
		        }, {
		        	payload: 1,
		        	text: '朝阳门SOHO'
		        }, {
		        	payload: 2,
		        	text: '丹棱SOHO'
		        }, {
		        	payload: 3,
		        	text: '银河SOHO'
		        }, ],
		    };
			return (
				<div className='jazz-kpi-actuality'>
					<ActualityHeader buildingProps={buildingProps} goCreate={this._goCreate}/>
					<ActualityContent year={this.state.year} onChangeYear={(year) => {
						this.setState({year});
					}} tags={[1, 2]}/>
				</div>
			);
		}
	}
}
