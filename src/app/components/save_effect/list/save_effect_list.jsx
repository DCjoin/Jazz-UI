import React, { Component } from 'react';
import {ItemForManager} from './Item.jsx';
import _ from 'lodash-es';
import Immutable from "immutable";
import FlatButton from "controls/NewFlatButton.jsx";

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
export default class EffectList extends Component {
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
    return(
      <div className="jazz-effect-list">
        <div className="jazz-effect-list-header">
          <div className="jazz-effect-list-title">{I18N.Setting.Effect.List}</div>
          <FlatButton label={I18N.SaveEffect.ConfigEnergySavingRate} style={style.btn} labelStyle={style.lable} secondary={true}/>
        </div>

        <div className="jazz-effect-list-content">
          {Immutable.fromJS(arr).map(item=>(<ItemForManager effect={item}/>))}
        </div>

      </div>
    )
  }
}

EffectList.propTypes = {
  list:React.PropTypes.object,
};
