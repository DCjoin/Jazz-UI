import React, { Component } from 'react';
import classnames from 'classnames';
import StepComponent from './stepComponent.jsx';
import {Type} from 'constants/actionType/KPI.jsx';
import GroupKPIStore from 'stores/KPI/GroupKPIStore.jsx';
import RefreshIndicator from 'material-ui/RefreshIndicator';
import CommonFuns from 'util/Util.jsx';
import ViewableDosageBuildingConfig from './viewable_dosage_building_config.jsx';
import GroupKPIAction from 'actions/KPI/GroupKPIAction.jsx';


function getDisplayData(total,type){
  return total===null?'－':type===Type.Quota?CommonFuns.getLabelData(parseFloat(total)):parseFloat(total).toFixed(1)
}

function isView(building){
  return building.get("AnnualQuota") || building.get("AnnualSavingRate")
}

export default class BuildingConfig extends Component {

  static contextTypes = {
		router: React.PropTypes.object,
	};


  constructor(props) {
    super(props);
    this._onChange = this._onChange.bind(this);
  }

  state={
    configIndex:0,
    isConfigView:isView(this.props.kpiInfo.getIn(['Buildings',0])),
    total:GroupKPIStore.getTotal()
  }

  _onChange(){
    this.setState({
      total:GroupKPIStore.getTotal()
    })
  }

    getUom(){
    let {IndicatorClass,UomId,RatioUomId}=this.props.kpiInfo.toJS();
    if(IndicatorClass===Type.Dosage){
      if(UomId) {
        let uom=CommonFuns.getUomById(UomId).Code;
        return uom===''?'':`(${uom})`
      }
      else return ''
    }
    else if(UomId && RatioUomId){
      let uom=CommonFuns.getUomById(UomId).Code;
      let ratioUom=CommonFuns.getUomById(RatioUomId).Code;
      if(UomId===RatioUomId) return ''
      return `(${uom}/${ratioUom})`
    }
    else return ''
  }

  _renderBuildingList(){
    var {IndicatorClass,IndicatorType,Buildings}=this.props.kpiInfo.toJS();
    return(
      <div className="jazz-kpi-config-edit-building-config-field-building-info">
        {IndicatorClass===Type.Dosage && <div className="jazz-kpi-config-edit-building-config-field-building-info-total" style={{position:'relative'}}>
          {I18N.SumWindow.Sum+"："}
          {this.state.total==='loading'?<RefreshIndicator status="loading" top={6} left={50}/>:getDisplayData(this.state.total,IndicatorType)+this.getUom()}
          </div>}
        <div className="jazz-kpi-config-edit-building-config-field-building-info-list">
          {Buildings.map((building,index)=>{
            var {HierarchyName,AnnualQuota,AnnualSavingRate}=building;
            var value=getDisplayData(IndicatorType===Type.Quota?AnnualQuota:AnnualSavingRate,IndicatorType);
            return(
                     <div className={classnames('building-item', {['selected']: index === this.state.configIndex})} 
                          onClick={()=>{this.setState({configIndex:index,
                                                        isConfigView:AnnualQuota || AnnualSavingRate},
                                                        ()=>{
                                                          if(AnnualQuota || AnnualSavingRate){
                                                            this.props.onCancel();
                                                          }else{
                                                            this.props.onEdit()
                                                          }
                                                        })}}>
                          <div className="name" title={HierarchyName}>{HierarchyName}</div>
                          <div>{(IndicatorType===Type.Quota?I18N.Setting.KPI.Quota:I18N.Setting.KPI.SavingRate)
                                + '：'
                                + (value==='－'?value:value+this.getUom())}</div>
                     </div>
              )
          }
          )}
        </div>
        
      </div>
    )
  }

  _renderBuildingConfig(){
    var {IndicatorClass,IndicatorType}=this.props.kpiInfo.toJS();
    var {AnnualQuota,AnnualSavingRate}=this.props.kpiInfo.getIn(["Buildings",this.state.configIndex]).toJS();

    // disableCancel={!AnnualQuota && !AnnualSavingRate}
    return(
        IndicatorClass===Type.Dosage?<ViewableDosageBuildingConfig isViewStatus={this.state.isConfigView}
                                disableEdit={this.props.configStep===1}
                                index={this.state.configIndex}
                                kpiInfo={this.props.kpiInfo}
                                indicatorType={IndicatorType}
                                onEdit={()=>{
                                              this.setState({isConfigView:false});
                                              this.props.onEdit()
                                              }}
                                onCancel={()=>{
                                              this.setState({isConfigView:true});
                                              this.props.onCancel()
                                              }}
                                onSave={()=>{
                                  this.setState({
                                    isConfigView:true,
                                    total:'loading'
                                    },()=>{
                                      if(IndicatorType===Type.Quota){
                                          GroupKPIAction.updateTotal(GroupKPIStore.getBuildingSum(true))
                                           }else{
                                          GroupKPIAction.getSavingRateTotal(parseInt(this.context.router.params.customerId),this.props.year)
                                        }
                                    });
                                  
                                  
                                  this.props.onSave();
                                }}
          />:<div/>
    )
  }

	componentDidMount(){
		GroupKPIStore.addChangeListener(this._onChange);
	}

  	componentWillUnmount(){
		GroupKPIStore.removeChangeListener(this._onChange);
	}

  render(){
    return(
      <StepComponent step={2} isfolded={false} title={I18N.Setting.KPI.Config.Building} isfolded={this.props.isNew}
                    isView={false}>
        <div className="jazz-kpi-config-edit-building-config-field">
          {this._renderBuildingList()}
          <div className="jazz-kpi-config-edit-building-config-field-building-config">
            {this._renderBuildingConfig()}
          </div>
        </div>
      </StepComponent>
    )
  }
}

BuildingConfig.propTypes = {
	configStep:React.PropTypes.number || null,
  isNew:React.PropTypes.bool,
	kpiInfo:React.PropTypes.object,
  onEdit:React.PropTypes.func,
  onCancel:React.PropTypes.func,
  onSave:React.PropTypes.func,
  year:React.PropTypes.number,
};