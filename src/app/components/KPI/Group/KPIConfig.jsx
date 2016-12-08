import React, { Component } from 'react';
import CircularProgress from 'material-ui/CircularProgress';
import {SettingStatus,Type} from 'constants/actionType/KPI.jsx';
import GroupKPIAction from 'actions/KPI/GroupKPIAction.jsx';
import GroupKPIStore from 'stores/KPI/GroupKPIStore.jsx';
import TitleComponent from 'controls/TitleComponent.jsx';
import BasicConfig from './BasicConfig.jsx';

var customerId=null;
export default class KPIConfig extends Component {

	static contextTypes = {
		router: React.PropTypes.object,
	};

	constructor(props) {
		super(props);
		this._onChange = this._onChange.bind(this);
	}

	state={
		kpiInfo:null,
		groupInfo:null,
	};

	_onChange(){
		this.setState({
			kpiInfo:GroupKPIStore.getKpiInfo(),
			groupInfo:GroupKPIStore.getGroupInfo(),
		})
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

	}

	componentWillMount(){
		customerId=this.context.router.params.customerId;
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
					 break;
		}
	}

	componentDidMount(){
		GroupKPIStore.addChangeListener(this._onChange);
	}

	componentWillUnmount(){
		GroupKPIStore.removeChangeListener(this._onChange);
	}

	render() {
		var {status,year,name}=this.props;
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
				</TitleComponent>
			);
		}
		else {
			return (<div className="content flex-center"><CircularProgress  mode="indeterminate" size={80} /></div>)
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

};

KPIConfig.defaultProps = {
	status:SettingStatus.Prolong,
	//编辑时 id=kpiSettingsId;延用时 id=KpiId
	id:2,
	year:2017,
	// //编辑时，需要name
	name:'天然气用量',

};
