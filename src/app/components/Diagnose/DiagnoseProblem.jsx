import React, { Component, PropTypes } from 'react';
import Immutable from 'immutable';
import FlatButton from 'controls/FlatButton.jsx';
import NewDialog from 'controls/NewDialog.jsx';
import RaisedButton from 'material-ui/RaisedButton';
import { IconButton, IconMenu,MenuItem,CircularProgress,Snackbar} from 'material-ui';
import {dateAdd,DataConverter} from 'util/Util.jsx';
import PrivilegeUtil from 'util/privilegeUtil.jsx';
import PermissionCode from 'constants/PermissionCode.jsx';
import CurrentUserStore from 'stores/CurrentUserStore.jsx';
import DateTimeSelector from 'controls/DateTimeSelector.jsx';
import DiagnoseAction from 'actions/Diagnose/DiagnoseAction.jsx';
import DiagnoseStore from 'stores/DiagnoseStore.jsx';
import DiagnoseChart from './DiagnoseChart.jsx';
import {DiagnoseStatus} from 'constants/actionType/Diagnose.jsx';
import {GenerateSolutionButton,GenerateSolution} from '../DataAnalysis/Basic/GenerateSolution.jsx';


function getFromImmu(key) {
	return function(immuObj) {
		return immuObj.get(key);
	}
};

const getId = getFromImmu('Id');

function privilegeWithBasicSmartDiagnose( privilegeCheck ) {
  //  return true
	return privilegeCheck(PermissionCode.BASIC_SMART_DIACRISIS, CurrentUserStore.getCurrentPrivilege());
}

function isBasicFull() {
	return privilegeWithBasicSmartDiagnose(PrivilegeUtil.isFull.bind(PrivilegeUtil));
}

function privilegeWithSeniorSmartDiagnose( privilegeCheck ) {
  //  return true
	return privilegeCheck(PermissionCode.SENIOR_SMART_DIACRISIS, CurrentUserStore.getCurrentPrivilege());
}

function isSeniorFull() {
	return privilegeWithSeniorSmartDiagnose(PrivilegeUtil.isFull.bind(PrivilegeUtil));
}

export default class DiagnoseProblem extends Component {

  static contextTypes = {
		hierarchyId: PropTypes.string
	};

  constructor(props, ctx) {
  				super(props);
  				this._onTitleMenuSelect = this._onTitleMenuSelect.bind(this);
					this._onSolutionShow = this._onSolutionShow.bind(this);
					this._onChanged = this._onChanged.bind(this);
					this._onIgnore = this._onIgnore.bind(this);
					this._onSuspend = this._onSuspend.bind(this);
					this._onDateSelectorChanged = this._onDateSelectorChanged.bind(this);
					this._renderChart = this._renderChart.bind(this);

  		}

  state={
  				dialogType:null,
					chartData:null,
					startDate: null,
					endDate: null,
					startTime: null,
					endTime: null,
          solutionShow:false
  		}

	_initDate(){
		if(this.state.startDate===null){
			let chart=DiagnoseStore.getDiagnoseChartData();
			var j2d=DataConverter.JsonToDateTime;

			let timeRange=chart.getIn(['EnergyViewData','TargetEnergyData',0,'Target','TimeSpan']).toJS(),
					startDate=j2d(timeRange.StartTime,false),
					endDate=j2d(timeRange.EndTime,false);

			let startTime = startDate.getHours(),
				endTime = endDate.getHours();

			startDate.setHours(0, 0, 0, 0);
			endDate.setHours(0, 0, 0, 0);
			if (endTime === 0) {
				endDate = dateAdd(endDate, -1, 'days');
				endTime = 24;
			}

			return {
				startDate: startDate,
				endDate: endDate,
				startTime: startTime,
				endTime: endTime
			}
		}
		else return{}
	}

  _onSolutionShow(){
    this.setState({
      solutionShow:true
    })
  }

	_onChanged(){
		this.setState({
			chartData:DiagnoseStore.getDiagnoseChartData(),
			...this._initDate()
		})
	}

  _onTitleMenuSelect(e, item) {
  		this.setState({
  			dialogType:item.key
  		},()=>{
        if(item.key==='Edit'){
          this.props.onEdit(this.props.selectedNode)
        }
      })
  	}

  _onIgnore(){
		this.setState({
			dialogType: null
		},()=>{
			DiagnoseAction.ignorediagnose(this.props.selectedNode.get('Id'));
		})

	}

	_onSuspend(){
		this.setState({
			dialogType: null
		},()=>{
			DiagnoseAction.pauseorrecoverdiagnose(this.props.selectedNode.get('Id'),DiagnoseStatus.Suspend);
		})
	}

	_onDateSelectorChanged(startDate, endDate, startTime, endTime) {
		let that = this,
			dateSelector = this.refs.dateTimeSelector,
			timeRange = dateSelector.getDateTime();
		if (timeRange.end - timeRange.start > 30 * 24 * 60 * 60 * 1000) {
			let isStart = dateSelector.getTimeType();
			if (isStart) {
				endDate = dateAdd(startDate, 30, 'days');
				endTime = startTime;
				timeRange.end = new Date(endDate.setHours(endTime, 0, 0, 0));
			} else {
				startDate = dateAdd(endDate, -30, 'days');
				startTime = endTime;
				if(endTime===24)
				{
					startTime = 0;
					startDate = dateAdd(startDate, 1, 'days');
				}
				timeRange.start = new Date(startDate.setHours(startTime, 0, 0, 0));
			}
		}

		this.setState({
			startDate: startDate,
			endDate: endDate,
			startTime: startTime,
			endTime: endTime,
			chartData:null
		}, () => {
			var d2j=DataConverter.DatetimeToJson;
			that.getProblem(this.props,d2j(timeRange.start),d2j(timeRange.end))
		})

	}

