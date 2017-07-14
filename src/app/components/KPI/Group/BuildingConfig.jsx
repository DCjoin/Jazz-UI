import React, { Component } from 'react';
import TitleComponent from 'controls/TitleComponent.jsx';
import {SettingStatus,Type} from 'constants/actionType/KPI.jsx';
import GroupKPIStore from "stores/KPI/GroupKPIStore.jsx";
// import CommonFuns from 'util/Util.jsx';
import BuildingItem from './BuildingItem.jsx';
import GroupKPIAction from 'actions/KPI/GroupKPIAction.jsx';
import NewDialog from 'controls/NewDialog.jsx';
import FlatButton from 'controls/NewFlatButton.jsx';

export default class BuildingConfig extends Component {

  constructor(props) {
    super(props);
    this._onClearAllConfim = this._onClearAllConfim.bind(this);
    this._onClearAll = this._onClearAll.bind(this);

  }

  state={
    // calcSum:this.props.status!==SettingStatus.New,
    buildingItem:null,
    clearAllDiaglogShow:false
    };

  // _onCalcSum(calcSum){
  //   this.setState({
  //     calcSum
  //   })
  // }

  _onClearAll(){
    this.setState({
      clearAllDiaglogShow:false
    },()=>{
      GroupKPIAction.clearAllBuildingInfo()
    })

  }

  _onClearAllConfim(){
    this.setState({
      clearAllDiaglogShow:true
    })
  }

  _renderBuildingTable(){
    let {IndicatorType,IndicatorClass,Buildings}=this.props.kpiInfo.toJS();
    let type=IndicatorType===Type.Quota?I18N.Setting.KPI.Quota:I18N.Setting.KPI.SavingRate;
    let indicator=I18N.format(I18N.Setting.KPI.Group.BuildingConfig.Value,type);

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
    var content=Buildings?<table className='jazz-kpi-group-buildings-body'>
                                          <tbody>
                                              {
                                                Buildings.map((building,index)=>{
                                                  var props={
                                                    IndicatorType,index,IndicatorClass,
                                                    buildingInfo:building,
                                                    onMonthConfigShow:()=>{this.props.onMonthConfig(true,index)},
                                                  }
                                                  return(
                                                    <BuildingItem {...props}/>
                                                  )
                                                })
                                }
                              </tbody>
                            </table>
                            :null;
    var footer=<div className="jazz-kpi-group-buildings-footer" onClick={this._onClearAllConfim}>{I18N.Setting.KPI.Tag.ClearAll}</div>

    return(
      <div className='jazz-kpi-group-buildings'>
        {header}
        {content}
        {footer}
      </div>
    )
  }

  _renderClearAllDialog(){
    return(
      <NewDialog
        open={this.state.clearAllDiaglogShow}
        actions={[
            <FlatButton
              label={I18N.Common.Button.Confirm}
              inDialog={true}
              primary={true}
              onClick={this._onClearAll} />,

            <FlatButton
              label={I18N.Common.Button.Cancel2}
              onClick={() => {this.setState({
                clearAllDiaglogShow:false
              })}} />
          ]}
      >{I18N.Setting.KPI.Group.BuildingConfig.ClearAllTip}</NewDialog>
    )
  }
  _renderConfig(){
    // let {UomId}=this.props.kpiInfo.toJS();
    // let uom=CommonFuns.getUomById(UomId).Code;
    // let sumProps={
    //         title:I18N.format(I18N.Setting.KPI.Group.BuildingConfig.SumTitle,uom),
    //         contentStyle:{
    //           margin:'15px 0 30px 0'
    //         }
    //       };
    return(
        <div>
          {this._renderBuildingTable()}
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
            {this.state.clearAllDiaglogShow && this._renderClearAllDialog()}
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
