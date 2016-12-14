import React, { Component } from 'react';
import moment from 'moment';
import classnames from 'classnames';
import assign from 'object-assign';
import {findLastIndex, fill, map} from 'lodash/array';
import {find} from 'lodash/collection';
import {sum} from 'lodash/math';
import CircularProgress from 'material-ui/CircularProgress';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';

import UserAction from 'actions/UserAction.jsx'
import HierarchyAction from 'actions/HierarchyAction.jsx'
import SingleKPIAction from 'actions/KPI/SingleKPIAction.jsx'
import SingleKPIStore from 'stores/KPI/SingleKPIStore.jsx'
import UserStore from 'stores/UserStore.jsx'
import HierarchyStore from 'stores/HierarchyStore.jsx'
import UOMStore from 'stores/UOMStore.jsx'
import CurrentUserStore from 'stores/CurrentUserStore.jsx'
import CurrentUserCustomerStore from 'stores/CurrentUserCustomerStore.jsx'

import ViewableDropDownMenu from 'controls/ViewableDropDownMenu.jsx';
import FlatButton from 'controls/FlatButton.jsx';
import LinkButton from 'controls/LinkButton.jsx';

import PermissionCode from 'constants/PermissionCode.jsx';

import util from 'util/Util.jsx';
import privilegeUtil from 'util/privilegeUtil.jsx';

import CreateKPI from './single/KPI.jsx';
import UpdatePrediction from './single/UpdatePrediction.jsx';

import Highcharts from '../highcharts/Highcharts.jsx';
function canView() {
	return privilegeUtil.canView(PermissionCode.INDEX_AND_REPORT, CurrentUserStore.getCurrentPrivilege());
}
function isOnlyView() {
	return privilegeUtil.isView(PermissionCode.INDEX_AND_REPORT, CurrentUserStore.getCurrentPrivilege());
}

function isFull() {
	return privilegeUtil.isFull(PermissionCode.INDEX_AND_REPORT, CurrentUserStore.getCurrentPrivilege());
}
function isSingleBuilding() {
	return (HierarchyStore.getBuildingList() && HierarchyStore.getBuildingList().length === 1)
		&& isOnlyView();
}

function getHierarchyNameById(Id) {
	return HierarchyStore.getBuildingList().filter( building => building.Id === Id )[0].Name;
}

function getUnit(id) {
	return find(UOMStore.getUoms(), uom => uom.Id === id).Code;
}

function getCustomerById(customerId) {
	return find(CurrentUserCustomerStore.getAll(), customer => customer.Id === customerId * 1 );
}
function getCustomerPrivilageById(customerId) {
	return UserStore.getUserCustomers().find(customer => customer.get('CustomerId') === customerId * 1 );
}

function changeLegendStyle(item) {
	item.setAttribute('width', item.getAttribute('width') * 1  - 1);
	item.setAttribute('height', item.getAttribute('height') * 1  - 1);
	item.setAttribute('y', item.getAttribute('y') * 1 + 1);
	item.setAttribute('stroke', '#434348');
	item.setAttribute('stroke-width', 1);
	item.setAttribute('stroke-dasharray', '4,3');
}
function singleProjectMenuItems() {
	if( !HierarchyStore.getBuildingList() || HierarchyStore.getBuildingList().length === 0 ) {
		return [];
	}
	return [{
    	Id: -2,
    	disabled: true,
    	Name: I18N.Kpi.SingleProject
    }].concat(HierarchyStore.getBuildingList());
}
function groupProjectMenuItems(customerId) {
	if( !CurrentUserCustomerStore.getAll() || CurrentUserCustomerStore.getAll().length === 0 ) {
		return [];
	}
	return [{
    	Id: -1,
    	disabled: true,
    	Name: I18N.Kpi.GroupProject
    }].concat( getCustomerById(customerId) );
}

// function hasAllPrivilege() {
// 	let hasAllPrivilege = true;
//     if (UserStore.getUserCustomers().size === 0) {
//       hasAllPrivilege = false;
//     } else {
//       UserStore.getUserCustomers().forEach((customer) => {
//         if (!customer.get("Privileged")) {
//           hasAllPrivilege = false;
//         }
//       });
//     }
//     return hasAllPrivilege;
// }

