import React, { Component, PropTypes } from 'react';
import {GenerateSolution} from './GenerateSolution.jsx';
import ChartBasicComponent from './ChartBasicComponent.jsx';
import {flowRight, curryRight} from 'lodash/function';

import FolderAction from 'actions/FolderAction.jsx';
import FolderStore from 'stores/FolderStore.jsx';

function getFromImmu(key) {
	return function(immuObj) {
		return immuObj.get(key);
	}
};

const getId = getFromImmu('Id');
const getName = getFromImmu('Name');

function getTagsDataByNode(props) {
	props.nodes.map(flowRight(FolderAction.getTagsDataByNodeId, getId));
}

function getChartTypeStr(data) {
	let chartType = 'line';
	switch (data.get('ChartType')) {
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
    };
    this._onChange = this._onChange.bind(this);
    // this._setStateValue = this._setStateValue.bind(this);
    // this._setIdx = this._setIdx.bind(this);
    // this._onDelete = this._onDelete.bind(this);
    // this._renderHighChart = this._renderHighChart.bind(this);
    this._renderChart = this._renderChart.bind(this);
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
  _renderChart(node,afterChartCreated){
    let nodeId = getId(node),
		{tagDatas, widgetStatuss, widgetSeriesArrays, contentSyntaxs} = this.state;
    if(!tagDatas[nodeId]) return null
    return(
      <ChartBasicComponent
        afterChartCreated={afterChartCreated}
        ref='ChartBasicComponent'
        key={nodeId}
        node={node}
        tagData={tagDatas[nodeId]}
        widgetStatus={widgetStatuss[nodeId]}
        widgetSeriesArray={widgetSeriesArrays[nodeId]}
        contentSyntax={contentSyntaxs[nodeId]}
        chartType={getChartTypeStr(node)}/>
    )
  }
  render(){
    return(
      <GenerateSolution {...this.props} renderChartCmp={this._renderChart}/>
    )
  }


}
