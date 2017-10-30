import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import {flowRight, curryRight} from 'lodash-es';
import FontIcon from 'material-ui/FontIcon';
import Immutable from 'immutable';
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
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';
import IconLabelField from 'controls/IconLabelField.jsx';
import {NativeTextField} from 'components/ECM/MeasurePart/Solution.jsx';
import TextField from 'material-ui/TextField';

const SVG_WIDTH = 700;
const SVG_HEIGHT = 350;

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
	return [
		<MenuItem primaryText={I18N.Common.Label.CommoEmptyText} value={0} disabled={true}/>
		].concat(Object.keys(ProblemMarkEnum).map(key => {
		return <MenuItem primaryText={I18N.Setting.DataAnalysis.EnergyProblem.MarkEnum[ProblemMarkEnum[key]]} value={ProblemMarkEnum[key]}/>
		}));
}

export class EnergySys extends Component {

  _renderEnergySys(){
    var {problemMark,didChanged}=this.props;
    return(
      <DropDownMenu
                    style={{height: '28px'}}
                    labelStyle={{fontSize:'14px',color:"#626469",border:"1px solid #e6e6e6",borderRadius: "4px",lineHeight:'26px',height:'26px',paddingLeft:'11px',paddingRight:'28px'}}
                    iconButton={<IconButton iconClassName="icon-arrow-down" iconStyle={{fontSize:"10px"}} style={{width:14,height:14}}/>}
                    iconStyle={{marginTop:'-12px',padding:'0',right:'15px',width:'24px',top:"2px"}}
                    value={problemMark}
                    underlineStyle={{display:"none"}}
                    onChange={(e, selectedIndex, value)=>{
                      didChanged(value)
                    }}>
										{getProblemMarkMenuItem()}
    </DropDownMenu>
    )
  }

  render(){

    return(
      <div>
				<div style={{color:'#9fa0a4',fontSize:'14px',marginBottom:'5px'}}>{I18N.Setting.DataAnalysis.EnergyProblem.Mark}</div>
        {this._renderEnergySys()}
      </div>
    )
  }
}

EnergySys.propTypes = {
  problemMark:React.PropTypes.object,
  didChanged:React.PropTypes.func,
};

