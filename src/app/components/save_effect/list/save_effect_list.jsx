import React, { Component } from 'react';
import {ItemForConsultant} from './Item.jsx';
import _ from 'lodash-es';
import Immutable from "immutable";

const arr=_.fill(Array(10),{
  isCalculated:true,
  startTime:'2017-1-6 16:00',
  tagNumber:3,
  tagTotal:5,
  cost:123456

})
export default class EffectList extends Component {
  render(){
    return(
      <div className="jazz-effect-list">
        <div className="jazz-effect-list-title">{I18N.Setting.Effect.List}</div>
        <div className="jazz-effect-list-content">
          {Immutable.fromJS(arr).map(item=>(<ItemForConsultant effect={item}/>))}
        </div>

      </div>
    )
  }
}

EffectList.propTypes = {
  list:React.PropTypes.object,
};
