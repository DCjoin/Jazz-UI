'use strict';
import React, {Component} from 'react';
import MonthKPIAction from 'actions/KPI/MonthKPIAction.jsx';
import MonthKPIStore from 'stores/KPI/MonthKPIStore.jsx'
import TitleComponent from 'controls/TitleComponent.jsx';
import FormBottomBar from 'controls/FormBottomBar.jsx';
import { formStatus } from 'constants/FormStatus.jsx';
import ActualTag from './ActualTag.jsx';
import MonthValue from './MonthValue.jsx';

export default class MonthConfig extends Component {

	static contextTypes = {
		router: React.PropTypes.object,
	};

  constructor(props) {
    super(props);
    this._onChange = this._onChange.bind(this);

  }

  state = {
    buildingInfo:null
  };

	_onChange(){
    this.setState({
      buildingInfo:MonthKPIStore.getMonthKpi()
    })
	}

  _renderMonthValue(){
		var props={
			kpiInfo:this.props.kpiInfo,
			buildingInfo:this.state.buildingInfo,
		};
		return(
			<MonthValue {...props}/>
		)
  }

	componentDidMount(){
		MonthKPIStore.addChangeListener(this._onChange);
    let paths=['Buildings',this.props.index];
    MonthKPIAction.setDefalutMonthInfo(this.props.kpiInfo.getIn(paths));
	}

	componentWillUnmount(){
		MonthKPIStore.removeChangeListener(this._onChange);
	}

  render(){
    if(this.state.buildingInfo===null){
      return <div/>
    }
    let {isCreate}=this.props;
    let {CommodityId,UomId}=this.props.kpiInfo.toJS();
	  let {HierarchyName,HierarchyId,ActualTagId,ActualTagName}=this.state.buildingInfo.toJS();
    let titleProps={
			title:`${HierarchyName}-${I18N.Setting.KPI.Group.MonthConfig.Title}`,
			contentStyle:{
				marginLeft:'0'
			},
			titleStyle:{
				fontSize:'16px'
			},
			className:'jazz-kpi-config-wrap'
		},
    tagProps={
      kpiInfo:this.props.kpiInfo,
      buildingInfo:this.state.buildingInfo,
      isCreate:isCreate,
    };

    return(
      <TitleComponent {...titleProps}>
        <ActualTag {...tagProps}/>
        {this._renderMonthValue()}
				  <FormBottomBar isShow={true} allowDelete={false} allowEdit={false} enableSave={true}
				ref="actionBar" status={formStatus.EDIT} onSave={this._onSave} onCancel={this.props.onCancel}
				cancelBtnProps={{label:I18N.Common.Button.Cancel2}}/>
      </TitleComponent>
    )
  }
}

MonthConfig.propTypes = {
	kpiInfo:React.PropTypes.object,
  index:React.PropTypes.number,
	isCreate:React.PropTypes.bool,
	onSave:React.PropTypes.func,
	onCancel:React.PropTypes.func,
};