export class Gallery extends Component {
	render() {
		let {names, selectedIdx, onLeft, onRight, onDelete, renderContent, isView} = this.props;
		return (
			<div className='jazz-scheme-gallery'>
				<div className='jazz-scheme-gallery-action' style={{position:'absolute',left:'6px',zIndex:'1000'}}>
					{selectedIdx > 0 && <IconButton iconClassName="icon-left-switch" iconStyle={{fontSize:"32px",opacity:0.85}} style={{width:32,height:32,lineHeight:'32px',padding:'0'}} onTouchTap={onLeft}/>}
				</div>
				<div className='jazz-scheme-gallery-content'>
					<div className='jazz-scheme-gallery-content-header'>
						{`(${selectedIdx+1}/${names.length})${names[selectedIdx]}`}
						{names.length > 1 && !isView && <LinkButton className='jazz-scheme-gallery-content-header-delete' label={I18N.Common.Button.Delete} onClick={onDelete}/>}
					</div>
					{renderContent()}
				</div>
				<div className='jazz-scheme-gallery-action' style={{position:'absolute',right:'6px',zIndex:'1000'}}>
					{selectedIdx < names.length - 1 && <IconButton iconClassName="icon-right-switch" iconStyle={{fontSize:"32px",opacity:0.85}} style={{width:32,height:32,lineHeight:'32px',padding:'0'}} onTouchTap={onRight}/>}
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
			return <div style={this.props.style}><LinkButton label={this.props.label} onClick={() => {this.setState({hide: false})}} labelStyle={this.props.labelStyle}/></div>
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
			allTags: {},
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
		this._afterChartCreated = this._afterChartCreated.bind(this);
		this._setStateValue = this._setStateValue.bind(this);
		this._setIdx = this._setIdx.bind(this);
		this._onDelete = this._onDelete.bind(this);
		this._renderHighChart = this._renderHighChart.bind(this);
		this._renderChart = this._renderChart.bind(this);
	}
	_afterChartCreated(nodeId, tags) {
		let svgString,
		parent = ReactDOM.findDOMNode(this).querySelector('#chart_basic_component_' + nodeId);
		if(parent && parent.querySelector('svg')) {
			svgString = new XMLSerializer().serializeToString(parent.querySelector('svg'));
		}
		if( svgString ) {
			this.setState({
				svgStrings: {...this.state.svgStrings, ...{
					[nodeId]: svgString
				}},
				allTags: {...this.state.allTags, ...{
					[nodeId]: tags
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
		this.setState({
			showDelete: false
		});
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
			allTags,
		} = this.state;
		return {
			verified: ProblemName && ProblemMark && nodes.length <= Object.keys(svgStrings).length,
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
					}}),
					TagIds: nodes.map(node => allTags[getId(node)])
							.reduce((res, current) => 
								res.concat(current&&current.filter( id => res.indexOf(id) === -1 )), []
							),
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

	// <ViewableTextField title={I18N.Setting.ECM.ProblemDetailName}
	// 	defaultValue={ProblemName}
	// 	didChanged={this._setStateValue('ProblemName')}
	// 	style={{width:'467px'}}
	// 	height="50px"/>
	//
	// 			<ViewableTextField title={I18N.Setting.UserManagement.Comment}
				// multiLine={true}
				// defaultValue={ProblemDesc}
				// didChanged={this._setStateValue('ProblemDesc')}
				// style={{width:'100%'}}/>
	_renderEnergyProblem() {
		let {ProblemName, ProblemMark, ProblemDesc} = this.state;
		return (<div style={{flex: 'none',marginLeft:'12px'}}>
			<div style={{fontSize: '16px', color:'#0f0f0f',marginTop:'20px'}}>{I18N.Setting.ECM.ProblemDetail}</div>

			<TextField
					floatingLabelText={I18N.Setting.ECM.ProblemDetailName}
					floatingLabelStyle={{fontSize:'14px',top:'18px',color: '#9fa0a4'}}
					floatingLabelFocusStyle={{fontSize:'14px',color: '#9fa0a4'}}
					floatingLabelShrinkStyle={{fontSize:'18px',color: '#9fa0a4'}}
					inputStyle={{marginTop:'3px',fontSize:'14px',color:'#000000'}}
					style={{height:'50px',width:'467px'}}
					value={ProblemName}
					onChange={(e,value)=>{this._setStateValue('ProblemName')(value)}}/>
			<div style={{
				display: 'inline-block',
				position: 'relative',
				top: 16,
				marginLeft: 30,
			}}>
				<EnergySys
					problemMark={ProblemMark}
					didChanged={this._setStateValue('ProblemMark')}/>
			</div>
			<OnceHidePanel label={I18N.Setting.DataAnalysis.EnergyProblem.AddDesc} style={{marginTop:'20px'}} labelStyle={{fontSize:'14px',color:'#9fa0a4',textDecoration:'underline'}}>
			<div>
					<TextField
							floatingLabelText={I18N.Setting.UserManagement.Comment}
							floatingLabelStyle={{fontSize:'14px',color: '#9fa0a4'}}
							floatingLabelFocusStyle={{fontSize:'14px',color: '#9fa0a4'}}
							floatingLabelShrinkStyle={{fontSize:'18px',color: '#9fa0a4'}}
							textareaStyle={{fontSize:'14px',color:'#000000'}}
							fullWidth={true}
							multiLine={true}
							value={ProblemDesc}
							onChange={(e,value)=>{this._setStateValue('ProblemDesc')(value)}}/>
			</div>
			</OnceHidePanel>
		</div>);
	}

	_renderChart() {
		let {idx, nodes, svgStrings} = this.state,
		currentNode = nodes[idx];
		if( currentNode ) {
			let svgString = svgStrings[getId(currentNode)];
			if(svgStrings[getId(currentNode)]) {
				return (<div style={{height: SVG_HEIGHT, width: SVG_WIDTH}} dangerouslySetInnerHTML={{__html: svgString}} />);
			}
		}
		return (<div style={{height: SVG_HEIGHT, width: SVG_WIDTH}} className='flex-center'><CircularProgress  mode="indeterminate" size={80} /></div>);
	}

	_renderHighChart(node) {
		if(!node || this.props.renderChartCmp(node)===null || this.state.svgStrings[getId(node)]) {
			return null;
		}
		let nodeId = getId(node);
		return (<div style={{position: 'relative', overflowX: 'hidden', height: SVG_HEIGHT, width: SVG_WIDTH}}>
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
							{this.props.renderChartCmp(node,(tags) => {

       this._afterChartCreated(nodeId, tags);
								
							})}
					</div>
				</div>);
	}

	_renderSaveScheme() {
		let {SaveName, SaveValue, SaveUnit, SaveCost, SaveDesc} = this.state;
		let iconStyle = {
				fontSize: '24px'
			},
			style = {
				padding: '0px',
				fontSize: '24px',
				lineHeight:"24px"
			};
		var props={
      savingIcon:{
        key:'EnergySolution'+'_SavingIcon',
        icon:<FontIcon className="icon-energy_saving" color="#3dcd58" iconStyle ={iconStyle} style = {style} />,
        label:I18N.Setting.ECM.ExpectedAnnualEnergySaving,
      },
      costIcon:{
        key:'EnergySolution'+'_CostIcon',
        icon:<FontIcon className="icon-cost_saving" color="#3dcd58" iconStyle ={iconStyle} style = {style} />,
        label:I18N.Setting.ECM.ExpectedAnnualCostSaving,
      },
			saving:{
				key:'EnergySolution'+'_Saving'+new Date(),
				id:'EnergySolution'+'_Saving'+new Date(),
				value:SaveValue,
				onBlur:(value)=>{
															if(value===''){value=null}
															if(!MeasuresStore.validateNumber(value)){value=SaveValue}
															this._setStateValue('SaveValue')(value)
														},
				getErrorText:(value)=>{return (!MeasuresStore.validateNumber(value))?I18N.Setting.ECM.NumberErrorText:null}
			},
			savingUnit:{
				key:'EnergySolution'+'_SavingUnit',
				id:'EnergySolution'+'_SavingUnit',
				onBlur:(value)=>{
															if(value===''){value=null}
															this._setStateValue('SaveUnit')(value)
														},
				value:SaveUnit,
			},
			cost:{
				key:'EnergySolution'+'_Cost'+new Date(),
				id:'EnergySolution'+'_Cost'+new Date(),
				value:SaveCost,
				onBlur:(value)=>{
															if(value===''){value=null}
															if(!MeasuresStore.validateNumber(value)){value=SaveCost}
															this._setStateValue('SaveCost')(value)
														},
				getErrorText:(value)=>{return (!MeasuresStore.validateNumber(value))?I18N.Setting.ECM.NumberErrorText:null}
			},
		}
		return (
			<OnceHidePanel label={I18N.Setting.DataAnalysis.SaveScheme.AddDesc} style={{marginLeft:'12px'}} labelStyle={{color:'#9fa0a4',fontSize:'14px',textDecoration:'underline'}}>
				<div style={{flex: 'none'}}>
					<div style={{fontSize: '16px', color:"#000000",marginBottom:'20px'}}>{I18N.Setting.ECM.Solution}</div>
					<div>
						<TextField
								floatingLabelText={I18N.Common.Glossary.Name}
								floatingLabelStyle={{fontSize:'14px',top:'18px',color: '#9fa0a4'}}
								floatingLabelFocusStyle={{fontSize:'14px',color: '#9fa0a4'}}
								floatingLabelShrinkStyle={{fontSize:'18px',color: '#9fa0a4'}}
								inputStyle={{marginTop:'3px',fontSize:'14px',color:'#000000'}}
								style={{height:'50px',width:'467px'}}
								value={SaveName}
								onChange={(e,value)=>{this._setStateValue('SaveName')(value)}}/>
					</div>
					<div style={{display:'flex',marginTop:'20px'}}>
						<IconLabelField {...props.savingIcon}>
              <div className="jazz-ecm-measure-solution-iconrow">
                <NativeTextField {...props.saving}/>
                <NativeTextField {...props.savingUnit}/>
              </div>
            </IconLabelField>
            <div style={{marginLeft:'93px'}}><IconLabelField {...props.costIcon}>
              <div className="jazz-ecm-measure-solution-iconrow">
                <NativeTextField {...props.cost}/>
                <div style={{marginLeft:'5px'}}>RMB</div>
              </div>
            </IconLabelField></div>
					</div>
					<div>
							<TextField
									floatingLabelText={I18N.Setting.UserManagement.Comment}
									floatingLabelStyle={{fontSize:'14px',color: '#9fa0a4'}}
									floatingLabelFocusStyle={{fontSize:'14px',color: '#9fa0a4'}}
									floatingLabelShrinkStyle={{fontSize:'18px',color: '#9fa0a4'}}
									textareaStyle={{fontSize:'14px',color:'#000000'}}
									fullWidth={true}
									multiLine={true}
									value={SaveDesc}
									onChange={(e,value)=>{this._setStateValue('SaveDesc')(value)}}/>
					</div>
				</div>
			</OnceHidePanel>);
	}

	_renderSubmit() {
		return (<NewFlatButton
			primary={true}
			disabled={!this._getAPIDataFormat().verified}
			label={I18N.Setting.DataAnalysis.SchemeSubmit}
			onClick={() => {
				let {data} = this._getAPIDataFormat();
				FolderAction.createEnergySolution(data);

				this.props.onRequestClose(true); //true:closed by submit false:closed by cancel
			}}/>);
	}

	_renderCancel() {
		return (<NewFlatButton
			style={{marginLeft: 10}}
			label={I18N.Common.Button.Cancel2}
			onClick={() => {
				this.props.onRequestClose();
			}}/>);
	}

	_renderDeleteDialog() {
		let {showDelete, idx, nodes} = this.state;
		return (<Dialog open={showDelete} actions={[
					(<FlatButton label={I18N.Common.Button.Delete} onClick={this._onDelete} primary={true} inDialog={true}/>),
					(<FlatButton label={I18N.Common.Button.Cancel2} onClick={()=>{this.setState({showDelete: false})}}/>)
				]}>
				{I18N.Setting.DataAnalysis.SaveScheme.DeleteChart.replace(/{\w*}/, nodes[idx].get('Name'))}
			</Dialog>);
	}

	render() {
		let names = this.state.nodes.map(function (node) {
			return node.get('Name');
		});
		let style={
			title:{
				fontSize:'16px',
				fontWeight:'500',
				color:'#0f0f0f',
				margin: "0 19px 0 35px",
				lineHeight:'22px',
				height:'22px',
				padding:'25px 0 25px 0px',
				borderBottom:'1px solid #e6e6e6'
			},
			content:{
				margin:'0 25px',
				overflowY: 'auto'
			}
		}
		return (
			<Dialog
				open={true}
				modal={true}
				title={I18N.Setting.DataAnalysis.Scheme}
				titleStyle={style.title}
				actions={[this._renderSubmit(), this._renderCancel()]}
				onRequestClose={this.props.onRequestClose}
				wrapperStyle={{position:'relative'}}
				contentStyle={style.content}
				actionsContainerStyle={{margin:'30px 36px'}}>
				{this._renderEnergyProblem()}
				<div style={{margin: '30px 0', flex: 'none'}}>
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
	        marginRight:'10px',
	        height: 30,
	        lineHeight: '30px',
	      },
	      label:{
	        fontSize:'14px',
	        marginTop: -2,
	        height: 30,
	        lineHeight: '30px',
	      }
	    };
		return (
			<span>
				<NewFlatButton
					secondary={true}
					disabled={disabled}
					label={I18N.Setting.DataAnalysis.Scheme}
					labelStyle={{...styles.label, ...{
							verticalAlign: 'top',
						}
					}}
					icon={
						<FontIcon className="icon-add" style={styles.label}/>
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

export function getTagsByChartData(chartData) {
	if(!chartData) {
		return null;
	}
	return (Immutable.fromJS(chartData).get('TargetEnergyData') || Immutable.fromJS([]))
		.map( targetEnergyData => targetEnergyData.getIn(['Target', 'TargetId']) )
		.toJS();
}