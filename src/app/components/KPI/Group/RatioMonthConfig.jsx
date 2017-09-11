'use strict';
import React, {Component} from 'react';
import {IconButton} from 'material-ui';
import Immutable from 'immutable';
import MonthKPIAction from 'actions/KPI/MonthKPIAction.jsx';
import GroupKPIAction from 'actions/KPI/GroupKPIAction.jsx';
import MonthKPIStore from 'stores/KPI/MonthKPIStore.jsx'
import TitleComponent from 'controls/TitleComponent.jsx';
import FormBottomBar from 'controls/FormBottomBar.jsx';
import { formStatus } from 'constants/FormStatus.jsx';
import ActualTag from './RatioActualTag.jsx';
import MonthValue from './MonthValue.jsx';
import Prediction from './GroupPrediction.jsx';
import CommonFuns from 'util/Util.jsx';
import FlatButton from "controls/NewFlatButton.jsx";

export default class RatioMonthConfig extends Component {

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
      },{
        path:`RatioUomId`,
        value:this.state.buildingInfo.get('RatioUomId')
      },{
        path:`RatioCommodityId`,
        value:this.state.buildingInfo.get('RatioCommodityId')
      },{
        path:`NumeratorCommodityId`,
        value:this.state.buildingInfo.get('NumeratorCommodityId')
      }]);
    }

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

  _renderFooter(){
    return(
      <div className="jazz-kpi-config-edit-step-action">
                             {!this.props.isCreate && <FlatButton label={I18N.Common.Button.Cancel2} secondary={true} style={{float:'right',minWidth:'68px'}} onTouchTap={this.props.onCancel}/>}
                             <FlatButton label={I18N.Common.Button.Save} disabled={!MonthKPIStore.validateRatioMonthInfo(this.state.buildingInfo)} primary={true} style={{float:'right',minWidth:'68px',marginRight:'20px'}} 
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
    let {isCreate}=this.props;
	  let {HierarchyName}=this.state.buildingInfo.toJS();
    let tagProps={
      kpiInfo:this.props.kpiInfo,
      buildingInfo:this.state.buildingInfo,
      isCreate:isCreate,
    };

    return(
      <div>
          <ActualTag {...tagProps}/>
          {this._renderMonthValue()}
          {!this.props.isViewStatus && this._renderFooter()}
    </div>
    )
  }
}

RatioMonthConfig.propTypes = {
  kpiInfo:React.PropTypes.object,
  index:React.PropTypes.number,
	isCreate:React.PropTypes.bool,
	onSave:React.PropTypes.func,
	onCancel:React.PropTypes.func,
	isViewStatus:React.PropTypes.bool,
};
