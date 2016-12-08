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

	componentWillMount(){
		customerId=this.context.router.params.customerId;
		let {year,id}=this.props;
		switch(status){
			case SettingStatus.Prolong:
						GroupKPIAction.getGroupContinuous(id,year);
						break;
			case SettingStatus.New:
					let info={
						CustomerId:customerId,
						Year:year,
						IndicatorType:Type.Quota
					};
					GroupKPIAction.getBuildingListByCustomerId(customerId,info);
					break;
			case SettingStatus.Edit:
					 GroupKPIAction.getBuildingListByCustomerId(customerId,info);
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
		if(this.state.kpiInfo && this.state.kpiInfo.size!==0){
			let {status,year,name}=this.props;
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
