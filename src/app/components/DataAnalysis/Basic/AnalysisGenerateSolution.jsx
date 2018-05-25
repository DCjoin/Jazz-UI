import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';

import Immutable from 'immutable';
import {flowRight, curryRight} from 'lodash-es';

import CommonFuns from 'util/Util.jsx';
import RoutePath from 'util/RoutePath.jsx';

import ScatterPlotAction from 'actions/DataAnalysis/scatter_plot_action.jsx';
import BubbleAction from 'actions/DataAnalysis/bubble_action.jsx';
import FolderAction from 'actions/FolderAction.jsx';
import DiagnoseAction from 'actions/Diagnose/DiagnoseAction.jsx';

import FolderStore from 'stores/FolderStore.jsx';
import MultipleTimespanStore from 'stores/Energy/MultipleTimespanStore.jsx';

import ChartBasicComponent from './ChartBasicComponent.jsx';
import HeatMap from './heat_map.jsx';
import ScatterPlotView from './scatter_plot_generate_sulution.jsx';
import BubbleView from './bubble_generate_solution.jsx';
import GenerateSolution from '../../Diagnose/generate_solution.jsx';
// import {GenerateSolution, getTagsByChartData} from './GenerateSolution.jsx';
import PrivilegeUtil from 'util/privilegeUtil.jsx';
import PermissionCode from 'constants/PermissionCode.jsx';
import CurrentUserStore from 'stores/CurrentUserStore.jsx';

function SolutionFull() {
  return PrivilegeUtil.isFull(PermissionCode.SOLUTION_FULL, CurrentUserStore.getCurrentPrivilege());
}

const SVG_WIDTH = 750;
const SVG_HEIGHT = 360;

function getFromImmu(key) {
	return function(immuObj) {
		return immuObj.get(key);
	}
};

const getId = getFromImmu('Id');
const getName = getFromImmu('Name');
const TOU_NAME=[I18N.EM.Peak,I18N.EM.Plain,I18N.EM.Valley];

function initSolution(hierarchyId, nodes, svgStrings, tagIds) {
  return Immutable.fromJS({
    "Problem": {
      "HierarchyId": hierarchyId,
      "TagIds": tagIds,
      "Name": "",
      "EnergySys": 0,
      "IsFocus": true,
      "Description": "",
      "Status": 1,
      "IsConsultant": SolutionFull(),
      "EnergyProblemImages": nodes.map( node => ({ Id: getId(node), Name: getName(node), Content: svgStrings[getId(node)] }) ),
      "ProblemTypeId": 0,
      "SolutionTitle": "",
      "DataLabelId": 0,
      "DataLabelName": ""
    },
    "Solutions": [
      {
        "Name": "",
        "EnergySavingUnit": "",
        "ROI": 0,
        "SolutionDescription": "",
        "SolutionImages": []
      }
    ],
    "Remarks": [],
    "EnergyEffectStatus": true
  });
}

function getTagsDataByNode(props) {
	props.nodes.map(flowRight(FolderAction.getTagsDataByNodeId, getId));
}

function getChartTypeStr(data) {
	let chartType = 'line';
	switch (parseInt(data.get('ChartType'))) {
		case 1:
			chartType = 'line';
			break;
		case 2:
			chartType = 'column';
			break;
		case 3:
			chartType = 'stack';
			break;
		case 4:
			chartType = 'pie';
			break;
		case 5:
			chartType = 'rawdata';
			break;
    case 7:
			chartType = 'heatmap';
			break;
    case 8:
			chartType = 'scatterplot';
			break;
    case 9:
			chartType = 'bubble';
			break;
	}
	// switch (chartType) {
	// 	case 'line':
	// 	case 'column':
	// 	case 'stack':
	// 		EnergyStore.initReaderStrategy('EnergyTrendReader');
	// 		break;
	// 	case 'pie':
	// 		EnergyStore.initReaderStrategy('EnergyPieReader');
	// 		break;
	// 	case 'rawdata': EnergyStore.initReaderStrategy('EnergyRawGridReader');
	// 		break;
	// }
	return chartType;
}

