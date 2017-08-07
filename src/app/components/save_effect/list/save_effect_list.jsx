import React, { Component } from 'react';
import {ItemForManager,ItemForConsultant} from './Item.jsx';
import _ from 'lodash-es';
import Immutable from "immutable";
import privilegeUtil from 'util/privilegeUtil.jsx';
import PermissionCode from 'constants/PermissionCode.jsx';
import CurrentUserStore from 'stores/CurrentUserStore.jsx';
import FlatButton from "controls/NewFlatButton.jsx";
import {getenergyeffect} from 'actions/save_effect_action.js';
import ListStore from '../../../stores/save_effect/ListStore.jsx';
import { CircularProgress} from 'material-ui';

function privilegeWithSave_Effect( privilegeCheck ) {
   return true
	// return privilegeCheck(PermissionCode.Save_Effect, CurrentUserStore.getCurrentPrivilege());
}
function isFull() {
	return privilegeWithSave_Effect(privilegeUtil.isFull.bind(privilegeUtil));
}

const arr=_.fill(Array(10),{
  "AnnualCostSaving": 1.1,
  "CalcState": 1,
      "ConfigedTagCount": 2,
      "EnergyProblemId": 3,
      "EnergySolutionName": "sample string 4",
      "EnergySystem": 10,
      "ExecutedTime": "2017-08-07T08:20:22",
      "TotalTagCount": 6

})
const draftarr=_.fill(Array(10),{
  "ConfigStep": 1,
      "EnergyProblemId": 2,
      "EnergySolutionName": "sample string 3",
      "TagId": 4,
      "TagName": "sample string 5"

})
export default class EffectList extends Component {

  static contextTypes = {
        hierarchyId: React.PropTypes.string
      };

  constructor(props, ctx) {
        super(props)
        this._onChanged = this._onChanged.bind(this);
  }

  state={
    effect:Immutable.fromJS({
  "Drafts": [
    {
      "ConfigStep": 1,
      "EnergyProblemId": 2,
      "EnergySolutionName": "sample string 3",
      "TagId": 4,
      "TagName": "sample string 5"
    },
    {
      "ConfigStep": 1,
      "EnergyProblemId": 2,
      "EnergySolutionName": "sample string 3",
      "TagId": 4,
      "TagName": "sample string 5"
    }
  ],
  "EnergyEffects": [
    {
      "AnnualCostSaving": 1.1,
      "CalcState": 1,
      "ConfigedTagCount": 2,
      "EnergyProblemId": 3,
      "EnergySolutionName": "sample string 4",
      "EnergySystem": 10,
      "ExecutedTime": "2017-08-07T08:20:22",
      "TotalTagCount": 6
    },
    {
      "AnnualCostSaving": 1.1,
      "CalcState": 1,
      "ConfigedTagCount": 2,
      "EnergyProblemId": 3,
      "EnergySolutionName": "sample string 4",
      "EnergySystem": 10,
      "ExecutedTime": "2017-08-07T08:20:22",
      "TotalTagCount": 6
    }
  ],
  "SavingRateConfigState": 1
})
  }

  _onChanged(){
    this.setState({
      effect:ListStore.getEffect()
    })
  }

  componentDidMount(){
    getenergyeffect(this.context.hierarchyId);
    ListStore.addChangeListener(this._onChanged);
  }

  componentWillUnmount(){
    ListStore.removeChangeListener(this._onChanged);
  }

  render(){
    var style={
      btn:{
        height:'30px',
        width:'100px',
        lineHeight:'30px',
        marginLeft:'15px'
      },
      lable:{
        fontSize: "14px",
        fontWeight: "500",
        padding:'0'
      }
    };
    if(this.state.effect===null){
      return (
        <div className="jazz-effect-list flex-center" style={{flex:'none'}}>
         <CircularProgress  mode="indeterminate" size={80} />
       </div>
      )
    }else if(this.state.effect.get('EnergyEffects').size===0){
      return (
        <div className="jazz-effect-list flex-center" style={{flex:'none'}}>
         {I18N.SaveEffect.NoEffectList}
       </div>
      )
    }else {
      return(
        <div className="jazz-effect-list">
          {this.state.effect.get('SavingRateConfigState') && <div className="jazz-effect-list-rateTip">
            {I18N.SaveEffect.EffectRateTip}
          </div>}
          <div className="jazz-effect-list-header">
            <div className="jazz-effect-list-title">{I18N.Setting.Effect.List}</div>
            <FlatButton label={I18N.SaveEffect.ConfigSaveRatio} style={style.btn} labelStyle={style.lable} secondary={true}/>
          </div>
          <div className="jazz-effect-list-content">
            {this.state.effect.get("EnergyEffects").map(item=>(isFull()?<ItemForConsultant effect={item}/>:<ItemForManager effect={item}/>))}
          </div>

        </div>
      )
    }

  }
}

EffectList.propTypes = {
  list:React.PropTypes.object,
};
