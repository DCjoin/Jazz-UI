import React, { Component, PropTypes } from 'react';
import { CircularProgress } from 'material-ui';
import HierarchyStore from 'stores/hierarchySetting/HierarchyStore.jsx';
import Customer from './CustomerForHierarchy.jsx';
import Organization from './Organization/Organization.jsx';
import Building from './Building/Building.jsx';
import Dim from './Dim/Dim.jsx';

export default class HierarchyDetail extends Component {

  render(){
    var {detailProps}=this.props;
     var type = detailProps.selectedNode.get('Type'),
      detail = null;
    switch (type) {
      case -1:
        detailProps.ref = 'jazz_hierarchy_customer_detail';
        let consultants1 = HierarchyStore.getConsultants();
        detail = consultants1 ? <Customer {...detailProps} consultants={consultants1}/>: 

          <div style={{
            display: 'flex',
            flex: 1,
            'alignItems': 'center',
            'justifyContent': 'center'
          }}>
            <CircularProgress  mode="indeterminate" size={80} />
          </div>;
        break;
      case 0:
      case 1:
        detailProps.ref = 'jazz_hierarchy_organization_detail';
        detail = <Organization {...detailProps}/>;
        break;
      case 2:
        detailProps.ref = 'jazz_hierarchy_building_detail';
        let consultants = HierarchyStore.getConsultants();
        detail = consultants ? <Building {...detailProps} consultants={consultants}/>: 

          <div style={{
            display: 'flex',
            flex: 1,
            'alignItems': 'center',
            'justifyContent': 'center'
          }}>
            <CircularProgress  mode="indeterminate" size={80} />
          </div>;
        break;
      case 101:
        detailProps.ref = 'jazz_hierarchy_dim_detail';
        detail = <Dim {...detailProps}/>;
        break;
    }
    return detail;
  }
}

HierarchyDetail.propTypes = {
  detailProps:React.PropTypes.object,
};