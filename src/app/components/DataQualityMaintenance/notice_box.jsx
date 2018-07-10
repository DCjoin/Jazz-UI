'use strict';

import React, { PureComponent}  from "react";
import moment from 'moment';
import Spin from '@emop-ui/piano/spin';

const AnomalyTypeArr=['',I18N.Setting.VEEMonitorRule.NullValue,I18N.Setting.VEEMonitorRule.NegativeValue,I18N.Setting.VEEMonitorRule.ZeroValue,I18N.Setting.VEEMonitorRule.JumpValue] 

export default class NoticeBox extends PureComponent {
  render(){
    return(
      <div className="notice-box">
        <div className="notice-box-title">{I18N.VEE.Notice.Title}</div>
        <div className="notice-box-list">
          {this.props.list===null?<Spin/>
            :(this.props.list.size===0?
            <div style={{display:'flex',flex:'1',justifyContent: 'center',
    alignItems: 'center',fontSize: '14px',color: '#626469'}}>{I18N.VEE.Notice.NoNotice }</div>
            :this.props.list.map(item=>(
            <div className="notice-box-list-item">
              <div className="row">
                <div className="circle"/>
                <div className="text">{moment(item.get("From")+'Z').format("YYYY-MM-DD HH:mm")+I18N.EM.To2+moment(item.get("To")+"Z").format("YYYY-MM-DD HH:mm")}</div>
              </div>
              <div className="row">
                <div style={{width:'6px'}}/>
                <div className="text">{I18N.format(I18N.VEE.Notice.Happen,AnomalyTypeArr[item.get("AnomalyType")])}</div>
              </div>
            </div>
          )))}
        </div>
      </div>
    )
  }
}