const DEFAULT_OPTIONS = {
    credits: {
        enabled: false
    },
    chart: {
    	spacingBottom: 0,
      	events: {
          	load: function () {
              	let lastLegendItems = document.querySelectorAll('.highcharts-legend .highcharts-legend-item:nth-of-type(3) rect');
              	if(lastLegendItems ) {
              		for(let i = 0; i < lastLegendItems.length; i++) {
              			let item = lastLegendItems[i];
              			changeLegendStyle(item);
              		}
              	}
          	}
      	}
    },
    title: {
    	align: 'left',
    	margin: 40,
    },
    legend: {
    	align: 'left',
    	padding: 30
    },
    xAxis: {
    	tickLength: 0
    },
    yAxis: {
    	lineWidth: 1,
    	labels: {
	    	formatter: function() {
	    		return util.getLabelData(this.value)
	    	},
    	},
    	type: 'column',
        min: 0,
        title: {
            align: 'high',
            rotation: 0,
            offset: 0,
            y: -20,
            x: -10,
        }
    },
    tooltip: {
        crosshairs: {
            width: 1.5,
            color: 'black',
        	zIndex: 3
        },
	    borderWidth: 0,
	    backgroundColor: "rgba(255,255,255,0)",
	    borderRadius: 0,
        shared: true,
        useHTML: true,
        shadow: false,
    },
    plotOptions: {
        column: {
            grouping: false,
            pointPadding: 0.2,
            borderWidth: 0
        }
    },
    series: [ {
        type: 'line',
        marker: {
	        lineWidth: 3,
	        lineColor: window.Highcharts.getOptions().colors[0],
	        fillColor: 'white',
	    },
        zIndex: 2,
    },{
        type: 'column',
        pointPadding: 0.4,
        pointPlacement: 0,
        color: '#90ed7d',
        // dataLabels: {
        //     enabled: true,
        //     useHTML: true,
        //     borderRadius: 5,
        //     backgroundColor: 'rgba(252, 255, 197, 0.7)',
        //     borderWidth: 1,
        //     borderColor: '#AAA',
        //     y: -6,
        // },
    }, {
        type: 'column',
        pointPadding: 0.2,
        pointPlacement: 0,
		borderColor: '#434348',
        borderWidth: 1,
		dashStyle: 'dash',
		color: 'rgba(255, 255, 255, 0.1)',

    },]
};

