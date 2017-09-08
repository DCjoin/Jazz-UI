import React, { Component } from 'react';
import CircularProgress from 'material-ui/CircularProgress';
import FontIcon from 'material-ui/FontIcon';
import {SettingStatus,Type} from 'constants/actionType/KPI.jsx';
import SingleKPIAction from 'actions/KPI/SingleKPIAction.jsx';
import GroupKPIAction from 'actions/KPI/GroupKPIAction.jsx';
import GroupKPIStore from 'stores/KPI/GroupKPIStore.jsx';
import BasicConfig from './BasicConfig.jsx';
import NewDialog from 'controls/NewDialog.jsx';
import NewFlatButton from 'controls/NewFlatButton.jsx';
import EditConfig from './edit_kpi.jsx';

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
		// this._onMonthConfig = this._onMonthConfig.bind(this);
	}

  state={
		kpiInfo:null,
		errorTitle: null,
		errorContent: null,
		// monthConfigShow:false,
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
			this.props.onSave(GroupKPIStore.getKpiInfo().get('KpiSettingsId'))
		})

	}

	_onError(error) {
		this.setState({
			errorTitle: error.title,
			errorContent: error.content,
			isLoading:false
		});
	}

	_renderBasic(){
		let props={
			status:this.props.status,
			kpiInfo:this.state.kpiInfo,
			year:this.props.year
		};
    var {status,year,name,onCancel}=this.props;
    var {IndicatorName,IndicatorClass}=this.state.kpiInfo.toJS();
		return(
      <NewDialog actionsContainerStyle={{textAlign: 'right', margin: '15px 24px'}} actions={[
				<NewFlatButton label={I18N.Setting.KPI.Group.SaveAndConfig} primary disabled={!IndicatorName || IndicatorName==='' || !IndicatorClass} onClick={this._onSave}/>
    ]} open={true} contentStyle={{marginTop:'-8px'}}>
				<header className='jazz-kpi-config-new-header'>
					<div style={{fontSize:'16px',fontWeight:'600',color:'#0f0f0f'}}>
						{GroupKPIStore.getTitleByStatus(status,year,name)}
					</div>
					<FontIcon style={{fontSize: '16px'}} className={'icon-close'} onClick={onCancel}/>
				</header>
				<BasicConfig {...props}/>
			</NewDialog>
			
		)
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
	      return (<NewDialog
	        ref = "_dialog"
	        title={this.state.errorTitle}
	        modal={false}
	        open={!!this.state.errorTitle}
	        onRequestClose={onClose}
	        >
	        {this.state.errorContent}
	      </NewDialog>);
	    } else {
	      return null;
	    }
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
		if(this.state.isLoading){
			return (<div className="noContent flex-center"><CircularProgress  mode="indeterminate" size={80} /></div>)
		}
		else {
			if(this.state.kpiInfo && this.state.kpiInfo.size!==0){
				return (<div className="jazz-kpi-config-wrap">
						{this.props.status!==SettingStatus.Edit && this._renderBasic()}
            {this.props.status===SettingStatus.Edit && <EditConfig kpiInfo={this.state.kpiInfo} {...this.props}/>}
						{this._renderErrorDialog()}
				</div>
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