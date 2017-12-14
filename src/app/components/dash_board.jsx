import React, { Component } from 'react';

import PermissionCode from 'constants/PermissionCode.jsx';
import privilegeUtil from 'util/privilegeUtil.jsx';
import CurrentUserStore from 'stores/CurrentUserStore.jsx';
import LoginStore from 'stores/LoginStore.jsx';

export default class Dashboard extends Component {
  render() {
    let protocol = document.location.protocol,
    sp = document.location.hostname.split('.')[0],
    isFull = privilegeUtil.isFull( PermissionCode.DASH_BOARD, CurrentUserStore.getCurrentPrivilege() ),
    customerId = this.props.router.params.customerId,
    userId = CurrentUserStore.getCurrentUser().Id;
    return (
      <iframe src={`__POLKA_WEB_HOST__/board?customerId=${customerId}&LoginUserId=${userId}&AuthLoginToken=${LoginStore.getAuthLoginToken()}`} frameborder="0" height={'100%'} width={'100%'} style={{border: 0}}></iframe>
    );
    // return (
    //   <iframe src={`${protocol}//${sp}.de.energymost.com/panel?userId=${userId}&customerId=${customerId}&isFull=${isFull}`} frameborder="0" height={'100%'} style={{border: 0}}></iframe>
    // );
  }
}
