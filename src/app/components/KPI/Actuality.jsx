import React, { Component } from 'react';
import moment from 'moment';

import KPIAction from 'actions/KPI/KPIAction.jsx'
import KPIStore from 'stores/KPI/KPIStore.jsx'
import ViewableDropDownMenu from 'controls/ViewableDropDownMenu.jsx';
import FlatButton from 'controls/FlatButton.jsx';
import LinkButton from 'controls/LinkButton.jsx';

import CreateKPI from './KPI.jsx';

import Highcharts from '../highcharts/Highcharts.jsx';

const DEFAULT_OPTIONS = {
    credits: {
        enabled: false
    },
    chart: {
    	// height: 500,
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
        text: '用电量'
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
            text: 'kWh'
        }
    },
    tooltip: {
        crosshairs: {
            width: 1.5,
            color: 'black',
        	zIndex: 3
        },
        headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
        pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
            '<td style="padding:0"><b>{point.y:.1f} mm</b></td></tr>',
        footerFormat: '</table>',
        shared: true,
        useHTML: true
    },
    plotOptions: {
        column: {
            grouping: false,
            pointPadding: 0.2,
            borderWidth: 0
        }
    },
    series: [ {
        name: '指标值',
        type: 'spline',
        marker: {
	        lineWidth: 3,
	        lineColor: window.Highcharts.getOptions().colors[0],
	        fillColor: 'white',
	    },
        zIndex: 2,
        data: [48.9, 38.8, 39.3, 41.4, 47.0, 48.3, 59.0, 59.6, 52.4, 65.2, 59.3, 51.2],
    },{
        name: '实际值',
        type: 'column',
        pointPadding: 0.4,
        pointPlacement: 0,
        color: '#90ed7d',
        data: [49.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4]
    }, {
        name: '预测值',
        type: 'column',
        pointPadding: 0.2,
        pointPlacement: 0,
		borderColor: '#434348',
        borderWidth: 1,
		dashStyle: 'dash',
		color: 'rgba(255, 255, 255, 0.1)',
        data: [83.6, 78.8, 98.5, 93.4, 106.0, 84.5, 105.0, 104.3, 91.2, 83.5, 106.6, 92.3],

    },]
};

class KPIChart extends Component {
	_generatorOptions() {
		return DEFAULT_OPTIONS;
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
				<div className='jazz-kpi-report-chart'><KPIChart/></div>
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
