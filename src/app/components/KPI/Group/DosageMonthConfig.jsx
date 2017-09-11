'use strict';
import React, {Component} from 'react';
import Immutable from 'immutable';
import MonthKPIAction from 'actions/KPI/MonthKPIAction.jsx';
import GroupKPIAction from 'actions/KPI/GroupKPIAction.jsx';
import FlatButton from "controls/NewFlatButton.jsx";

import MonthKPIStore from 'stores/KPI/MonthKPIStore.jsx'
import FormBottomBar from 'controls/FormBottomBar.jsx';
import { formStatus } from 'constants/FormStatus.jsx';
import ActualTag from './ActualTag.jsx';
import MonthValue from './MonthValue.jsx';
import Prediction from './GroupPrediction.jsx';

export default class DosageMonthConfig extends Component {

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
    let {UomId}=this.props.kpiInfo.toJS();
    if(UomId){
      GroupKPIAction.merge([{
        path:`Buildings.${this.props.index}`,
        value:this.state.buildingInfo
      }]);
    }else {
      GroupKPIAction.merge([{
        path:`Buildings.${this.props.index}`,
        value:this.state.buildingInfo
      },{
        path:`UomId`,
        value:this.state.buildingInfo.get('UomId')
      }]);
    }

		this.props.onSave();
	}

  _renderMonthValue(){
		var props={
			kpiInfo:this.props.kpiInfo,
			buildingInfo:this.state.buildingInfo,
			isViewStatus:this.props.isViewStatus
		};
		return(
			<MonthValue {...props}/>
		)
  }

	_renderPrediction(){
		var {HierarchyId,HierarchyName,MonthPredictionValues,TagSavingRates,ActualTagId,ActualTagName}=this.state.buildingInfo.toJS();
		var {Year,CommodityId,UomId}=this.props.kpiInfo.toJS();
		if(!UomId){UomId=this.state.buildingInfo.get("UomId")};
		if(!CommodityId){CommodityId=this.state.buildingInfo.get("CommodityId")};
		// var uom=CommonFuns.getUomById(this.props.kpiInfo.get('UomId')).Code;
		var props={
			PredictionSetting:{
				TagSavingRates,MonthPredictionValues
			},
	    Year:Year,
	    uomId:UomId,
			tag:Immutable.fromJS({
				// Id:ActualTagId,
				Name:ActualTagName,
				UomId,CommodityId
			}),
	    hierarchyId:HierarchyId,
	    hierarchyName:HierarchyName,
			isViewStatus:this.props.isViewStatus
		};
		return(
			<Prediction {...props}/>
		)
	}

	  _renderFooter(){
    return(
      <div className="jazz-kpi-config-edit-step-action">
                             {!this.props.isCreate && <FlatButton label={I18N.Common.Button.Cancel2} secondary={true} style={{float:'right',minWidth:'68px'}} onTouchTap={this.props.onCancel}/>}
                             <FlatButton label={I18N.Common.Button.Save} disabled={!MonthKPIStore.validateMonthInfo(this.state.buildingInfo)} primary={true} style={{float:'right',minWidth:'68px',marginRight:'20px'}} 
                                onTouchTap={this._onSave}/>    
                      </div>
    )
  }

	componentDidMount(){
		MonthKPIStore.addChangeListener(this._onChange);
    let paths=['Buildings',this.props.index];
    MonthKPIAction.setDefalutMonthInfo(this.props.kpiInfo.getIn(paths));
	}

	componentWillReceiveProps(nextProps, nextContext) {
		if( this.props.index!==nextProps.index) {
			this.setState({
				buildingInfo:null
			},()=>{
			let paths=['Buildings',nextProps.index];
    	MonthKPIAction.setDefalutMonthInfo(this.props.kpiInfo.getIn(paths));
			})

		}
	}

	componentWillUnmount(){
		MonthKPIStore.removeChangeListener(this._onChange);
	}

  render(){
    if(this.state.buildingInfo===null){
      return <div/>
    }
    let {isCreate,isViewStatus}=this.props;
	  let {HierarchyName}=this.state.buildingInfo.toJS();
    let tagProps={
      kpiInfo:this.props.kpiInfo,
      buildingInfo:this.state.buildingInfo,
      isCreate:isCreate,
			isViewStatus
    };

    return(
      <div>
        <ActualTag {...tagProps}/>
        {this._renderMonthValue()}
				{this._renderPrediction()}
				{!this.props.isViewStatus && this._renderFooter()}
      </div>
    )
  }
}

				  /*<FormBottomBar isShow={true} saveBtnProps={{label:I18N.Platform.Password.Confirm}} allowDelete={false} allowEdit={false} enableSave={MonthKPIStore.validateMonthInfo(this.state.buildingInfo)}
				ref="actionBar" status={formStatus.EDIT} onSave={this._onSave} onCancel={this.props.onCancel}
				cancelBtnProps={{label:I18N.Common.Button.Cancel2}}/>*/

DosageMonthConfig.propTypes = {
	kpiInfo:React.PropTypes.object,
  index:React.PropTypes.number,
	isCreate:React.PropTypes.bool,
	onSave:React.PropTypes.func,
	onCancel:React.PropTypes.func,
	isViewStatus:React.PropTypes.bool,
};