	_renderIconMenu(){
		var IconButtonElement = <IconButton iconClassName="icon-more" iconStyle={{
			fontSize: '16px'
		}} style={{
			padding: '0px',
			height: '18px',
			width: '18px',
			marginLeft: '10px',
			marginTop: '5px'
		}}/>;
		var iconMenuProps = {
			iconButtonElement: IconButtonElement,
			openDirection: "bottom-right",
			desktop: true
		};
		return(
			<IconMenu {...iconMenuProps} onItemTouchTap={this._onTitleMenuSelect}>
															<MenuItem key="Ignore" primaryText={I18N.Setting.Diagnose.Ignore}/>
															<MenuItem key="Suspend" primaryText={I18N.Setting.Diagnose.Suspend}/>
															<MenuItem key="Edit" primaryText={I18N.Setting.Diagnose.Edit}/>
													 </IconMenu>
		)

	}

  	_renderIgnoreDialog(){
      var styles={
        content:{
          padding:'30px',
          display:'flex',
          justifyContent:'center'
        },
        action:{
          padding:'0 30px'
        }
      };
  		var {Name}=this.props.selectedNode.toJS();
      return(
        <NewDialog
          open={true}
          actionsContainerStyle={styles.action}
          overlayStyle={{zIndex:'1000'}}
          contentStyle={styles.content}
          actions={[
              <RaisedButton
                label={I18N.Setting.Diagnose.Ignore}
                onClick={this._onIgnore} />,

              <FlatButton
                label={I18N.Common.Button.Cancel2}
                onClick={() => {this.setState({
                                dialogType: null
                                })}} />
            ]}
        ><div className="jazz-ecm-measure-viewabletext">{I18N.format(I18N.Setting.Diagnose.IgnoreDiagnoseProblem,Name)}</div></NewDialog>
      )
    }

  	_renderSuspendDialog(){
      var styles={
        content:{
          padding:'30px',
          display:'flex',
          justifyContent:'center'
        },
        action:{
          padding:'0 30px'
        }
      };
  		var {Name}=this.props.selectedNode.toJS();
      return(
        <NewDialog
          open={true}
          actionsContainerStyle={styles.action}
          overlayStyle={{zIndex:'1000'}}
          contentStyle={styles.content}
          actions={[
              <RaisedButton
                label={I18N.Platform.ServiceProvider.PauseStatus}
                onClick={this._onSuspend} />,

              <FlatButton
                label={I18N.Common.Button.Cancel2}
                onClick={() => {this.setState({
                                dialogType: null
                                })}} />
            ]}
        ><div className="jazz-ecm-measure-viewabletext">{I18N.format(I18N.Setting.Diagnose.SuspendDiagnoseProblem,Name)}</div></NewDialog>
      )
    }

    _renderChart(node,afterChartCreated){
      let nodeId = getId(node);
      return(
        <DiagnoseChart
          afterChartCreated={afterChartCreated}
          ref='ChartBasicComponent'
          key={nodeId}
          data={this.state.chartData}
          afterChartCreated={afterChartCreated}/>
      )
    }

		getProblem(props,start,end){
			DiagnoseAction.getproblemdata(props.selectedNode.get('Id'),start,end);
		}

		componentDidMount(){
			DiagnoseStore.addChangeListener(this._onChanged);
			this.getProblem(this.props);
		}

		componentWillReceiveProps(nextProps){
			if(!Immutable.is(this.props.selectedNode,nextProps.selectedNode)){
				this.setState({
					chartData:null
				},()=>{
					this.getProblem(nextProps)
				})

			}
		}

		componentWillUnmount(){
			DiagnoseStore.removeChangeListener(this._onChanged);
		}


  render(){
		var that=this;
    var {Name}=this.props.selectedNode.toJS();
    var dialog;

    switch (this.state.dialogType) {
    			case 'Ignore':
    				dialog=this._renderIgnoreDialog();
    				break;
    			case 'Suspend':
    					dialog=this._renderSuspendDialog();
    				break;
    			default:

    		}

  var isFull=this.props.isBasic?isBasicFull():isSeniorFull();
    return(
      <div className="content">
        <div className="content-head">
            <div className="text">{Name}</div>
          {isFull && <div className="side">
                      <GenerateSolutionButton onOpen={this._onSolutionShow.bind(this)} disabled={this.state.chartData===null}/>
                      {this._renderIconMenu()}
                      </div>}
        </div>
				<div style={{display:this.state.chartData?'block':'none'}}>
					<DateTimeSelector ref='dateTimeSelector' showTime={true} endLeft='-100px'
						startDate= {this.state.startDate}
						endDate={this.state.endDate}
						startTime={this.state.startTime}
						endTime={this.state.endTime}
						 _onDateSelectorChanged={this._onDateSelectorChanged}/>
				</div>

					 {this.state.chartData?<DiagnoseChart data={this.state.chartData}/>
																:<div className="flex-center">
																		 <CircularProgress  mode="indeterminate" size={80} />
																	 </div>}
          {this.state.solutionShow && <GenerateSolution
  					nodes={[this.props.selectedNode]}
  					onRequestClose={() => {
  						this.setState({solutionShow: false});
  					}}
            renderChartCmp={this._renderChart}
            />}
        {dialog}
      </div>
    )
  }
}

DiagnoseProblem.propTypes={
  selectedNode:React.PropTypes.object,
  isBasic:React.PropTypes.bool,
  onEdit:React.PropTypes.func,
}
