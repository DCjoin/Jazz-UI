import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import {flowRight, curryRight} from 'lodash';
import FontIcon from 'material-ui/FontIcon';
import CircularProgress from 'material-ui/CircularProgress';

import Util from 'util/Util.jsx';
import PrivilegeUtil from 'util/privilegeUtil.jsx';

import Dialog from 'controls/NewDialog.jsx';
import FlatButton from 'controls/FlatButton.jsx';
import NewFlatButton from 'controls/NewFlatButton.jsx';
import LinkButton from 'controls/LinkButton.jsx';
import ViewableTextField from 'controls/ViewableTextField.jsx';
import ViewableDropDownMenu from 'controls/ViewableDropDownMenu.jsx';

import {ProblemMarkEnum} from 'constants/AnalysisConstants.jsx';
import PermissionCode from 'constants/PermissionCode.jsx';

import ChartBasicComponent from './ChartBasicComponent.jsx';

import FolderAction from 'actions/FolderAction.jsx';
import FolderStore from 'stores/FolderStore.jsx';
import EnergyStore from 'stores/Energy/EnergyStore.jsx';
import CurrentUserStore from 'stores/CurrentUserStore.jsx';
import MeasuresStore from 'stores/ECM/MeasuresStore.jsx';

function SolutionFull() {
	return PrivilegeUtil.isFull(PermissionCode.SOLUTION_FULL, CurrentUserStore.getCurrentPrivilege());
}
function PushFull() {
	return PrivilegeUtil.isFull(PermissionCode.PUSH_SOLUTION, CurrentUserStore.getCurrentPrivilege());
}



function getFromImmu(key) {
	return function(immuObj) {
		return immuObj.get(key);
	}
};

function getValByObj(obj) {
	return function(key) {
		return obj[key];
	}
}

const getId = getFromImmu('Id');
const getName = getFromImmu('Name');

// function getTagsDataByNode(props) {
// 	props.nodes.map(flowRight(FolderAction.getTagsDataByNodeId, getId));
// }

function getProblemMarkMenuItem() {
	return [{
		payload: 0,
		text: I18N.Common.Label.CommoEmptyText,
		disabled: true,
	}].concat(Object.keys(ProblemMarkEnum).map(key => {return {
		payload: ProblemMarkEnum[key],
		text: I18N.Setting.DataAnalysis.EnergyProblem.MarkEnum[ProblemMarkEnum[key]]
	}}));
}

export class Gallery extends Component {
	render() {
		let {names, selectedIdx, onLeft, onRight, onDelete, renderContent} = this.props;
		return (
			<div className='jazz-scheme-gallery'>
				<div className='jazz-scheme-gallery-action'>
					{selectedIdx > 0 && <LinkButton iconName={'icon-arrow-left'} onClick={onLeft}/>}
				</div>
				<div className='jazz-scheme-gallery-content'>
					<div className='jazz-scheme-gallery-content-header'>
						{`(${selectedIdx+1}/${names.length})${names[selectedIdx]}`}
						{names.length > 1 && <LinkButton className='jazz-scheme-gallery-content-header-delete' label={I18N.Common.Button.Delete} onClick={onDelete}/>}
					</div>
					{renderContent()}
				</div>
				<div className='jazz-scheme-gallery-action'>
					{selectedIdx < names.length - 1 && <LinkButton iconName={'icon-arrow-right'} onClick={onRight}/>}
				</div>
			</div>
		);
	}
}


class OnceHidePanel extends Component {
	constructor(props) {
		super(props);
		this.state = {
			hide: true
		}
	}
	render() {
		if(this.state.hide) {
			return <LinkButton label={this.props.label} onClick={() => {this.setState({hide: false})}}/>
		}
		return this.props.children;
	}
}