class KPIChart extends Component {
	_generatorOptions() {
		let {data, period, LastMonthRatio} = this.props;
		let currentMonthIndex = findLastIndex(period,  date => date.isBefore(new Date()) );
		// if( period[0].isAfter(new Date()) ) {
		// 	console.log(1);
		// 	currentMonthIndex = 12;
		// }
		// if( period[period.length - 1].isBefore(new Date()) ) {
		// 	console.log(-1);
		// 	currentMonthIndex = 11;
		// }
		let tooltipIndex =  data.get('actual') && findLastIndex(data.get('actual').toJS(), (val, index) => index < currentMonthIndex && val);
		let ratioMonth = data.get('ratioMonth');

		let options = util.merge(true, {}, DEFAULT_OPTIONS, {
		});

		let unit = getUnit(data.get('unit'));
		options.xAxis.categories = util.getDateLabelsFromMomentToKPI(period);
		options.yAxis.title.text = unit;
	    options.tooltip.formatter = function() {
	    	var data1 = this.points[0];
	    	var data2 = this.points[1];
	    	var data3 = this.points[2];
	    	let list = '';
	    	let title = '<br/>';
	    	let targetVal = 0;
	    	let actualVal = 0;
	    	let predictionVal = 0;
    		let currentDataIndex = data1.point.index;
	    	let header = util.replacePathParams(I18N.Kpi.YearMonth, period[currentDataIndex].year(), period[currentDataIndex].month() + 1);
	    	this.points.forEach(data => {
	    		if(data) {
	    			if(data.series.name === I18N.Kpi.TargetValues) {
	    				targetVal = data.y;
			    		list += `
			    		<tr>
					    	<td style="color:${data.series.color};padding:0">● ${data.series.name}: </td>
					    	<td style="padding:0">${util.getLabelData(data.y) + ' ' + unit}</td>
				    	</tr>
			    		`;
	    			}
	    			if(data.series.name === I18N.Kpi.ActualValues) {
	    				actualVal = data.y;
			    		list += `
			    		<tr>
					    	<td style="color:${data.series.color};padding:0">■ ${data.series.name}: </td>
					    	<td style="padding:0">${util.getLabelData(data.y) + ' ' + unit}</td>
				    	</tr>
			    		`;
	    			}
	    			if(data.series.name === I18N.Kpi.PredictionValues) {
	    				predictionVal = data.y;
			    		list += `
			    		<tr>
					    	<td style="color:#434348;padding:0"><div style='    margin-right: 4px;border-color:#434348;border-width:1px;border-style:dotted;display:inline-block;width:6px;height:6px'></div>${data.series.name}: </td>
					    	<td style="padding:0">${util.getLabelData(data.y) + ' ' + unit}</td>
				    	</tr>
			    		`;
	    			}
	    		}
	    	});
	    	if(data.get('type') === 1 && targetVal ) {
	    		if(currentDataIndex <= currentMonthIndex || currentMonthIndex === -1) {
	    			title += `<b>${util.replacePathParams(I18N.Kpi.MonthUsaged, (actualVal * 100 / targetVal).toFixed(1) * 1)}</b>`;
	    		} else {
	    			title += `<b>${util.replacePathParams(I18N.Kpi.MonthUsagedPrediction, (predictionVal * 100 / targetVal).toFixed(1) * 1)}</b>`;
	    		}
	    	} else if(data.get('type') === 2 && ratioMonth/*currentDataIndex === tooltipIndex*/) {
	    		if(currentDataIndex <= currentMonthIndex || currentMonthIndex === -1) {
	    			title += `<b>${util.replacePathParams(I18N.Kpi.RatioMonthUsaged, ratioMonth.get(currentDataIndex).toFixed(1) * 1)}</b>`;
	    		} else {
	    			title += `<b>${util.replacePathParams(I18N.Kpi.RatioMonthUsagedPrediction, ratioMonth.get(currentDataIndex).toFixed(1) * 1)}</b>`;
	    		}
	    		// title += `<b>${I18N.Kpi.ActualityFractionalEnergySaving + (LastMonthRatio * 100).toFixed(1) * 1 + '%'}</b>`;
	    	}
	    	return `
	    	<table>
	    		<b>${header}</b>
	    		${title}
	    		${list}
	    	</table>
	    	`;
	    };

		options.title.text = data.get('name');

		options.series[0].data = data.get('target') && data.get('target').toJS().slice(0, 12);
		options.series[0].name = I18N.Kpi.TargetValues;
		options.series[1].data = data.get('actual') && data.get('actual').toJS().slice(0, 12);
		options.series[1].name = I18N.Kpi.ActualValues;
		options.series[2].data = data.get('prediction') && fill(data.get('prediction').toJS(), null, 0, currentMonthIndex === -1 ? 0 : currentMonthIndex).slice(0, 12);
		options.series[2].name = I18N.Kpi.PredictionValues;

		// options.series[1].dataLabels.formatter = function() {
  //       	if(data.get('type') === 2 && this.point.index === tooltipIndex) {
  //       		return `
		// 			<div class='actuality-fractional-energy-saving-tooltip'>
		// 				<div>${I18N.Kpi.ActualityFractionalEnergySaving}</div>
		// 				<div>${(LastMonthRatio * 100).toFixed(1) * 1 + '%'}</div>
		// 			</div>
  //       		`
  //       	}
  //       }

		return options;
	}
	shouldComponentUpdate(nextProps, nextState) {
		return this.props.data !== nextProps.data;
	}
    render () {
        return (
            <Highcharts
                ref="highcharts"
                options={this._generatorOptions()}/>
        );
    }
}

class ActualityHeader extends Component {
	render() {
		return (
			<div className='header-bar'>
				<div>{I18N.Kpi.KPIActual}</div>
				{isFull() && <ViewableDropDownMenu {...this.props.buildingProps}/>}
			</div>
		);
	}
}

