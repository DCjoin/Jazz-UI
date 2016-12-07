import React, { Component } from 'react';
import {SettingStatus} from 'constants/actionType/KPI.jsx';
import GroupKPIAction from 'actions/KPI/GroupKPIAction.jsx';
import GroupKPIStore from 'stores/KPI/GroupKPIStore.jsx';
export default class KPIConfig extends Component {
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

	componentWillMount(){
		if(status===SettingStatus.Prolong){
			GroupKPIAction.getGroupContinuous(this.props.kpiId,this.props.year);
		}
	}

	componentDidMount(){
		GroupKPIStore.addChangeListener(this._onChange);
	}

	componentWillUnmount(){
		GroupKPIStore.removeChangeListener(this._onChange);
	}

	render() {
		return (
			<div>配置页面</div>
		);
	}
}
KPIConfig.propTypes = {
	// hierarchyId:React.PropTypes.number,
	status:React.PropTypes.string,
	kpiId:React.PropTypes.number,
	year:React.PropTypes.number,
	// isCreate:React.PropTypes.bool,
	// onSave:React.PropTypes.func,
	// onCancel:React.PropTypes.func,
	// year:React.PropTypes.number,
};
