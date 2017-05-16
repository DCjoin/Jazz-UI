'use strict';
import React, { Component }  from "react";
import {find} from 'lodash';
import HierarchyStore from 'stores/HierarchyStore.jsx';
import CurrentUserCustomerStore from 'stores/CurrentUserCustomerStore.jsx';
import ViewableDropDownMenu from 'controls/ViewableDropDownMenu.jsx';
import UserStore from 'stores/UserStore.jsx';
import NewAppTheme from '../../../decorator/NewAppTheme.jsx';

function getCustomerPrivilageById(customerId) {
  return UserStore.getUserCustomers().find(customer => customer.get('CustomerId') === customerId * 1 );
}

function getCustomerById(customerId) {
  return find(CurrentUserCustomerStore.getAll(), customer => customer.Id === customerId * 1 );
}

function singleProjectMenuItems() {
  if( !HierarchyStore.getBuildingList() || HierarchyStore.getBuildingList().length === 0 ) {
    return [];
  }
  return [{
      Id: -2,
      disabled: true,
      Name: I18N.Setting.KPI.Building
    }].concat(HierarchyStore.getBuildingList());
}
function groupProjectMenuItems(customerId) {
  if( !CurrentUserCustomerStore.getAll() || CurrentUserCustomerStore.getAll().length === 0 || (getCustomerPrivilageById( customerId ) && !getCustomerPrivilageById( customerId ).get('WholeCustomer')) ) {
    return [];
  }
  return [{
      Id: -1,
      disabled: true,
      Name: I18N.Kpi.GroupProject
    }].concat(getCustomerById(customerId));
}

export default class ProjectSelect extends Component {

  render(){
    return(
      <ViewableDropDownMenu
            isViewStatus={false}
            defaultValue={this.props.hierarchyId}
            style={{
              width: this.props.width,
              margin: '0 20px'
            }}
            labelStyle={{
              color: '#fff',
              fontSize:'14px'
            }}
            listStyle={{
              width: this.props.width,
            }}
            underlineStyle={{
              display: 'none',
            }}
            didChanged={this.props.onProjectSelected}
            textField={'Name'}
            valueField={'Id'}
            dataItems={groupProjectMenuItems(this.props.customerId).concat(singleProjectMenuItems())}/>
    )
  }
}

ProjectSelect.propTypes = {
	hierarchyId:React.PropTypes.number,
  onProjectSelected:React.PropTypes.func,
  customerId:React.PropTypes.number,
  width:React.PropTypes.number,
};

ProjectSelect.defaultProps={
  width:150
}