export class GenerateSolution extends Component {
	static propTypes = {
		nodes: PropTypes.arrayOf(PropTypes.object),
		onRequestClose: PropTypes.func,
		renderChartCmp: PropTypes.func
	};
	static contextTypes = {
		hierarchyId: PropTypes.string
	};
	constructor(props) {
		super(props);

		this.state = {
			idx: 0,
			nodes: props.nodes,
			//tagDatas: {},
			svgStrings: {},
			ProblemName: null,
			ProblemMark: 0,
			ProblemDesc: null,
			SaveName: null,
			SaveValue: null,
			SaveUnit: null,
			SaveCost: null,
			SaveDesc: null,
			showDelete: false,
		};
		//this._onChange = this._onChange.bind(this);
		this._afterChartCreated = this._afterChartCreated.bind(this);
		this._setStateValue = this._setStateValue.bind(this);
		this._setIdx = this._setIdx.bind(this);
		this._onDelete = this._onDelete.bind(this);
		this._renderHighChart = this._renderHighChart.bind(this);
		this._renderChart = this._renderChart.bind(this);
		//this._getTagsDataByNode = this._getTagsDataByNode.bind(this);

		// if(props.preAction && typeof props.preAction.action === 'function') {
		// 	let {action, addListener} = props.preAction;
		// 	if( addListener && typeof addListener === 'function' ) {
		// 		addListener(this._getTagsDataByNode);
		// 	}
		// 	if( action() ) {
		// 		getTagsDataByNode(props);
		// 	}
		// } else {
		// 	getTagsDataByNode(props);
		// }
		//
		// FolderStore.addSolutionChangeListener(this._onChange);
	}
	// componentWillUnmount() {
	// 	FolderStore.removeSolutionChangeListener(this._onChange);
	// 	if(this.props.preAction && typeof this.props.preAction.removeListener === 'function') {
	// 		this.props.preAction.removeListener(this._getTagsDataByNode);
	// 	}
	// }

	// _getTagsDataByNode() {
	// 	getTagsDataByNode(this.props);
	// }

	// _onChange(data, nodeId) {
	// 	let tagData = data.get('EnergyViewData'),
	// 	widgetStatus = data.get('WidgetStatus'),
	// 	contentSyntax = data.get('ContentSyntax'),
	// 	widgetSeriesArray = data.get('WidgetSeriesArray');
	// 	this.setState({
	// 		widgetStatus,
	// 		widgetSeriesArray,
	// 		tagDatas: {...this.state.tagDatas, ...{
	// 			[nodeId]: tagData
	// 		}},
	// 		widgetStatuss: {...this.state.widgetStatuss, ...{
	// 			[nodeId]: widgetStatus
	// 		}},
	// 		widgetSeriesArrays: {...this.state.widgetSeriesArrays, ...{
	// 			[nodeId]: widgetSeriesArray
	// 		}},
	// 		contentSyntaxs: {...this.state.contentSyntaxs, ...{
	// 			[nodeId]: contentSyntax
	// 		}}
	// 	});
	// }

	_afterChartCreated(nodeId) {
		let svgString,
		parent = ReactDOM.findDOMNode(this).querySelector('#chart_basic_component_' + nodeId);
		if(parent && parent.querySelector('svg')) {
			svgString = new XMLSerializer().serializeToString(parent.querySelector('svg'));
		}
		if( svgString ) {
			this.setState({
				svgStrings: {...this.state.svgStrings, ...{
					[nodeId]: svgString
				}}
			});
		}
	}

	_setStateValue(name) {
		return (value) => {
			this.setState({
				[name]: name === 'SaveValue' || name === 'SaveCost' ? Util.thousandsToNormal(value) : value
			});
		}
	}

	_setIdx(idx) {
		if(idx < 0) {
			idx = 0;
		}
		if(idx >= this.state.nodes.length) {
			idx = this.state.nodes.length - 1;
		}
		return () => {
			this._setStateValue('idx')(idx);
		};
	}

	_onDelete() {
		this._setStateValue('nodes')(this.state.nodes.filter((node, idx) => idx !== this.state.idx));
		if( this.state.idx >= this.state.nodes.length - 1 ) {
			this._setStateValue('idx')(this.state.idx - 1);
		}
		this.setState({showDelete: false});
	}

