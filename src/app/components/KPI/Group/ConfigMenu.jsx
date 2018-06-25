'use strict';

import React, { Component} from 'react';
import CircularProgress from 'material-ui/CircularProgress';
import ColumnMenu from 'controls/ColumnMenu.jsx';
import GroupKPIStore from 'stores/KPI/GroupKPIStore.jsx';
import CurrentUserStore from 'stores/CurrentUserStore.jsx';
import UserAction from 'actions/UserAction.jsx';
import UserStore from 'stores/UserStore.jsx';
import RoutePath from 'util/RoutePath.jsx';
import PropTypes from 'prop-types';
function getCustomerPrivilageById(customerId) {
	return UserStore.getUserCustomers().find(customer => customer.get('CustomerId') === customerId * 1 );
}

export default class ConfigMenu extends Component {

  static contextTypes = {
    hierarchyId: PropTypes.string
  };

  constructor(props) {
    super(props);
    this._onChange = this._onChange.bind(this);
  }

  state={
    userCustomers:null
  };

  _onChange(){
    this.setState({
      userCustomers:UserStore.getUserCustomers()
    })
  }

  _privilegedCustomer() {
    var customerId=this.props.params.customerId;
    return getCustomerPrivilageById(customerId) && getCustomerPrivilageById(customerId).get('WholeCustomer');
  }

  componentDidMount(){
    UserStore.addChangeListener(this._onChange);
    UserAction.getCustomerByUser(CurrentUserStore.getCurrentUser().Id);
  }

  componentWillReceiveProps({router}, nextContext) {
    if( nextContext.hierarchyId !== router.params.customerId * 1 ) {
      router.replace( RoutePath.report.actualityKpi(router.params) + router.location.search );
    }
  }

  componentWillUnmount(){
    UserStore.removeChangeListener(this._onChange);
  }

  render(){
    if(this.state.userCustomers===null){
      return (<div className="noContent flex-center"><CircularProgress  mode="indeterminate" size={80} /></div>)
    }
    else if(this._privilegedCustomer()){
      return(
        <div className="jazz-kpi-group-config">
        <div className="menu">
        <ColumnMenu title={I18N.Setting.KPI.Group.Config} items={GroupKPIStore.getConfigMenu()}/>
        </div>
        <div className="content">
          {this.props.children}
        </div>
        </div>
      )
    }
    else {
      return(<div className="noContent flex-center">{I18N.Kpi.Error.KPINonMoreBuilding}</div>)
    }

  }
}
