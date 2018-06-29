'use strict';

import React from "react";
import { FontIcon } from 'material-ui';
import classNames from 'classnames';

export default function ToggleIconPanel({isFolded=true,onToggle,children}){
  //when left field is unfold ,Panel "isFolded" is true 
  return(
    <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden'
      }} className='jazz-content'>
      <div className="pop-framework-right-actionbar" style={{minHeight:'30px'}}>
          <div className="pop-framework-right-actionbar-top">
            <div className="toggle-btn pop-framework-right-actionbar-top-fold-btn" style={{
              "color": "#939796"
            }}>
              <FontIcon className={classNames({"icon":true, "icon-pack-up":isFolded,"icon-unfold":!isFolded})} onClick={onToggle}/>
            </div>
          </div>

      </div>
      {children}
    </div>
  )
}
