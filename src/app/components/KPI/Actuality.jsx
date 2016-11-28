import React, { Component } from 'react';
import moment from 'moment';
import classnames from 'classnames';
import CircularProgress from 'material-ui/CircularProgress';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';

import KPIAction from 'actions/KPI/KPIAction.jsx'
import HierarchyAction from 'actions/HierarchyAction.jsx'
import KPIStore from 'stores/KPI/KPIStore.jsx'
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

import CreateKPI from './KPI.jsx';

import Highcharts from '../highcharts/Highcharts.jsx';

function isSingleBuilding() {
	return true || (HierarchyStore.getBuildingList() && HierarchyStore.getBuildingList().length === 1)
		&& privilegeUtil.isView(PermissionCode.INDEX_AND_REPORT, CurrentUserStore.getCurrentPrivilege());
}

function getHierarchyNameById(Id) {
	return CurrentUserCustomerStore.getCurrentCustomerBuildingList().filter( building => building.Id === Id )[0].Name;
}

const DEFAULT_OPTIONS = {
    credits: {
        enabled: false
    },
    chart: {
    	spacingBottom: 0,
      	events: {
          	load: function () {
              	let lastLegendItems = document.querySelectorAll('.highcharts-legend .highcharts-legend-item:nth-of-type(3) rect');
              	if(lastLegendItems) {
	              	lastLegendItems.forEach((item) => {
	              		item.setAttribute('width', item.getAttribute('width') * 1  - 1);
	              		item.setAttribute('height', item.getAttribute('height') * 1  - 1);
	              		item.setAttribute('y', item.getAttribute('y') * 1 + 1);
	              		item.setAttribute('stroke', '#434348');
			            item.setAttribute('stroke-width', 1);
						item.setAttribute('stroke-dasharray', '4,3');
	              	})
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
        categories: [
            'Jan',
            'Feb',
            'Mar',
            'Apr',
            'May',
            'Jun',
            'Jul',
            'Aug',
            'Sep',
            'Oct',
            'Nov',
            'Dec'
        ],
    },
    yAxis: {
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
        type: 'spline',
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
        dataLabels: {
            enabled: true,
            useHTML: true,
            borderRadius: 5,
            backgroundColor: 'rgba(252, 255, 197, 0.7)',
            borderWidth: 1,
            borderColor: '#AAA',
            y: -6,
      //       formatter: function() {
      //       	if(this.point.index === 2) {
      //       		return `
						// <div class='actuality-fractional-energy-saving-tooltip'>
						// 	<div>截至上月节能率</div>
						// 	<div>9%</div>
						// </div>
      //       		`
      //       	}
      //       }
        },
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
		let {data} = this.props;
		let options = util.merge(true, {}, DEFAULT_OPTIONS, {
		});

		let unit = UOMStore.getUoms()[data.get('unit')].Code;

		options.yAxis.title.text = unit;
	    options.tooltip.formatter = function() {
	    	var data1 = this.points[0];
	    	var data2 = this.points[1];
	    	var data3 = this.points[2];
	    	let list = '';
	    	let title = '';
	    	let targetVal = 0;
	    	let actualVal = 0;
	    	this.points.forEach(data => {
	    		if(data) {
	    			if(data.series.name === I18N.Kpi.TargetValues) {
	    				targetVal = data.y;
			    		list += `
			    		<tr>
					    	<td style="color:${data.series.color};padding:0">● ${data.series.name}: </td>
					    	<td style="padding:0">${data.y + ' ' + unit}</td>
				    	</tr>
			    		`;
	    			}
	    			if(data.series.name === I18N.Kpi.ActualValues) {
	    				actualVal = data.y;
			    		list += `
			    		<tr>
					    	<td style="color:${data.series.color};padding:0">■ ${data.series.name}: </td>
					    	<td style="padding:0">${data.y + ' ' + unit}</td>
				    	</tr>
			    		`;
	    			}
	    			if(data.series.name === I18N.Kpi.PredictionValues) {
			    		list += `
			    		<tr>
					    	<td style="color:#434348;padding:0"><div style='    margin-right: 4px;border-color:#434348;border-width:1px;border-style:dotted;display:inline-block;width:6px;height:6px'></div>${data.series.name}: </td>
					    	<td style="padding:0">${data.y + ' ' + unit}</td>
				    	</tr>
			    		`;
	    			}
	    		}
	    	});
	    	if(targetVal) {
	    		title = `<b>${I18N.Kpi.ThisMonthUsaged + (actualVal * 100 / targetVal).toFixed()}%</b>`;
	    	}
	    	return `
	    	<table>
	    		${title}
	    		${list}
	    	</table>
	    	`;
	    };

		options.title.text = data.get('name');

		options.series[0].data = data.get('target') && data.get('target').toJS();
		options.series[0].name = I18N.Kpi.TargetValues;
		options.series[1].data = data.get('actual') && data.get('actual').toJS();
		options.series[1].name = I18N.Kpi.ActualValues;
		options.series[2].data = data.get('prediction') && data.get('prediction').toJS();
		options.series[2].name = I18N.Kpi.PredictionValues;

		let tooltipIndex = 3;/* options.series[1].data.findLastIndex(((data, index) => {
			return index < new Date().getMonth()
		}))*/

		options.series[1].dataLabels.formatter = function() {
        	if(this.point.index === tooltipIndex) {
        		return `
					<div class='actuality-fractional-energy-saving-tooltip'>
						<div>${I18N.Kpi.ActualityFractionalEnergySaving}</div>
						<div>${data.lastMonthSaving + '%'}</div>
					</div>
        		`
        	}
        }

		return options;
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
				<div>{!isSingleBuilding() && <span>{I18N.Kpi.SingleProject}-</span>}{I18N.Kpi.KPIActual}</div>
				{!isSingleBuilding() && <ViewableDropDownMenu {...this.props.buildingProps}/>}
				{!isSingleBuilding() && <FlatButton disabled={!this.props.hierarchyId} label={'+ 指标'} onClick={this.props.goCreate}/>}
			</div>
		);
	}
}

class ActualityContent extends Component {
	render() {
		let {data, summaryData, year, onChangeYear, hierarchyId, onEdit, onRefresh} = this.props;
		if( !isSingleBuilding() ) {
			if( !hierarchyId ) {
				return (<div className="content flex-center"><b>{I18N.Kpi.Error.SelectBuilding}</b></div>);
			}
			if( !data ) {
				return (<div className="content flex-center"><b>{I18N.Kpi.Error.NonKPICongured}</b></div>);
			}
		}
		if( !summaryData || !data ) {
			return (<div className="content flex-center"><CircularProgress  mode="indeterminate" size={80} /></div>);
		}
		let tags = data.get('data');
		return (
			<div className='content'>
				<div className='action-bar'>
					<LinkButton iconName={ "icon-arrow-left" } disabled={year < 2000} onClick={() => {
						onChangeYear(year - 1);
					}}/>
					<span className='current-year'>{year}</span>
					<LinkButton iconName={ "icon-arrow-right" } disabled={year >= new Date().getFullYear()} onClick={() => {
						onChangeYear(year + 1);
					}}/>
				</div>
	      		<div>
				{(tags && tags.size > 0) ?
					tags.map( (tag, i) => <KPIReport onEdit={onEdit} onRefresh={onRefresh} data={tag} summaryData={summaryData[i]} key={tag.get('id')}/> ) :
				<div>{I18N.Kpi.Error.NonQuotaConguredInThisYear}</div>}
			</div>
			</div>
		);
	}
}

class KPIReport extends Component {
	render() {
		let {data, summaryData, onEdit, onRefresh} = this.props;
		return (
			<div className='jazz-kpi-report'>
				<div style={{
					position: 'absolute',
    				right: 60
				}}>
				    <IconMenu
				    	useLayerForClickAway={true}
				      iconButtonElement={<IconButton><MoreVertIcon /></IconButton>}
				      anchorOrigin={{horizontal: 'right', vertical: 'top'}}
				      targetOrigin={{horizontal: 'right', vertical: 'top'}}
				    >
				      <MenuItem primaryText={I18N.Kpi.EditTarget} onClick={() => {
				      	onEdit(data.get('Id'));
				      }}/>
				      <MenuItem primaryText={I18N.Kpi.UpdatePrediction} onClick={() => {
				      	onRefresh(data.get('Id'));
				      }}/>
				    </IconMenu>
				</div>
				<div className='jazz-kpi-report-chart'><KPIChart data={data}/></div>
				<div className='jazz-kpi-report-summary'>
					<div className='summary-item'>
						<div className='summary-title'>全年定额指标</div>
						<div className='summary-value'>
							<span>{summaryData.actual[0]}</span><span>{summaryData.actual[1]}</span>
						</div>
					</div>
					<div className={classnames('summary-item', {overproof: summaryData.Overproof})}>
						<div className='summary-title'>全年用量预测值</div>
						<div className='summary-value'>
							<span>{summaryData.target[0]}</span><span>{summaryData.target[1]}</span>
						</div>
					</div>
				</div>
			</div>
		);
	}
}


export default class Actuality extends Component {
	constructor(props) {
		super(props);
		this._goCreate = this._goCreate.bind(this);
		this._onChange = this._onChange.bind(this);
		this._onGetBuildingList = this._onGetBuildingList.bind(this);
		this.state = {
			loading: false,
			showCreate: false,
			showRefreshDialog: false,
			kpiId: null,
			year: moment().year(),
			hierarchyId: null
		}
	}
	componentWillMount() {
		this.setState({
			loading: true
		});
		HierarchyAction.getBuildingListByCustomerId(this.props.router.params.customerId);
		// KPIAction.getKPIConfigured(this.props.router.params.customerId, this.state.year, this.state.hierarchyId);
		HierarchyStore.addBuildingListListener(this._onGetBuildingList);
		KPIStore.addChangeListener(this._onChange);
	}
	componentWillReceiveProps(nextProps) {
		HierarchyAction.getBuildingListByCustomerId(nextProps.router.params.customerId);
		// KPIAction.getKPIConfigured(nextProps.router.params.customerId, this.state.year, this.state.hierarchyId);
	}
	componentWillUnmount() {
		HierarchyStore.removeBuildingListListener(this._onGetBuildingList);
		KPIStore.removeChangeListener(this._onChange);
	}
	_onChange() {
		this.setState({
			loading: false
		});
	}
	_onGetBuildingList() {
		let buildingList = HierarchyStore.getBuildingList();
		if( buildingList && buildingList.length > 0 ) {
			if(isSingleBuilding()) {
				let hierarchyId = buildingList[0].Id
				this.setState({
					hierarchyId,
				});
				KPIAction.getKPIConfigured(this.props.router.params.customerId, this.state.year, this.state.hierarchyId);
				return;
			}
		}		
		this.setState({
			loading: false
		});
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
	_reload() {
		window.document.location.reload();
		// this.setState({
		// 	showCreate: false
		// });
	}
	_getData(customerId, year, hierarchyId) {
		KPIAction.initKPIChartData();
		KPIAction.getKPIChart(customerId, year, hierarchyId);
		KPIAction.getKPIChartSummary(customerId, year, hierarchyId);
	}
	render() {
		if( this.state.loading ) {
			return (
				<div className='flex-center'><CircularProgress  mode="indeterminate" size={80} /></div>
			);
		}
		if(isSingleBuilding() && !KPIStore.getKPIChart()) {
			return (
				<div className='flex-center'><b>{I18N.Kpi.Error.NonQuotaConguredSingleBuilding}</b></div>
			)
		}
		//for test
		if( this.state.showCreate ) {
			return (<CreateKPI
				// hierarchyId={this.state.hierarchyId}
				// hierarchyName={getHierarchyNameById(this.state.hierarchyId)}
				kpiId={this.state.kpiId}
				isCreate={!this.state.kpiId}
				onSave={this._reload}
				onCancel={this._reload}
				year={this.state.year}/>);
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
		        	KPIAction.getKPIConfigured(this.props.router.params.customerId, this.state.year, hierarchyId);
					this.setState({hierarchyId});
		        },
		        textField: 'Name',
		        valueField: 'Id',
		        dataItems: [{
		        	Id: null,
		        	disabled: true,
		        	Name: I18N.Setting.KPI.SelectBuilding
		        }].concat(HierarchyStore.getBuildingList()),
		    };
			return (
				<div className='jazz-kpi-actuality'>
					<ActualityHeader
						hierarchyId={this.state.hierarchyId}
						buildingProps={buildingProps}
						goCreate={this._goCreate}/>
					<ActualityContent
						hierarchyId={this.state.hierarchyId}
						data={KPIStore.getKPIChart()}
						year={this.state.year}
						summaryData={KPIStore.getKPIChartSummary()}
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
					/>
				</div>
			);
		}
	}
}
