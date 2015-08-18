import React from "react";
import { Route, DefaultRoute, RouteHandler, Link, Navigation, State } from 'react-router';
import {SvgIcon, IconButton, DropDownMenu, TextField, Dialog, FlatButton, Overlay,Snackbar} from 'material-ui';
import assign from "object-assign";
import Immutable from 'immutable';
import AlarmSetting from './AlarmSetting.jsx';
import BaselineModify from './BaselineModify.jsx';

import CommodityContainer from '../commodity/CommonCommodityPanel.jsx';
import RankingContainer from '../commodity/ranking/RankingCommodityPanel.jsx';
import RightPanel from '../../controls/RightPanel.jsx';

import DataSelectPanel from '../DataSelectPanel.jsx';
//import ChartPanel from '../alarm/ChartPanel.jsx';
import AnalysisPanel from '../energy/AnalysisPanel.jsx';
import ChartAction from '../../actions/ChartAction.jsx';
//for test commoditypanel
import CommodityAction from '../../actions/CommodityAction.jsx';

import LeftPanel from '../folder/FolderLeftPanel.jsx';
import FolderStore from '../../stores/FolderStore.jsx';
import FolderDetailPanel from '../folder/FolderDetailPanel.jsx';

let Setting = React.createClass({

  mixins:[Navigation,State],
  getInitialState: function() {
      return {
        showRightPanel: false,
        refreshChart: false,
        errorText:null,
        selectedNode:null
      };
  },
  _onSwitchButtonClick(){
    this.setState({
      showRightPanel:!this.state.showRightPanel
    }, ChartAction.redrawChart);
  },
  _onModifyNameSuccess:function(){
    this.setState({
      errorText:null
    });
  },
  _onModifyNameError:function(){
    this.setState({
      errorText:FolderStore.GetModifyNameError()
    });
    this.refs.snackbar.show();
  },
  _onSendStatusChange:function(){
    this.setState({
      errorText:FolderStore.getSendStatus()
    });
    this.refs.snackbar.show();
  },
  _onSelectedNodehange:function(){
    let me = this;
    me.setState({
      refreshChart: true
    },()=>{me.setState({
                        refreshChart: false,
                        selectedNode:FolderStore.getSelectedNode()
                      });
          });
  },
  //just for test commoditypanel
componentWillMount:function(){
  CommodityAction.setEnergyConsumptionType('Cost');
},
componentDidMount:function(){
  FolderStore.addModifyNameSuccessListener(this._onModifyNameSuccess);
  FolderStore.addModifyNameErrorListener(this._onModifyNameError);
  FolderStore.addSendStatusListener(this._onSendStatusChange);
  FolderStore.addSelectedNodeListener(this._onSelectedNodehange);
},
componentWillUnmount:function(){
  FolderStore.removeModifyNameSuccessListener(this._onModifyNameSuccess);
  FolderStore.removeModifyNameErrorListener(this._onModifyNameError);
  FolderStore.removeSendStatusListener(this._onSendStatusChange);
  FolderStore.removeSelectedNodeListener(this._onSelectedNodeChange);
},
  render: function () {

    // var commoditypanel=(<RightPanel onButtonClick={this._onSwitchButtonClick}
    //                                defaultStatus={this.state.showRightPanel}
    //                                container={<CommodityContainer/>}/>);
    // var checkedCommodity={
    //   commodityId:-1,
    //   commodityName:'介质总览'
    // };
  //如果checkedTreeNodes为一个普通数组，转换成immutable
    // var checkedTreeNodes=Immutable.fromJS([
    // {Id:100008,
    // Name:"园区B"},
    // {Id:100006,
    // Name:"组织B"}
    // ]);
    //如果checkedTreeNodes为一个普通数组，转换成immutable

    // var RankingPanel=(<RightPanel onButtonClick={this._onSwitchButtonClick}
    //                                defaultStatus={this.state.showRightPanel}
    //                                container={<RankingContainer checkedCommodity={checkedCommodity} checkedTreeNodes={checkedTreeNodes}/>}/>);

    //var errorBar=(this.state.errorText!=null?<Snackbar message={this.state.errorText}/>:null);
    //  <ChartPanel chartTitle='能效分析' isSettingChart={true}></ChartPanel>
    let energyTypeMap = {1:'Energy',2:'Unit',3:'Ratio', 4:'Label', 5:'Rank'};
    let mainPanel, rightPanel;
    let selectedNode = this.state.selectedNode;

    if(!selectedNode || this.state.refreshChart){
      mainPanel = null;
    }else{
      let type = selectedNode.get('Type');
      let energyType = selectedNode.get('WidgetType');
      if(type === 6){
        //forder
        mainPanel = (this.state.selectedNode?<FolderDetailPanel onToggle={this._onSwitchButtonClick} nodeData={this.state.selectedNode}/>:null);
      }else if(type === 7){
        //chart panel
        let title = selectedNode.get('Name');
        let bizType = energyTypeMap[selectedNode.get('WidgetType')];
        mainPanel =<AnalysisPanel chartTitle = {title} bizType={bizType}></AnalysisPanel>;
      }
    }
    return (
      <div style={{display:'flex', flex:1}}>
        <LeftPanel isShow={!this.state.showRightPanel} onToggle={this._onSwitchButtonClick}/>
        {mainPanel}
        <Snackbar ref='snackbar' message={this.state.errorText}/>
      </div>
    );
  }
});

module.exports = Setting;
