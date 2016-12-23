'use strict';
import React, {Component} from 'react';
import Immutable from 'immutable';
import MonthKPIAction from 'actions/KPI/MonthKPIAction.jsx';
import GroupKPIAction from 'actions/KPI/GroupKPIAction.jsx';
import MonthKPIStore from 'stores/KPI/MonthKPIStore.jsx'
import TitleComponent from 'controls/TitleComponent.jsx';
import FormBottomBar from 'controls/FormBottomBar.jsx';
import { formStatus } from 'constants/FormStatus.jsx';
import ActualTag from './ActualTag.jsx';
import MonthValue from './MonthValue.jsx';
import Prediction from './GroupPrediction.jsx';
import CommonFuns from 'util/Util.jsx';

export default class MonthConfig extends Component {

  constructor(props) {
    super(props);
    this._onChange = this._onChange.bind(this);
		this._onSave = this._onSave.bind(this);
	  }

  state = {
    buildingInfo:null
  };

	_onChange(){
    this.setState({
      buildingInfo:MonthKPIStore.getMonthKpi()
    })
	}

	_onSave(){
		GroupKPIAction.merge([{
			path:`Buildings.${this.props.index}`,
			value:this.state.buildingInfo
		}]);
		this.props.onSave();
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

	_renderPrediction(){
		var {HierarchyId,HierarchyName,MonthPredictionValues,TagSavingRates,ActualTagId,ActualTagName}=this.state.buildingInfo.toJS();
		var {Year,UomId,CommodityId}=this.props.kpiInfo.toJS();
		var uom=CommonFuns.getUomById(this.props.kpiInfo.get('UomId')).Code;
		var props={
			PredictionSetting:{
				TagSavingRates,MonthPredictionValues
			},
	    Year:Year,
	    uom,
			tag:Immutable.fromJS({
				Id:ActualTagId,
				Name:ActualTagName,
				UomId,CommodityId
			}),
	    hierarchyId:HierarchyId,
	    hierarchyName:HierarchyName,
		};
		return(
			<Prediction {...props}/>
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
	  let {HierarchyName}=this.state.buildingInfo.toJS();
    let titleProps={
			title:`${HierarchyName}-${I18N.Setting.KPI.Group.MonthConfig.Title}`,
			contentStyle:{
				marginLeft:'0'
			},
			titleStyle:{
				fontSize:'16px'
			},
      style:{
        marginTop:'0px'
      }
			// className:'jazz-kpi-config-wrap'
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
				{this._renderPrediction()}
				  <FormBottomBar isShow={true} saveBtnProps={{label:I18N.Platform.Password.Confirm}} allowDelete={false} allowEdit={false} enableSave={MonthKPIStore.validateMonthInfo(this.state.buildingInfo)}
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