	_getAPIDataFormat() {
		let {
			nodes,
			svgStrings,
			ProblemName,
			ProblemMark,
			ProblemDesc,
			SaveName,
			SaveValue,
			SaveUnit,
			SaveCost,
			SaveDesc,
		} = this.state;
		return {
			verified: ProblemName && ProblemMark && nodes.length === Object.keys(svgStrings).length,
			data: {
				EnergyProblem: {
					HierarchyId: this.context.hierarchyId,
					Name: ProblemName,
					EnergySys: ProblemMark,
					Description: ProblemDesc,
					Status: 1,
					IsRead: 0,
					IsConsultant: SolutionFull(),
					EnergyProblemImages: nodes.map((node) => {return {
						Name: node.get('Name'),
						Content: svgStrings[getId(node)]
					}})
				},
				EnergySolution: {
					Name: SaveName,
					ExpectedAnnualEnergySaving: SaveValue,
					EnergySavingUnit: SaveUnit,
					ExpectedAnnualCostSaving: SaveCost,
					Description: SaveDesc,
					InvestmentReturnCycle: ''
				}
			}
		}
	}

	_renderEnergyProblem() {
		let {ProblemName, ProblemMark, ProblemDesc} = this.state;
		return (<div style={{flex: 'none'}}>
			<div><b>{I18N.Setting.DataAnalysis.EnergyProblem.Title}</b></div>
			<ViewableTextField title={I18N.Common.Glossary.Name}
				defaultValue={ProblemName}
				didChanged={this._setStateValue('ProblemName')}/>
			<div style={{
				display: 'inline-block',
				position: 'relative',
				top: 16,
				marginLeft: 20,
			}}>
				<ViewableDropDownMenu title={I18N.Setting.DataAnalysis.EnergyProblem.Mark}
			        style={{
			        	width: 160,
			        }}
					dataItems={getProblemMarkMenuItem()}
					defaultValue={ProblemMark}
					didChanged={this._setStateValue('ProblemMark')}/>
			</div>
			<OnceHidePanel label={I18N.Setting.DataAnalysis.EnergyProblem.AddDesc}>
				<ViewableTextField title={I18N.Setting.UserManagement.Comment}
					multiLine={true}
					defaultValue={ProblemDesc}
					didChanged={this._setStateValue('ProblemDesc')}/>
			</OnceHidePanel>
		</div>);
	}

	_renderChart() {
		let {idx, nodes, svgStrings} = this.state,
		currentNode = nodes[idx];
		if( currentNode ) {
			let svgString = svgStrings[getId(currentNode)];
			if(svgStrings[getId(currentNode)]) {
				return (<div style={{height: 300, width: 600}} dangerouslySetInnerHTML={{__html: svgString}} />);
			}
		}
		return (<div style={{height: 300, width: 600}} className='flex-center'><CircularProgress  mode="indeterminate" size={80} /></div>);
	}

	_renderHighChart(node) {
		if(!node || this.props.renderChartCmp(node)===null || this.state.svgStrings[getId(node)]) {
			return null;
		}
		let nodeId = getId(node);
		return (<div style={{position: 'relative', overflowX: 'hidden', height: 300, width: 600}}>
			      <div id={'chart_basic_component_' + nodeId} style={{
			          flex: 1,
			          position: 'absolute',
			          width: 610,
			          height: 320,
			          display: 'flex',
			          opacity: 0,
			          flexDirection: 'column',
			          marginBottom: '0px',
			          marginLeft: '9px'
			        }}>
							{this.props.renderChartCmp(node,() => {
								this._afterChartCreated(nodeId);
							})}
					</div>
				</div>);
	}

