import React, { Component } from 'react';
import CircularProgress from 'material-ui/CircularProgress';
import TitleComponent from 'controls/TitleComponent.jsx';
import FormBottomBar from 'controls/FormBottomBar.jsx';
import { formStatus } from 'constants/FormStatus.jsx';
import {SettingStatus} from 'constants/actionType/KPI.jsx';

export default class ReportConfig extends Component {

	static contextTypes = {
		router: React.PropTypes.object,
	};

	constructor(props) {
		super(props);
		this._onChange = this._onChange.bind(this);
	}

	state={
    templateList:null,
    reportItem:this.props.report
	};

	_onChange(){
		this.setState({
			kpiInfo:GroupKPIStore.getKpiInfo(),
		})
	}


	componentWillMount(){
		var customerId=parseInt(this.context.router.params.customerId);
    if(this.props.status===SettingStatus.Edit){

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
		if(this.state.isLoading){
			return (<div className="noContent flex-center"><CircularProgress  mode="indeterminate" size={80} /></div>)
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
ReportConfig.propTypes = {
  //  SettingStatus.New  Or SettingStatus.Edit
	status:React.PropTypes.string,
  HierarchyName:React.PropTypes.string,
  report:React.PropTypes.object,
};
