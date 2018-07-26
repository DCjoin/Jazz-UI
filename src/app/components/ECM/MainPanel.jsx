import React, { Component } from 'react';
import classnames from "classnames";
import ReactDom from 'react-dom';
import CurrentUserStore from 'stores/CurrentUserStore.jsx';
import privilegeUtil from 'util/privilegeUtil.jsx';
import NotPushPanel from './NotPushPanel.jsx';
import PushPanel from './PushPanel.jsx';
import PermissionCode from 'constants/PermissionCode.jsx';
import BubbleIcon from '../BubbleIcon.jsx';
import MeasuresAction from 'actions/ECM/MeasuresAction.jsx';
import {Status} from 'constants/actionType/Measures.jsx';

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
import PropTypes from 'prop-types';
export default class MainPanel extends Component {

  static contextTypes = {
      hierarchyId: PropTypes.string
    };

  constructor(props, ctx) {
    super(props);
    this._handlerSwitchTab=this._handlerSwitchTab.bind(this);
    this._onUnReadChanged=this._onUnReadChanged.bind(this);

  }

  state={
    infoTabNo:isFull()?1:2,
    unRead:false
  }

  _onUnReadChanged(){
    this.setState({
      unRead:CurrentUserStore.getEcmBubble()
    })
  }

  componentWillReceiveProps(nextProps, nextCtx) {
    if( this.context.hierarchyId && this.context.hierarchyId !== nextCtx.hierarchyId && nextCtx.hierarchyId === nextProps.params.customerId * 1 ) {
      this.getUnreadFlag();
      nextProps.router.push(
        getFirstMenuPathFunc(CurrentUserStore.getMainMenuItems())(nextProps.params)
      )
    }
  }

  _handlerSwitchTab(no) {
    this.setState({
      infoTabNo: no
    });
  }

  _renderAlreadyPushTitle(){
    return (
      <div className="jazz-ecm-tab-title">
        {I18N.Setting.ECM.AlreadyPush}
        {true?<BubbleIcon style={{width:'6px',height:'6px',marginLeft:'1px',marginTop:'-7px'}}/>:null}
      </div>
    )

  }

  _renderTabs(){
    return(
      <div className="jazz-ecm-tabs">
        <span className={classnames({
              "selected": this.state.infoTabNo === 1
            })} data-tab-index="1" onClick={this._handlerSwitchTab.bind(this,1)}>{I18N.Setting.ECM.NotPush}</span>
        <span className={classnames({
                "selected": this.state.infoTabNo === 2
              })} data-tab-index="2" ref='push' onClick={this._handlerSwitchTab.bind(this,2)}>{this._renderAlreadyPushTitle()}</span>
      </div>
    )
  }

  _renderContent(){
    if(this.state.infoTabNo === 1){
      var btn=ReactDom.findDOMNode(this.refs.push),destX,destY;
      if(btn){
        destX=btn.getBoundingClientRect().left+50,
        destY=btn.getBoundingClientRect().top;
      }
      return <NotPushPanel hierarchyId={this.context.hierarchyId} generatePositon={{destX,destY}}/>
    }
    else {
      return <PushPanel hierarchyId={this.context.hierarchyId} params={this.props.params}/>
    }
  }

  getUnreadFlag(){
    var statusArr=[];
    if(isFull()){
      statusArr=[Status.Being]
    }else {
      statusArr=[Status.ToBe,Status.Done]
    }
      MeasuresAction.getContainsunread(this.context.hierarchyId,statusArr);
  }

  componentDidMount(){
    CurrentUserStore.addCurrentUserListener(this._onUnReadChanged);
    this.getUnreadFlag();
  }

  componentWillUnmount(){
    CurrentUserStore.removeCurrentUserListener(this._onUnReadChanged);
  }

  render(){
    return(
      <div className="jazz-ecm-mainpanel">
        {isFull() && this._renderTabs()}
        <div className="jazz-ecm-mainpanel-content">
          {this.context.hierarchyId && this.context.hierarchyId!==this.props.params.customerId*1 && this._renderContent()}
        </div>
      </div>
    )
  }
}

MainPanel.propTypes= {
};
