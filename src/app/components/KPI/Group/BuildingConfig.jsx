import React, { Component } from 'react';
import TitleComponent from 'controls/TitleComponent.jsx';
import {SettingStatus,Type} from 'constants/actionType/KPI.jsx';
import GroupKPIStore from "stores/KPI/GroupKPIStore.jsx";
import CommonFuns from 'util/Util.jsx';
import BuildingItem from './BuildingItem.jsx';
import MonthConfig from './MonthConfig.jsx';

export default class BuildingConfig extends Component {

  constructor(props) {
    super(props);
    this._onCalcSum = this._onCalcSum.bind(this);
  }

  state={
    calcSum:this.props.status!==SettingStatus.New,
    buildingItem:null
    };

  _onCalcSum(calcSum){
    this.setState({
      calcSum
    })
  }


  _renderBuildingTable(uom){
    let {IndicatorType,Buildings}=this.props.kpiInfo.toJS();
    let type=IndicatorType===Type.Quota?I18N.Setting.KPI.Quota:I18N.Setting.KPI.SavingRate;
    let indicator=IndicatorType===Type.Quota?I18N.format(I18N.Setting.KPI.Group.BuildingConfig.Value,type,uom)
                                    :I18N.format(I18N.Setting.KPI.Group.BuildingConfig.Value,type,'%')
    var header=(
      <table className="jazz-kpi-group-buildings-header">
        <tbody>
          <tr>
            <td className="column1">{I18N.Setting.KPI.Group.BuildingConfig.Name}</td>
            <td className="column2">{indicator}</td>
            <td className="column3">{I18N.Setting.KPI.Group.BuildingConfig.Tag}</td>
            <td className="column4">{I18N.Setting.KPI.Group.BuildingConfig.Operation}</td>
          </tr>
        </tbody>
      </table>
    );
    var content=<table className='jazz-kpi-group-buildings-body'>
                                          <tbody>
                                              {
                                                Buildings.map((building,index)=>{
                                                  var props={
                                                    IndicatorType,index,
                                                    buildingInfo:building,
                                                    onMonthConfigShow:()=>{this.props.onMonthConfig(true,index)},
                                                    onCalcSum:this._onCalcSum
                                                  }
                                                  return(
                                                    <BuildingItem {...props}/>
                                                  )
                                                })
                                }
                              </tbody>
                            </table>

    return(
      <div className='jazz-kpi-group-buildings'>
        {header}
        {content}
      </div>
    )
  }

  _renderConfig(){
    let {IndicatorType,UomId}=this.props.kpiInfo.toJS();
    let uom=CommonFuns.getUomById(UomId).Code;
    let sumProps={
            title:I18N.format(I18N.Setting.KPI.Group.BuildingConfig.SumTitle,uom),
            contentStyle:{
              margin:'15px 0 30px 0'
            }
          };
    return(
        <div>
          {IndicatorType===Type.Quota &&
            <TitleComponent {...sumProps}>
              {CommonFuns.toThousands(GroupKPIStore.getBuildingSum(this.state.calcSum)) || '-'}
            </TitleComponent>
            }
          {this._renderBuildingTable(uom)}
        </div>
    )
  }

	render() {
    var isActive=GroupKPIStore.IsActive(this.props.status,this.props.kpiInfo);
    var props={
      title:I18N.Setting.KPI.Group.BuildingConfig.Title
    };
    if(isActive){
        return(
          <TitleComponent {...props}>
            {this._renderConfig()}
          </TitleComponent>
        )

    }
    else {
      return(
        <TitleComponent {...props} titleStyle={{color:'#e4e7e9'}}/>
      )
    }

  }
}
BuildingConfig.propTypes = {
	status:React.PropTypes.string,
	kpiInfo:React.PropTypes.object,
  onMonthConfig:React.PropTypes.func
};
