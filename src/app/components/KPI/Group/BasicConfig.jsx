import React, { Component } from 'react';
import TitleComponent from 'controls/TitleComponent.jsx';
import {SettingStatus,Type} from 'constants/actionType/KPI.jsx';
import ViewableKPIType from './ViewableKPIType.jsx';
import ViewableDropDownMenu from 'controls/ViewableDropDownMenu.jsx';
import ViewableTextField from 'controls/ViewableTextField.jsx';
import GroupKPIStore from "stores/KPI/GroupKPIStore.jsx";
import GroupKPIAction from 'actions/KPI/GroupKPIAction.jsx';

export default class BasicConfig extends Component {

  	constructor(props) {
  		super(props);
  		this._onPrelongKpiChange = this._onPrelongKpiChange.bind(this);
  	}

  _onCommodityChange(value){
    GroupKPIAction.merge([{
      path:'CommodityId',
      value
    }])
    }

  _onNameChange(value){
    GroupKPIAction.merge([{
      path:'IndicatorName',
      value
    }])
  }

  _onPrelongKpiChange(value){
    GroupKPIAction.getGroupContinuous(value,this.props.year);
    // this.setState({
    //   ProlongkpiId:value
    // })
  }

  _onTypeChange(value){
    GroupKPIAction.merge([{
      path:'IndicatorType',
      value
    }])
  }

  _onClassChange(ev,value){
    GroupKPIAction.merge([{
      path:'IndicatorClass',
      value
    },{
      path:'IndicatorType',
      value:1
    }])
  }

  _renderNewBasic(){
    let {CommodityId,IndicatorName,IndicatorType,IndicatorClass}=this.props.kpiInfo.toJS();
    let commodityProps={
      ref: 'commodity',
      isViewStatus: false,
      title: I18N.Setting.KPI.Group.Commodity,
      defaultValue: CommodityId || -1,
      dataItems: GroupKPIStore.getCommodityList(),// 2017/7/11 support all commodities
      didChanged:this._onCommodityChange
    },
    nameProps={
      ref: 'name',
      isViewStatus: false,
      didChanged: this._onNameChange,
      defaultValue: IndicatorName || '',
      hintText:I18N.Setting.KPI.Basic.NameHint,
      title: I18N.Setting.KPI.Basic.Name,
      isRequired: true,
      style:{
        marginTop:'15px',
        marginBottom:'15px'
      }
    },
    typeProps={
      status:SettingStatus.New,
      type:IndicatorType,
      indicatorClass:IndicatorClass,
      onTypeChange:this._onTypeChange,
      onClassChange:this._onClassChange
    };
    return(
      <div style={{display:'flex','flexDirection':'column'}}>
        <ViewableDropDownMenu {...commodityProps}/>
        <ViewableTextField {...nameProps}/>
        <ViewableKPIType {...typeProps}/>
      </div>
    )
  }

  _renderEditBasic(){
    let {IndicatorType,IndicatorClass}=this.props.kpiInfo.toJS();
    return(
      <ViewableKPIType status={SettingStatus.Edit} type={IndicatorType} indicatorClass={IndicatorClass}/>
    )
  }

  _renderProlongBasic(){
    let {IndicatorType,IndicatorClass}=this.props.kpiInfo.toJS();
    let prolongkpiProps={
      ref: 'Prolongkpi',
      isViewStatus: false,
      title: I18N.Setting.KPI.Group.Prolongkpi,
      defaultValue: GroupKPIStore.getProlongkpiId(),
      dataItems: GroupKPIStore.getGroupList(),
      didChanged:this._onPrelongKpiChange,
      style:{
        marginBottom:'30px'
      }
    },
    typeProps={
      status:SettingStatus.Prolong,
      type:IndicatorType || Type.Quota,
      indicatorClass:IndicatorClass,
      onTypeChange:this._onTypeChange,
      onClassChange:this._onClassChange
    };
    return(
      <div>
        <ViewableDropDownMenu {...prolongkpiProps}/>
        <ViewableKPIType {...typeProps}/>
      </div>
    )
  }

  _renderConfig(){
    let content;
    switch(this.props.status) {
      case SettingStatus.New:
          content=this._renderNewBasic();
          break;
      case SettingStatus.Edit:
          content=this._renderEditBasic();
          break;
      case SettingStatus.Prolong:
          content=this._renderProlongBasic();
          break;
      default:
        // do nothing
    }
    return content;
  }

	render() {
    let props={
      title:I18N.Setting.KPI.Basic.Title
    };
    return(
      <TitleComponent {...props}>
        {this._renderConfig()}
      </TitleComponent>
    )
  }
}
BasicConfig.propTypes = {
	status:React.PropTypes.string,
	kpiInfo:React.PropTypes.object,
  year:React.PropTypes.number
};