export default class AnalysisGenerateSolution extends Component {
	static propTypes = {
		nodes: PropTypes.arrayOf(PropTypes.object),
		onRequestClose: PropTypes.func,
	};
  constructor(props) {
    super(props);

    this.state = {
      tagDatas: {},
      svgStrings: {},
    };
    this._onChange = this._onChange.bind(this);
    // this._setStateValue = this._setStateValue.bind(this);
    // this._setIdx = this._setIdx.bind(this);
    // this._onDelete = this._onDelete.bind(this);
    // this._renderHighChart = this._renderHighChart.bind(this);
    this._renderChart = this._renderChart.bind(this);
    this._bindAfterChartCreate = this._bindAfterChartCreate.bind(this);
    this._getTagsDataByNode = this._getTagsDataByNode.bind(this);

    if(props.preAction && typeof props.preAction.action === 'function') {
      let {action, addListener} = props.preAction;
      if( addListener && typeof addListener === 'function' ) {
        addListener(this._getTagsDataByNode);
      }
      if( action() ) {
        getTagsDataByNode(props);
      }
    } else {
      getTagsDataByNode(props);
    }

    FolderStore.addSolutionChangeListener(this._onChange);
  }
  componentWillUnmount() {
    FolderStore.removeSolutionChangeListener(this._onChange);
    if(this.props.preAction && typeof this.props.preAction.removeListener === 'function') {
      this.props.preAction.removeListener(this._getTagsDataByNode);
    }
    // ScatterPlotAction.clearAxis();
    // BubbleAction.clearAxis();
  }
  _getTagsDataByNode() {
    getTagsDataByNode(this.props);
  }
  _onChange(data, nodeId) {
    let tagData = data.get('EnergyViewData'),
    widgetStatus = data.get('WidgetStatus'),
    contentSyntax = data.get('ContentSyntax'),
    widgetSeriesArray = data.get('WidgetSeriesArray');
    this.setState({
      widgetStatus,
      widgetSeriesArray,
      tagDatas: {...this.state.tagDatas, ...{
        [nodeId]: tagData
      }},
      widgetStatuss: {...this.state.widgetStatuss, ...{
        [nodeId]: widgetStatus
      }},
      widgetSeriesArrays: {...this.state.widgetSeriesArrays, ...{
        [nodeId]: widgetSeriesArray
      }},
      contentSyntaxs: {...this.state.contentSyntaxs, ...{
        [nodeId]: contentSyntax
      }}
    });
  }

  _bindAfterChartCreate(id) {
    return () => {
      let svgString,
      parent = ReactDOM.findDOMNode(this).querySelector('#chart_basic_component_' + id);
      if(parent && parent.querySelector('svg')) {
        svgString = new XMLSerializer().serializeToString(parent.querySelector('svg'));
      }
      if( svgString ) {
        this.setState({
          svgStrings: {...this.state.svgStrings, ...{
            [id]: svgString
          }},
        });
      }
    }
  }

