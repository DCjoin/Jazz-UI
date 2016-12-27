import React, { Component} from 'react';
import { DataStatus,Unit} from 'constants/actionType/KPI.jsx';
import CircularProgress from 'material-ui/CircularProgress';
import Checkbox from 'material-ui/Checkbox';
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton';
import RankingKPIStore from 'stores/KPI/RankingKPIStore.jsx';
import RankingKPIAction from 'actions/KPI/RankingKPIAction.jsx';
import TitleComponent from 'controls/TitleComponent.jsx';
import ViewableDropDownMenu from 'controls/ViewableDropDownMenu.jsx';
import FlatButton from 'controls/FlatButton.jsx';
import RankHistory from '../Single/RankHistory.jsx';

var customerId;
export default class Ranking extends Component {

  	static contextTypes = {
  		router: React.PropTypes.object,
  	};

  	constructor(props) {
  		super(props);
      this._onChange = this._onChange.bind(this);
      this._onSave = this._onSave.bind(this);
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
      })
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
    }

    _renderKpiRanking(){
      let titleProps={
        title:I18N.Setting.KPI.Group.Ranking.kpi,
        style:{
          marginTop:'0'
        },
        contentStyle:{
          marginLeft:'0'
        },
        titleStyle:{
          fontSize:'16px'
        }
      };
      return(
        <div className="jazz-kpi-group-ranking-block">
          <TitleComponent {...titleProps}>
            {this.state.allKpis.map(kpi=>(
              <Checkbox value={kpi.get('Id')}
                        label={kpi.get("Name")}
                        checked={this.state.config.get('GroupKpiIds').findIndex(item=>item===kpi.get('Id'))>-1}
                        onCheck={this._onkpiChecked}
                        style={{margin:'10px 0'}}/>
            ))}
          </TitleComponent>
        </div>
      )
    }

    _renderUpRanking(){
      let algorithmId=this.state.config.get('UnitType'),
          kpiId=this.state.config.get('TopGroupKpiId');
      let titleProps={
        title:I18N.Setting.KPI.Group.Ranking.Up,
        contentStyle:{
          marginLeft:'0'
        },
        titleStyle:{
          fontSize:'16px'
        }
      },
      subTitileProps={
        title:I18N.Setting.KPI.Group.Ranking.Algorithm,
        style:{
          marginTop:'0'
        },
        contentStyle:{
          marginLeft:'0'
        },
        titleStyle:{
          fontSize:'14px'
        }
      };
      let sourceProps={
        ref: 'source',
        isViewStatus: false,
        title: I18N.Setting.KPI.Group.Ranking.SelectSource,
        defaultValue: kpiId || Unit.None,
        dataItems: RankingKPIStore.getKpiList().toJS(),
        didChanged:this._onKpiSourceChange
      };

      return(
        <div className="jazz-kpi-group-ranking-block">
          <TitleComponent {...titleProps}>
            <TitleComponent {...subTitileProps}>
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
            </TitleComponent>
          </TitleComponent>
        </div>
      )
    }

    componentDidMount(){
      customerId=parseInt(this.context.router.params.customerId);
      RankingKPIStore.addChangeListener(this._onChange);
      RankingKPIAction.getGroupKpis(customerId);
    }

    componentWillUnmount(){
      RankingKPIStore.removeChangeListener(this._onChange);
    }

    render(){
      if(this.state.allKpis && this.state.allKpis.size===0){
        return(
          <div className="noContent flex-center">{I18N.Setting.KPI.Group.Ranking.NoKpi}</div>
        )
      }
      else if(this.state.config){
        return(
          <div className="jazz-margin-up-main jazz-kpi-group-ranking">
            <header className="header-bar">{I18N.Setting.KPI.Group.Ranking.Title}</header>
            <article className="content">
              {this._renderKpiRanking()}
              {this._renderUpRanking()}
              <FlatButton
                    style={{border:'1px solid #e4e7e9',marginTop:"30px"}}
                    label={I18N.Common.Button.Save}
                    onTouchTap={this._onSave}
                     />
                   <RankHistory/>
            </article>
          </div>
        )
      }
      else{
        return(
          <div className="noContent flex-center"><CircularProgress  mode="indeterminate" size={80} /></div>
        )
      }

    }
}