	_renderSaveScheme() {
		let {SaveName, SaveValue, SaveUnit, SaveCost, SaveDesc} = this.state;
		return (
			<OnceHidePanel label={I18N.Setting.DataAnalysis.SaveScheme.AddDesc}>
				<div style={{flex: 'none'}}>
					<b>{I18N.Setting.DataAnalysis.SaveScheme.Title}</b>
					<div>
						<ViewableTextField title={I18N.Common.Glossary.Name}
							defaultValue={SaveName}
							didChanged={this._setStateValue('SaveName')}/>
					</div>
					<div style={{display:'flex'}}>
						<ViewableTextField title={I18N.Setting.DataAnalysis.SaveScheme.TargetValue}
							defaultValue={Util.toThousands(SaveValue)}
							regexFn={(value)=>{
								value = Util.thousandsToNormal(value);
								if(value===''){value=null}
								if(!MeasuresStore.validateNumber(value)){
									return I18N.Setting.ECM.NumberErrorText
								}
								else {
									return null
								}
							}}
							didChanged={this._setStateValue('SaveValue')}
							style={{width: 155, marginRight: 20}}/>
						<ViewableTextField title={I18N.Common.Glossary.UOM}
							defaultValue={SaveUnit}
							didChanged={this._setStateValue('SaveUnit')}
							style={{width: 80, marginRight: 20}}/>
						<ViewableTextField title={I18N.Setting.DataAnalysis.SaveScheme.TargetCost}
							defaultValue={Util.toThousands(SaveCost)}
							didChanged={this._setStateValue('SaveCost')}
							regexFn={(value)=>{
								value = Util.thousandsToNormal(value);
								if(value===''){value=null}
								if(!MeasuresStore.validateNumber(value)){
									return I18N.Setting.ECM.NumberErrorText
								}
								else {
									return null
								}
							}}
							style={{width: 155, marginRight: 20}}/>
						<div style={{marginTop: 40}}>RMB</div>
					</div>
					<div>
						<ViewableTextField title={I18N.Setting.UserManagement.Comment}
							multiLine={true}
							defaultValue={SaveDesc}
							didChanged={this._setStateValue('SaveDesc')} />
					</div>
				</div>
			</OnceHidePanel>);
	}

	_renderSubmit() {
		return (<FlatButton
			disabled={!this._getAPIDataFormat().verified}
			label={I18N.Setting.DataAnalysis.SchemeSubmit}
			onClick={() => {
				let {data} = this._getAPIDataFormat();
				FolderAction.createEnergySolution(data);

				this.props.onRequestClose(true); //true:closed by submit false:closed by cancel
			}}/>);
	}

	_renderCancel() {
		return (<FlatButton
			label={I18N.Common.Button.Cancel2}
			onClick={() => {
				this.props.onRequestClose();
			}}/>);
	}

	_renderDeleteDialog() {
		let {showDelete, idx, nodes} = this.state;
		return (<Dialog open={showDelete} actions={[
					(<FlatButton label={I18N.Common.Button.Delete} onClick={this._onDelete} primary={true}/>),
					(<FlatButton label={I18N.Common.Button.Cancel2} onClick={()=>{this.setState({showDelete: false})}}/>)
				]}>
				{I18N.Setting.DataAnalysis.SaveScheme.DeleteChart.replace(/{\w*}/, nodes[idx].get('Name'))}
			</Dialog>);
	}

	render() {
		let names = this.state.nodes.map(function (node) {
			return node.get('Name');
		});
		return (
			<Dialog
				open={true}
				title={I18N.Setting.DataAnalysis.Scheme}
				actions={[this._renderSubmit(), this._renderCancel()]}
				contentStyle={{overflowY: 'auto'}}>
				{this._renderEnergyProblem()}
				<div style={{margin: '10px 0', flex: 'none'}}>
					<Gallery
						names={this.state.nodes.map(node => node.get('Name'))}
						selectedIdx={this.state.idx}
						onLeft={this._setIdx(this.state.idx - 1)}
						onRight={this._setIdx(this.state.idx + 1)}
						onDelete={() => {
							this.setState({
								showDelete: true
							});
						}}
						renderContent={this._renderChart}/>
				</div>
				{this._renderSaveScheme()}
				{this.state.nodes.map(this._renderHighChart)}
				{this._renderDeleteDialog()}
			</Dialog>
		);
	}
}


export class GenerateSolutionButton extends Component {
	static propTypes = {
		nodes: PropTypes.arrayOf(PropTypes.object),
		preAction: PropTypes.object,
	};
	constructor(props) {
		super(props);
		this.state = {
			open: false
		};
	}
	render() {
		if( !PushFull() && !SolutionFull() ) {
			return null;
		}
	    let {nodes, preAction, onOpen, disabled} = this.props,
	    styles={
	      button:{
	        marginRight:'10px'
	      },
	      label:{
	        fontSize:'14px'
	      }
	    };
		return (
			<span>
				<NewFlatButton
					secondary={true}
					disabled={disabled}
					label={I18N.Setting.DataAnalysis.Scheme}
					labelstyle={styles.label}
					icon={
						<FontIcon className="icon-to-ecm" style={styles.label}/>
					}
					onClick={() => {
						onOpen({
							nodes,
							preAction,
						});
					}}
					style={styles.button}/>
			</span>
		);
	}
}