class ActualityContent extends Component {
	render() {
		let {data, summaryData, period, year, onChangeYear, hierarchyId, onEdit, onRefresh, chartReady} = this.props;
		if( !chartReady ) {
			return (<div className="content flex-center"><CircularProgress  mode="indeterminate" size={80} /></div>);
		}
		if( isFull() ) {
			if( !hierarchyId ) {
				return (<div className="content flex-center"><b>{I18N.Kpi.Error.SelectBuilding}</b></div>);
			}
			if( !data ) {
				return (<div className="content flex-center"><b>{I18N.Kpi.Error.NonKPICongured}</b></div>);
			}
		}
		let tags = data.get('data');
		return (
			<div className='content'>
				<div className='action-bar'>
					<LinkButton iconName={ "icon-arrow-left" } disabled={ !SingleKPIStore.hasLastYear(year) } onClick={() => {
						if( SingleKPIStore.hasLastYear(year) ) {
							onChangeYear(year * 1 - 1);
						}
					}}/>
					<span className='current-year'>{year}</span>
					<LinkButton iconName={ "icon-arrow-right" } disabled={ !SingleKPIStore.hasNextYear(year) } onClick={() => {
						if( SingleKPIStore.hasNextYear(year) ) {
							onChangeYear(year * 1 + 1);
						}
					}}/>
				</div>
				<div>
					{(period && period.length > 0 && tags && tags.size > 0) ?
						tags.map( (tag, i) => <KPIReport
							onEdit={onEdit}
							onRefresh={onRefresh}
							period={period} data={tag}
							summaryData={find(summaryData, sum => sum.KpiId === tag.get('id'))}
							key={tag.get('id')}/> ) :
					<div className='jazz-kpi-report flex-center' style={{height: 400}}>{I18N.Kpi.Error.NonKPIConguredInThisYear}</div>}
				</div>
			</div>
		);
	}
}

class KPIReport extends Component {
	/*指标值*/
	getValueSummaryItem() {
		let {data, summaryData} = this.props;
		let isIndex = data.get('type') === 1;
		return (
		<div className='summary-item'>
			<div className='summary-title'>{isIndex ? I18N.Kpi.IndexValue : I18N.Kpi.SavingValue}</div>
			{isIndex ?/*定额指标值*/
			(<div className='summary-value'>
				<span>{summaryData.IndexValue !== null && util.getLabelData(summaryData.IndexValue)}</span>
				<span>{summaryData.IndexValue !== null && getUnit(data.get('unit'))}</span>
			</div>) : /*节能率指标值*/
			(<div className='summary-value'>
				<span>{summaryData.RatioValue !== null && (summaryData.RatioValue || 0).toFixed(1) * 1 + '%'}</span>
				<span>{summaryData.IndexValue !== null && util.getLabelData(summaryData.IndexValue)}</span>
				<span>{summaryData.IndexValue !== null && getUnit(data.get('unit'))}</span>
				{/*<span>{data.get('prediction') !== null && (util.getLabelData(data.get('prediction') && sum(data.get('prediction').toJS()) ) + ' ' + (data.get('prediction') && getUnit(data.get('unit'))) )}</span>*/}
			</div>)}
		</div>
		);
	}
	/*预测值*/
	getPredictSummaryItem() {
		let {data, summaryData} = this.props;
		let isIndex = data.get('type') === 1;
		let overproof = summaryData.PredictSum && summaryData.IndexValue && (isIndex ? (summaryData.IndexValue < summaryData.PredictSum)
									 : (summaryData.IndexValue > summaryData.PredictSum)) ;
		return (
		<div className={classnames('summary-item', {overproof: overproof})}>
			<div className='summary-title'>{isIndex ? I18N.Kpi.PredictSum : I18N.Kpi.PredictSaving}</div>
			{isIndex ?/*定额预测值*/
			(<div className='summary-value'>
				<span>{util.getLabelData(summaryData.PredictSum)}</span>
				<span>{summaryData.PredictSum !== null && getUnit(data.get('unit'))}</span>
				<span>{(!summaryData.PredictRatio ? 0 : summaryData.PredictRatio * 100).toFixed(1) * 1 + '%'}</span>
			</div>) :/*节能率预测值*/
			(<div className='summary-value'>
				<span>{(summaryData.PredictRatio === null ? 0 : summaryData.PredictRatio * 100).toFixed(1) * 1 + '%'}</span>
				<span>{util.getLabelData(summaryData.PredictSum)}</span>
				<span>{summaryData.PredictSum && getUnit(data.get('unit'))}</span>
			</div>)}
		</div>
		);
	}
	render() {
		let {data, summaryData, period, onEdit, onRefresh} = this.props;
		return (
			<div className='jazz-kpi-report'>
				<div style={{
					position: 'absolute',
    				right: 60
				}}>
				    {isFull() && <IconMenu
				    	useLayerForClickAway={true}
				      iconButtonElement={<IconButton><MoreVertIcon /></IconButton>}
				      anchorOrigin={{horizontal: 'right', vertical: 'top'}}
				      targetOrigin={{horizontal: 'right', vertical: 'top'}}
				    >
				      <MenuItem primaryText={I18N.Kpi.EditTarget} onClick={() => {
				      	onEdit(data.get('id'));
				      }}/>
				      <MenuItem primaryText={I18N.Kpi.UpdatePrediction} onClick={() => {
				      	onRefresh(data.get('id'));
				      }}/>
				    </IconMenu>}
				</div>
				<div className='jazz-kpi-report-chart'><KPIChart  LastMonthRatio={summaryData && summaryData.LastMonthRatio} period={period} data={data}/></div>
				<div className='jazz-kpi-report-summary'>
					{this.getValueSummaryItem()}
					{this.getPredictSummaryItem()}
				</div>
			</div>
		);
	}
}

