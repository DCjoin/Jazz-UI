import React, { Component } from 'react';
import FlatButton from 'controls/FlatButton.jsx';
import NewDialog from 'controls/NewDialog.jsx';
import RaisedButton from 'material-ui/RaisedButton';
import { IconButton, IconMenu,MenuItem,CircularProgress} from 'material-ui';
import {dateAdd,DataConverter} from '../../../util/Util.jsx';
import privilegeUtil from 'util/privilegeUtil.jsx';
import PermissionCode from 'constants/PermissionCode.jsx';
import CurrentUserStore from 'stores/CurrentUserStore.jsx';
import DateTimeSelector from 'controls/DateTimeSelector.jsx';
import DiagnoseAction from 'actions/Diagnose/DiagnoseAction.jsx';
import DiagnoseStore from 'stores/DiagnoseStore.jsx';
import DiagnoseChart from './DiagnoseChart.jsx';
import {DiagnoseStatus} from '../../constants/actionType/Diagnose.jsx';

function privilegeWithBasicSmartDiagnose( privilegeCheck ) {
  //  return true
	return privilegeCheck(PermissionCode.BASIC_SMART_DIACRISIS, CurrentUserStore.getCurrentPrivilege());
}

function isBasicFull() {
	return privilegeWithBasicSmartDiagnose(privilegeUtil.isFull.bind(privilegeUtil));
}

function privilegeWithSeniorSmartDiagnose( privilegeCheck ) {
  //  return true
	return privilegeCheck(PermissionCode.SENIOR_SMART_DIACRISIS, CurrentUserStore.getCurrentPrivilege());
}

function isSeniorFull() {
	return privilegeWithSeniorSmartDiagnose(privilegeUtil.isFull.bind(privilegeUtil));
}


export default class DiagnoseProblem extends Component {


  constructor(props, ctx) {
  				super(props);
  				this._onTitleMenuSelect = this._onTitleMenuSelect.bind(this);

  		}

  state={
  				dialogType:null,
					chartData:null,
					startDate: null,
					endDate: null,
					startTime: null,
					endTime: null
  		}

	_initDate(){
		if(this.state.startDate===null){
			let chart=DiagnoseStore.getDiagnoseChartData();
			var j2d=DataConverter.JsonToDateTime;

			let timeRange=chart.getIn(['EnergyViewData','TargetEnergyData',0,'Target','TimeSpan']),
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

	_onChanged(){
		this.setState({
			chartData:DiagnoseStore.getDiagnoseChartData(),
			...this._initDate()
		})
	}

  _onTitleMenuSelect(e, item) {
  		this.setState({
  			dialogType:item.key
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
			endTime: endTime
		}, () => {
			var d2j=DataConverter.DatetimeToJson;
			that.getProblem(d2j(timeRange.start),d2j(timeRange.end))
		})

	}

	_renderIconMenu(){
		var IconButtonElement = <IconButton iconClassName="icon-arrow-down" iconStyle={{
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

		getProblem(start,end){
			DiagnoseAction.getproblemdata(this.props.selectedNode.get('Id'),start,end);
		}

		componentDidMount(){
			DiagnoseStore.addChangeListener(this._onChanged);
			this.getProblem();
		}

		componentWillUnmount(){
			DiagnoseStore.removeChangeListener(this._onChanged);
		}


  render(){
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
                      {this._renderIconMenu()}
                      </div>}
        </div>
				<DateTimeSelector ref='dateTimeSelector' showTime={true} endLeft='-100px'
					startDate= {this.state.startDate}
					endDate={this.state.endDate}
					startTime={this.state.startTime}
					endTime={this.state.endTime}
					 _onDateSelectorChanged={this._onDateSelectorChanged}/>

					 {this.state.chartData?<DiagnoseChart data={this.state.chartData}/>
																:<div className="flex-center" style={{flex:'none'}}>
																		 <CircularProgress  mode="indeterminate" size={80} />
																	 </div>}
        {dialog}
      </div>
    )
  }
}

DiagnoseProblem.propTypes={
  selectedNode:React.PropTypes.object,
  isBasic:React.PropTypes.bool,
}
