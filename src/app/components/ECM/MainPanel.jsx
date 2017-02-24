import React, { Component } from 'react';
import classnames from "classnames";
import CurrentUserStore from 'stores/CurrentUserStore.jsx';
import privilegeUtil from 'util/privilegeUtil.jsx';
import NotPushPanel from './NotPushPanel.jsx';
import PushPanel from './PushPanel.jsx';

function privilegeWithPushAndNotPush( privilegeCheck ) {
  return true
	//return privilegeCheck(PermissionCode.PUSH_AND_NOTPUSH, CurrentUserStore.getCurrentPrivilege());
}

function isFull() {
	return privilegeWithPushAndNotPush(privilegeUtil.isFull.bind(privilegeUtil));
}


export default class MainPanel extends Component {
  constructor(props) {
    super(props);
    this._handlerSwitchTab=this._handlerSwitchTab.bind(this);
  }

  state={
    infoTabNo:isFull()?1:2
  }

  _handlerSwitchTab(event) {
    let no = parseInt(event.target.getAttribute("data-tab-index"));
    this.setState({
      infoTabNo: no
    });

  }

  _renderTabs(){
    return(
      <div className="jazz-ecm-tabs">
        <span className={classnames({
              "jazz-ecm-tabs-tab": true,
              "selected": this.state.infoTabNo === 1
            })} data-tab-index="1" onClick={this._handlerSwitchTab}>{I18N.Setting.ECM.NotPush}</span>
        <span className={classnames({
                "jazz-ecm-tabs-tab": true,
                "selected": this.state.infoTabNo === 2
              })} data-tab-index="2" onClick={this._handlerSwitchTab}>{I18N.Setting.ECM.AlreadyPush}</span>
      </div>
    )
  }

  _renderContent(){
    if(this.state.infoTabNo === 1){
      return <NotPushPanel/>
    }
    else {
      return <PushPanel/>
    }
  }

  render(){

    return(
      <div className="jazz-ecm-mainpanel">
        <div className="jazz-ecm-mainpanel-content">
          {isFull() && this._renderTabs()}
          {this._renderContent()}
        </div>
      </div>
    )
  }
}

MainPanel.propTypes = {
};
