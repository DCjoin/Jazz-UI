'use strict';

import React, { Component, PropTypes } from 'react';
import ColumnMenu from 'controls/ColumnMenu.jsx';
import GroupKPIStore from 'stores/KPI/GroupKPIStore.jsx';

export default class ConfigMenu extends Component {

  render(){

    return(
      <div className="jazz-kpi-group-config">
      <div className="menu">
      <ColumnMenu title={I18N.Setting.KPI.Group.Config} items={GroupKPIStore.getConfigMenu()}/>
      </div>        
        {this.props.children}
      </div>
    )
  }
}