const TipMessage = (props, context, updater) => {
	return (<div className='jazz-kpi-actuality flex-center'><b>{props.message}</b></div>)
}

export default class Actuality extends Component {
	constructor(props) {
		super(props);
		this._goCreate = this._goCreate.bind(this);
		this._onChange = this._onChange.bind(this);
		this._reload = this._reload.bind(this);
		this._cancleRefreshDialog = this._cancleRefreshDialog.bind(this);
		this._onGetBuildingList = this._onGetBuildingList.bind(this);
		this.state = this._getInitialState();
	}
	componentWillMount() {
		document.title = I18N.MainMenu.KPI;

		if( canView() ) {
			HierarchyAction.getBuildingListByCustomerId(this.props.router.params.customerId);
			UserAction.getCustomerByUser(CurrentUserStore.getCurrentUser().Id);
		}
		HierarchyStore.addBuildingListListener(this._onGetBuildingList);
		UserStore.addChangeListener(this._onGetBuildingList);
		SingleKPIStore.addChangeListener(this._onChange);
	}
	componentWillReceiveProps(nextProps) {
		this.setState(assign({}, this._getInitialState()), () => {
			if( canView() ) {
				HierarchyAction.getBuildingListByCustomerId(nextProps.router.params.customerId);
				UserAction.getCustomerByUser(CurrentUserStore.getCurrentUser().Id);
			}
		});
	}
	componentWillUnmount() {
		HierarchyStore.removeBuildingListListener(this._onGetBuildingList);
		UserStore.removeChangeListener(this._onGetBuildingList);
		SingleKPIStore.removeChangeListener(this._onChange);
	}
	_getInitialState() {
		return {
			loading: canView(),
			showCreate: false,
			showRefreshDialog: false,
			kpiId: null,
			year: null,
			hierarchyId: null
		}
	}
	_onChange() {
		this.setState({
			year: this.state.year || SingleKPIStore.getKPIDefaultYear(),
			loading: false
		});
	}
	_privilegedCustomer() {
		return getCustomerPrivilageById( this._getCustomerId() ) && getCustomerPrivilageById( this._getCustomerId() ).get('Privileged');
	}
	_onGetBuildingList() {

		if( UserStore.getUserCustomers().size > 0 && HierarchyStore.getBuildingList() ) {
			if( isOnlyView() ) {
				let hierarchyId;
				if( !this._privilegedCustomer() ) {
					if( isSingleBuilding() ) {
						hierarchyId = HierarchyStore.getBuildingList()[0].Id;
					}
				} else {
					hierarchyId = this._getCustomerId();
				}
				if( hierarchyId ) {
					this.setState({
						hierarchyId,
					});
					SingleKPIAction.getKPIConfigured(this._getCustomerId(), this.state.year, hierarchyId);
					return;
				}				
			}
			this.setState({
				loading: false
			});
		}
	}
	_goCreate() {
		this.setState({
			showCreate: true
		});
	}
	_cancleRefreshDialog() {
		this.setState({
			showRefreshDialog: false,
			kpiId: null
		});
	}
	_reload(year = this.state.year) {
		SingleKPIAction.getKPIConfigured(this.props.router.params.customerId, year, this.state.hierarchyId);
		this.setState({
			showRefreshDialog: false,
			showCreate: false,
			kpiId: null,
			loading: true,
		});
	}
	_getData(customerId, year, hierarchyId) {
		SingleKPIAction.initKPIChartData();
		SingleKPIAction.getKPIPeriodByYear(customerId, year);
		SingleKPIAction.getKPIChart(customerId, year, hierarchyId);
		SingleKPIAction.getKPIChartSummary(customerId, year, hierarchyId);
	}
	_getCustomerId() {
		return this.props.params.customerId;
	}
	render() {
		if( this.state.loading ) {
			return (
				<div className='jazz-kpi-actuality flex-center'><CircularProgress  mode="indeterminate" size={80} /></div>
			);
		}
		if( !canView() ) {
			return (<TipMessage message={I18N.Kpi.Error.KPIConguredNotAnyBuilding}/>);
		}
		let wholeCustomer = this._privilegedCustomer();
		if( isOnlyView() ) {
			if( !wholeCustomer && !isSingleBuilding() ) {
				return (<TipMessage message={I18N.Kpi.Error.KPIConguredMoreBuilding}/>);
			}

			if( SingleKPIStore.chartReady() && !SingleKPIStore.getKPIChart() ) {
				return (<TipMessage message={I18N.Kpi.Error.NonKPIConguredSingleBuilding}/>);
			}
		}
		/*if(isOnlyView()) {
			if(!HierarchyStore.getBuildingList() || HierarchyStore.getBuildingList().length === 0) {
				return (<TipMessage message={I18N.Kpi.Error.KPIConguredNotAnyBuilding}/>);
			} else if( HierarchyStore.getBuildingList().length > 1 && !hasAllPrivilege() ) {
				return (<TipMessage message={I18N.Kpi.Error.KPIConguredMoreBuilding}/>);
			} else if( !SingleKPIStore.getKPIChart() ) {
				return (<TipMessage message={I18N.Kpi.Error.NonKPIConguredSingleBuilding}/>);
			}
		} else if( !getCustomerById( this._getCustomerId() ).WholeCustomer ) {
			return (<TipMessage message={I18N.Kpi.Error.KPIConguredNotAnyBuilding}/>);
		}*/
		let disabledSelectedProject = isFull() && !wholeCustomer;

		if( this.state.showCreate ) {
			return (<CreateKPI
				hierarchyId={this.state.hierarchyId}
				hierarchyName={getHierarchyNameById(this.state.hierarchyId)}
				kpiId={this.state.kpiId}
				isCreate={!this.state.kpiId}
				onSave={this._reload}
				onCancel={this._reload}
				year={this.state.year || new Date().getFullYear()}/>);
		} else {
			let buildingProps = {
		        ref: 'commodity',
		        isViewStatus: false,
		        defaultValue: this.state.hierarchyId,
		        style: {
		        	width: 240,
		        	margin: '0 20px',
		        },
		        didChanged: (hierarchyId) => {
		        	SingleKPIAction.getKPIConfigured(this.props.router.params.customerId, this.state.year, hierarchyId);
					this.setState({hierarchyId});
		        },
		        disabled: disabledSelectedProject,
		        textField: 'Name',
		        valueField: 'Id',
		        dataItems: [{
		        	Id: null,
		        	disabled: true,
		        	Name: I18N.Setting.KPI.SelectProject
		        }].concat(groupProjectMenuItems(this.props.params.customerId))
		        .concat(singleProjectMenuItems()),
		    };
			return (
				<div className='jazz-kpi-actuality'>
					<ActualityHeader
						hierarchyId={this.state.hierarchyId}
						buildingProps={buildingProps}
						goCreate={this._goCreate}/>
					{disabledSelectedProject ? (<div className='flex-center'><b>{I18N.Kpi.Error.KPIConguredNotAnyBuilding}</b></div>) :
					(<ActualityContent
						chartReady={SingleKPIStore.chartReady()}
						period={SingleKPIStore.getYearQuotaperiod()}
						hierarchyId={this.state.hierarchyId}
						data={SingleKPIStore.getKPIChart()}
						year={this.state.year}
						summaryData={SingleKPIStore.getKPIChartSummary()}
						onChangeYear={(year) => {
			        		this._getData(this.props.router.params.customerId, year, this.state.hierarchyId);
							this.setState({year});
						}}
						onEdit={(Id) => {
							this.setState({
								showCreate: true,
								kpiId: Id
							});
						}}
						onRefresh={(Id) => {
							this.setState({
								showRefreshDialog: true,
								kpiId: Id
							});
						}}
					/>)}
					{this.state.showRefreshDialog && <UpdatePrediction
						hierarchyId={this.state.hierarchyId}
						hierarchyName={getHierarchyNameById(this.state.hierarchyId)}
						kpiId={this.state.kpiId}
						isCreate={!this.state.kpiId}
						onSave={this._reload}
						onCancel={this._cancleRefreshDialog}
						year={this.state.year}/>}
				</div>
			);
		}
	}
}
