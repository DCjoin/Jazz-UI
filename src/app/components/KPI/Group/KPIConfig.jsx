import React, { Component } from 'react';
import CircularProgress from 'material-ui/CircularProgress';
import {SettingStatus,Type} from 'constants/actionType/KPI.jsx';
import SingleKPIAction from 'actions/KPI/SingleKPIAction.jsx';
import GroupKPIAction from 'actions/KPI/GroupKPIAction.jsx';
import GroupKPIStore from 'stores/KPI/GroupKPIStore.jsx';
import TitleComponent from 'controls/TitleComponent.jsx';
import BasicConfig from './BasicConfig.jsx';
import GroupConfig from './GroupConfig.jsx';
import BuildingConfig from './BuildingConfig.jsx';
import FormBottomBar from 'controls/FormBottomBar.jsx';
import { formStatus } from 'constants/FormStatus.jsx';
import Dialog from 'controls/NewDialog.jsx';
import MonthConfig from './MonthConfig.jsx';

var customerId=null;
export default class KPIConfig extends Component {

	static contextTypes = {
		router: React.PropTypes.object,
	};

	constructor(props) {
		super(props);
		this._onChange = this._onChange.bind(this);
		this._onSuccess = this._onSuccess.bind(this);
		this._onError = this._onError.bind(this);
		this._onSave = this._onSave.bind(this);
		this._onMonthConfig = this._onMonthConfig.bind(this);
	}

	state={
		kpiInfo:null,
		errorTitle: null,
		errorContent: null,
		monthConfigShow:false,
		monthIndex:null,
		isLoading:false
	};

	_onChange(){
		this.setState({
			kpiInfo:GroupKPIStore.getKpiInfo(),
		})
	}

	_onSave(){
		this.setState({
			isLoading:true
		},()=>{
			if(this.props.status===SettingStatus.New){
				GroupKPIAction.create()
			}
			else {
				GroupKPIAction.update()
			}
		})

	}

	_onSuccess(){
		this.setState({
			isLoading:false
		},()=>{
			this.props.onSave()
		})

	}

	_onError(error) {
		this.setState({
			errorTitle: error.title,
			errorContent: error.content,
			isLoading:false
		});
	}

	_onMonthConfig(show,index=null){
		this.setState({
			monthConfigShow:show,
			monthIndex:index
		})
	}

	_renderErrorDialog() {
	    var that = this;
	    var onClose = function() {
	      that.setState({
	        errorTitle: null,
	        errorContent: null,
	      });
	    };
	    if (!!this.state.errorTitle) {
	      return (<Dialog
	        ref = "_dialog"
	        title={this.state.errorTitle}
	        modal={false}
	        open={!!this.state.errorTitle}
	        onRequestClose={onClose}
	        >
	        {this.state.errorContent}
	      </Dialog>);
	    } else {
	      return null;
	    }
	  }

	_renderBasic(){
		let props={
			status:this.props.status,
			kpiInfo:this.state.kpiInfo,
			year:this.props.year
		};
		return(
			<BasicConfig {...props}/>
		)
	}

	_renderGroupConfig(){
		let props={
			status:this.props.status,
			kpiInfo:this.state.kpiInfo,
		};
		return(
			<GroupConfig {...props}/>
		)
	}

	_renderBuildingConfig(){
		let props={
			status:this.props.status,
			kpiInfo:this.state.kpiInfo,
			onMonthConfig:this._onMonthConfig
		};
		return(
			<BuildingConfig {...props}/>
		)
	}

	_renderMonthConfig(){
		let isCeate=this.state.kpiInfo.getIn(["Buildings",this.state.monthIndex,'ActualTagName'])?false:true;
		let props={
			kpiInfo:this.state.kpiInfo,
			index:this.state.monthIndex,
			isCreate:isCeate,
			onSave:()=>{
				this._onMonthConfig(false)
			},
			onCancel:()=>{
				this._onMonthConfig(false)
			},
		}
		return(
			<MonthConfig {...props}/>
		)
	}

	componentWillMount(){
		customerId=parseInt(this.context.router.params.customerId);
		let {year,id,status}=this.props;
		switch(status){
			case SettingStatus.Prolong:
						var info={
								CustomerId:customerId,
								Year:year,
								IndicatorType:Type.Quota
							};
						GroupKPIAction.getGroupByYear(customerId,year,info);
						break;
			case SettingStatus.New:
					var info={
						CustomerId:customerId,
						Year:year,
						IndicatorType:Type.Quota
					};
					GroupKPIAction.getBuildingListByCustomerId(customerId,info);
					break;
			case SettingStatus.Edit:
					 GroupKPIAction.getGroupSettings(id);
					 SingleKPIAction.getKPIPeriodByYear(customerId,year);
					 break;
		}
	}

	componentDidMount(){
		GroupKPIStore.addChangeListener(this._onChange);
		GroupKPIStore.addSuccessListener(this._onSuccess);
		GroupKPIStore.addErrorListener(this._onError);
	}

	componentWillUnmount(){
		GroupKPIStore.removeChangeListener(this._onChange);
		GroupKPIStore.removeSuccessListener(this._onSuccess);
		GroupKPIStore.removeErrorListener(this._onError);
	}

	render() {
		var {status,year,name}=this.props;
		if(this.state.isLoading){
			return (<div className="noContent flex-center"><CircularProgress  mode="indeterminate" size={80} /></div>)
		}
		if(this.state.monthConfigShow){
			return(
				<div className="jazz-kpi-config-wrap">
						{this._renderMonthConfig()}
				</div>
			)
		}
		else {
			if(this.state.kpiInfo && this.state.kpiInfo.size!==0){

				let titleProps={
					title:GroupKPIStore.getTitleByStatus(status,year,name),
					contentStyle:{
						marginLeft:'0'
					},
					titleStyle:{
						fontSize:'16px'
					},
					className:'jazz-kpi-config-wrap'
				};
				return (
					<TitleComponent {...titleProps}>
						{this._renderBasic()}
						{this._renderGroupConfig()}
						{this._renderBuildingConfig()}
						<FormBottomBar isShow={true} allowDelete={false} allowEdit={false} enableSave={GroupKPIStore.validateKpiInfo(this.state.kpiInfo)}
							ref="actionBar" status={formStatus.EDIT} onSave={this._onSave} onCancel={this.props.onCancel}
							cancelBtnProps={{label:I18N.Common.Button.Cancel2}}/>
						{this._renderErrorDialog()}
					</TitleComponent>
				);
			}
			else {
				return (<div className="noContent flex-center"><CircularProgress  mode="indeterminate" size={80} /></div>)
			}
		}
	}
}
KPIConfig.propTypes = {
	status:React.PropTypes.string,
	//编辑时 id=kpiSettingsId;延用时 id=KpiId
	id:React.PropTypes.number,
	year:React.PropTypes.number,
	//编辑时，需要name
	name:React.PropTypes.string,
	onSave:React.PropTypes.func,
	onCancel:React.PropTypes.func,
	// onPending:React.PropTypes.func,
};

KPIConfig.defaultProps = {
	status:SettingStatus.New,
	//编辑时 id=kpiSettingsId;延用时 id=KpiId
	id:2,
	year:2017,
	// //编辑时，需要name
	name:'天然气用量',

};
