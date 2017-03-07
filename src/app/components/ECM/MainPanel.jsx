import React, { Component } from 'react';
import classnames from "classnames";
import CurrentUserStore from 'stores/CurrentUserStore.jsx';
import privilegeUtil from 'util/privilegeUtil.jsx';
import NotPushPanel from './NotPushPanel.jsx';
import PushPanel from './PushPanel.jsx';
import PermissionCode from 'constants/PermissionCode.jsx';

function getFirstMenuPathFunc(menu) {
  let firstMenu = menu[0];
  if( !firstMenu ) {
    return function() {
      console.err('No has any menu');
    }
  }
  if(firstMenu.children && firstMenu.children.length > 0) {
    let firstChild = firstMenu.children[0];
    if(firstChild.list && firstChild.list.length > 0) {
      return firstChild.list[0].getPath;
    }
  }
  return  firstMenu.getPath;
}


function privilegeWithPushAndNotPush( privilegeCheck ) {
  // return true
	return privilegeCheck(PermissionCode.SOLUTION_FULL, CurrentUserStore.getCurrentPrivilege());
}

function isFull() {
	return privilegeWithPushAndNotPush(privilegeUtil.isFull.bind(privilegeUtil));
}


export default class MainPanel extends Component {

  static contextTypes = {
      hierarchyId: React.PropTypes.string
    };

  constructor(props, ctx) {
    super(props);
    this._handlerSwitchTab=this._handlerSwitchTab.bind(this);
  }

  state={
    infoTabNo:isFull()?1:2
  }

  componentWillReceiveProps(nextProps, nextCtx) {
    if( this.context.hierarchyId && nextCtx.hierarchyId === nextProps.params.customerId * 1 ) {
      nextProps.router.push(
        getFirstMenuPathFunc(CurrentUserStore.getMainMenuItems())(nextProps.params)
      )
    }
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
      return <NotPushPanel hierarchyId={this.context.hierarchyId}/>
    }
    else {
      return <PushPanel hierarchyId={this.context.hierarchyId}/>
    }
  }

  render(){
    return(
      <div className="jazz-ecm-mainpanel">
        <div className="jazz-ecm-mainpanel-content">
          {isFull() && this._renderTabs()}
          {this.context.hierarchyId && this.context.hierarchyId!==this.props.params.customerId*1 && this._renderContent()}
        </div>
      </div>
    )
  }
}

MainPanel.propTypes = {
};
