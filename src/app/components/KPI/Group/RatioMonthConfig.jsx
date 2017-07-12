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
    let tagProps={
      kpiInfo:this.props.kpiInfo,
      buildingInfo:this.state.buildingInfo,
      isCreate:isCreate,
    };

    return(
      <div className='diagnose-overlay'>
        <header className='diagnose-overlay-header'>
            <span>{`${HierarchyName}-${I18N.Setting.KPI.Group.MonthConfig.Title}`}</span>
        </header>
        <div style={{marginLeft:'15px'}}>
        <ActualTag {...tagProps}/>
        {this._renderMonthValue()}</div>
      <FormBottomBar isShow={true} saveBtnProps={{label:I18N.Platform.Password.Confirm}} allowDelete={false} allowEdit={false} enableSave={MonthKPIStore.validateRatioMonthInfo(this.state.buildingInfo)}
      ref="actionBar" status={formStatus.EDIT} onSave={this._onSave} onCancel={this.props.onCancel}
      cancelBtnProps={{label:I18N.Common.Button.Cancel2}}/>
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
};
