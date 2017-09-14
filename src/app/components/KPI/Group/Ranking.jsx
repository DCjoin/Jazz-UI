import React, { Component} from 'react';
import { DataStatus,UnitType as Unit} from 'constants/actionType/KPI.jsx';
import CircularProgress from 'material-ui/CircularProgress';
import Checkbox from 'material-ui/Checkbox';
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton';
import RankingKPIStore from 'stores/KPI/RankingKPIStore.jsx';
import RankingKPIAction from 'actions/KPI/RankingKPIAction.jsx';
import TitleComponent from 'controls/TitleComponent.jsx';
import ViewableDropDownMenu from 'controls/ViewableDropDownMenu.jsx';
import NewFlatButton from 'controls/NewFlatButton.jsx';
// import RankHistory from '../Single/RankHistory.jsx';

function getDataItems(algorithmId) {
  let rawList = RankingKPIStore.getKpiList().toJS();
  if(
    algorithmId === Unit.TotalAreaUnit ||
    algorithmId === Unit.TotalRoomUnit ||
    algorithmId === Unit.TotalPersonUnit
  ) {
    rawList = rawList.filter(kpi => !kpi.ActualRatioTagId);
  }
  return rawList;
}

var customerId;
export default class Ranking extends Component {

  	constructor(props) {
  		super(props);
      this._onChange = this._onChange.bind(this);
      this._onSave = this._onSave.bind(this);
      this._onAlgorithmChange = this._onAlgorithmChange.bind(this);
  	}

    state={
          allKpis:null,
          config:null
        };

    _onChange(){
      this.setState({
        allKpis:RankingKPIStore.getAllKpis(),
        config:RankingKPIStore.getRankingConfig()
      })
    }

    _onkpiChecked(event,isChecked){
      RankingKPIAction.merge({
        path:'GroupKpiIds',
        value:parseInt(event.target.value),
        status:isChecked?DataStatus.ADD:DataStatus.DELETE
      })
    }

    _onAlgorithmChange(ev,value){
      RankingKPIAction.merge({
        path:'UnitType',
        value
      });
      if(
        (
          value === Unit.TotalAreaUnit ||
          value === Unit.TotalRoomUnit ||
          value === Unit.TotalPersonUnit
        ) &&
        !RankingKPIStore.getKpiList().find(kpi => kpi.payload === this.state.config.get('TopGroupKpiId')).ActualRatioTagId
      ) {      
        RankingKPIAction.merge({
          path:'TopGroupKpiId',
          value: RankingKPIStore.getKpiList()
                  .filter(kpi => !kpi.ActualRatioTagId)
                  .get(0).payload,
        })      
      }
    }

    _onKpiSourceChange(value){
      RankingKPIAction.merge({
        path:'TopGroupKpiId',
        value
      })
    }

    _onSave(){
      let {GroupKpiIds,UnitType,TopGroupKpiId}=this.state.config.toJS();
      if(UnitType===Unit.None){
        TopGroupKpiId=null
      }
      RankingKPIAction.setRank({
        CustomerId:customerId,
        GroupKpiIds,UnitType,TopGroupKpiId
      });
      this.props.onClose();
    }

    _renderKpiRanking(){
      return(
        <div className="jazz-kpi-group-ranking-block">
          <header className='jazz-kpi-group-ranking-block-header'>{I18N.Setting.KPI.Group.Ranking.kpi}</header>
          <div>
            {this.state.allKpis.map(kpi=>(
              <Checkbox value={kpi.get('Id')}
                        label={kpi.get("Name")}
                        checked={this.state.config.get('GroupKpiIds').findIndex(item=>item===kpi.get('Id'))>-1}
                        onCheck={this._onkpiChecked}
                        style={{margin:'10px 0', width: 'auto'}}
                        labelStyle={{width: 'auto'}}/>
            ))}
            </div>
        </div>
      )
    }

    _renderUpRanking(){
      let algorithmId=this.state.config.get('UnitType'),
      kpiId=this.state.config.get('TopGroupKpiId'),
      sourceProps={
        ref: 'source',
        isViewStatus: false,
        title: I18N.Setting.KPI.Group.Ranking.SelectSource,
        defaultValue: kpiId || Unit.None,
        dataItems: getDataItems(algorithmId),
        didChanged:this._onKpiSourceChange
      };

      return(
        <div className="jazz-kpi-group-ranking-block">
          <header className='jazz-kpi-group-ranking-block-header'>{I18N.Setting.KPI.Group.Ranking.Up}</header>
          <div>
            <header className='jazz-kpi-group-ranking-block-subheader'>{I18N.Setting.KPI.Group.Ranking.Algorithm}</header>
            <div>
              <RadioButtonGroup name="type" valueSelected={algorithmId}
                                onChange={this._onAlgorithmChange}>
                {RankingKPIStore.getAlgorithmList().map(item=>(
                          <RadioButton
                            value={item.Id}
                            label={item.Name}
                            style={{width:'200px',marginBottom:'15px'}}
                            />
                ))}
                </RadioButtonGroup>
                {algorithmId!==Unit.None && <ViewableDropDownMenu {...sourceProps}/>}
            </div>
          </div>
        </div>
      )
    }

    componentDidMount(){
      customerId=this.props.customerId;
      RankingKPIStore.addChangeListener(this._onChange);
      RankingKPIAction.getGroupKpis(customerId);
    }

    componentWillUnmount(){
      RankingKPIStore.removeChangeListener(this._onChange);
    }

    render(){
      if(this.state.allKpis && this.state.allKpis.size===0){
        return(
          <div className="jazz-margin-up-main jazz-kpi-group-ranking">
            <div className='jazz-main-content'>
              <header className='header-bar'>
                <em onClick={this.props.onClose} className='icon-return' style={{marginRight: 20}}/>
                {I18N.Setting.KPI.Group.Ranking.Title}
              </header>
              <article className="content" style={{display:'flex'}}>
                <div className="flex-center">{I18N.Setting.KPI.Group.Ranking.NoKpi}</div>
              </article>
            </div>
        </div>
        )
      }
      else if(this.state.config){
        return(
          <div className="jazz-margin-up-main jazz-kpi-group-ranking">
            <div className='jazz-main-content'>
              <header className='header-bar'>
                <em onClick={this.props.onClose} className='icon-return' style={{marginRight: 20}}/>
                {I18N.Setting.KPI.Group.Ranking.Title}
              </header>
              <article className="content">
                {this._renderKpiRanking()}
                {this._renderUpRanking()}
              </article>
              <NewFlatButton
                primary
                style={{alignSelf: 'flex-end', width:'88px',margin: '20px 0', flex: 'none'}}
                label={I18N.Common.Button.Save}
                onTouchTap={this._onSave}/>
            </div>
          </div>
        )
      }
      else{
        return(
          <div className="noContent flex-center"><CircularProgress  mode="indeterminate" size={80}/></div>
        )
      }
    }
}