  _renderChart(node/*,afterChartCreated*/){
    let me=this;
    let nodeId = getId(node),
		{tagDatas, widgetStatuss, widgetSeriesArrays, contentSyntaxs} = this.state;
    if( this.state.svgStrings[nodeId] ) return null;
    if(!tagDatas[nodeId]) return null;
    var currentChartType=getChartTypeStr(widgetSeriesArrays[nodeId].getIn([0]));
    let afterChartCreated = this._bindAfterChartCreate(nodeId);
    let chartPanel;
    if(currentChartType==='heatmap'){
      var  startDate = CommonFuns.DataConverter.JsonToDateTime(tagDatas[nodeId].getIn(['TargetEnergyData',0,'Target','TimeSpan','StartTime']), true),
           endDate = CommonFuns.DataConverter.JsonToDateTime(tagDatas[nodeId].getIn(['TargetEnergyData',0,'Target','TimeSpan','EndTime']), true);

      let properties = {
        ref: 'chart',
        isFromSolution:true,
        energyData: me.props.analysis?me.props.analysis.state.energyRawData:tagDatas[nodeId].toJS(),
        startDate,endDate,
        afterChartCreated,
      };
      chartPanel = (
        <HeatMap {...properties}></HeatMap>
      )
    }else if(currentChartType==='scatterplot'){
        var syntaxObj = JSON.parse(contentSyntaxs[nodeId]);
        var xAxisTagId, yAxisTagId,step, timeRanges;
        if( syntaxObj && syntaxObj.viewOption && syntaxObj.viewOption.TimeRanges ) {
        let TimeRanges = syntaxObj.viewOption.TimeRanges;
        MultipleTimespanStore.initDataByWidgetTimeRanges(TimeRanges);
        timeRanges = MultipleTimespanStore.getSubmitTimespans();
        xAxisTagId=syntaxObj.tagIds[0];
        yAxisTagId=syntaxObj.tagIds[1];
        step=syntaxObj.viewOption.Step;
        chartPanel = (
          <ScatterPlotView xAxisTagId={xAxisTagId}
                           yAxisTagId={yAxisTagId}
                           timeRanges={timeRanges}
                           step={step}
                           afterChartCreated={afterChartCreated}/>
        )
      }
    }else if(currentChartType==='bubble'){
        var syntaxObj = JSON.parse(contentSyntaxs[nodeId]);
        var xAxisTagId, yAxisTagId,areaTagId,step, timeRanges;
        if( syntaxObj && syntaxObj.viewOption && syntaxObj.viewOption.TimeRanges ) {
        let TimeRanges = syntaxObj.viewOption.TimeRanges;
        MultipleTimespanStore.initDataByWidgetTimeRanges(TimeRanges);
        timeRanges = MultipleTimespanStore.getSubmitTimespans();
        xAxisTagId=syntaxObj.tagIds[0];
        yAxisTagId=syntaxObj.tagIds[1];
        areaTagId=syntaxObj.tagIds[2];
        step=syntaxObj.viewOption.Step;
        chartPanel = (
          <BubbleView ref={xAxisTagId+'_'+yAxisTagId+"_"+areaTagId}
                           xAxisTagId={xAxisTagId}
                           yAxisTagId={yAxisTagId}
                           areaTagId={areaTagId}
                           timeRanges={timeRanges}
                           step={step}
                           afterChartCreated={afterChartCreated}/>
        )
      }
    }else{
      chartPanel = (
        <ChartBasicComponent
          afterChartCreated={afterChartCreated}
          ref='ChartBasicComponent'
          key={nodeId}
          node={node}
          tagData={tagDatas[nodeId]}
          widgetStatus={widgetStatuss[nodeId]}
          widgetSeriesArray={widgetSeriesArrays[nodeId]}
          contentSyntax={contentSyntaxs[nodeId]}
          chartType={currentChartType}
          postNewConfig={(chartCmpObj) => {
  		      let newConfig = CommonFuns.merge(true, chartCmpObj);
            let wss = widgetStatuss[nodeId] && JSON.parse(widgetStatuss[nodeId]);
            let touType=false;

            if( wss && wss.length > 0 ) {
             for (var i = 0, len = wss.length; i < len; i++) {
               if (wss[i].WidgetStatusKey === "TouTariff") {
                  touType=wss[i].WidgetStatusValue==='true';
                  break;
                }
              }
            }
            if(touType){
              if(currentChartType==='pie'){
                newConfig.legend.title={
                  text:newConfig.series[0].data[0].name
                };
                newConfig.series[0].data=newConfig.series[0].data.map((item,i)=>{
                  item.name=TOU_NAME[i];
                  return item;
                })
              }else{
               newConfig.legend.title={
                text:newConfig.series[0].name
                };
              newConfig.series = newConfig.series.map((serie, i)=>{
               serie.name=TOU_NAME[i]
                return serie;
               });
              }
            }
            return newConfig;
          }
        }
      />
      )
    }

    return (
      <div style={{position: 'relative', overflowX: 'hidden', height: SVG_HEIGHT, width: SVG_WIDTH}}>
        <div id={'chart_basic_component_' + nodeId} style={{
            flex: 1,
            position: 'absolute',
            width: SVG_WIDTH,
            height: SVG_HEIGHT,
            display: 'flex',
            opacity: 0,
            flexDirection: 'column',
            marginBottom: '0px',
            marginLeft: '9px'
          }}>
          {chartPanel}
        </div>
      </div>
    );

  }
  render(){
    let { hierarchyId, nodes, onRequestClose, router, params, tagIds } = this.props;
    return(
      <GenerateSolution
        onCancel={onRequestClose}
        onBack={onRequestClose}
        onCreate={(data) => {
          DiagnoseAction.createSolution(data, () => {
            router.replace(RoutePath.ecm(params)+'?init_hierarchy_id='+hierarchyId);
          });
        }}
        renderChart={() => nodes.map(this._renderChart)}
        energySolution={initSolution(hierarchyId, nodes, this.state.svgStrings, tagIds)}/>
    )
  }
  /*<GenerateSolution {...this.props} renderChartCmp={this._renderChart}/>*/


}
