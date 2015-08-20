import React from "react";
import { Route, DefaultRoute, RouteHandler, Link, Navigation, State } from 'react-router';
import {SvgIcon, IconButton, DropDownMenu, TextField, Dialog, FlatButton, Overlay,Snackbar} from 'material-ui';
import assign from "object-assign";
import Immutable from 'immutable';
import AlarmSetting from './AlarmSetting.jsx';
import BaselineModify from './BaselineModify.jsx';
import CommonFuns from '../../util/Util.jsx';
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
import CopyView from '../folder/operationView/CopyView.jsx';
import DeleteView from '../folder/operationView/DeleteView.jsx';
import ShareView from '../folder/operationView/ShareView.jsx';
import SendView from '../folder/operationView/SendView.jsx';
import SaveAsView from '../folder/operationView/SaveAsView.jsx';

let Setting = React.createClass({

  mixins:[Navigation,State],
  getInitialState: function() {
      return {
        showRightPanel: false,
        refreshChart: false,
        errorText:null,
        selectedNode:null,
        templateShow:false,
        templateNode:null,
        templateId:null,
        selectedEnergyType: null
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
  _onSelectedNodeChange:function(){
    let me = this;
    me.setState({
      refreshChart: true
    },()=>{me.setState({
                        refreshChart: false,
                        selectedEnergyType: null,
                        selectedNode:FolderStore.getSelectedNode()
                      });
          });
  },
  _onTemplateDismiss:function(){
    this.setState({
      templateShow:false
    });
  },
  _onTemplateSelect:function(nodeData,index){
    this.setState({
      templateNode:nodeData,
      templateId:index,
      templateShow:true
    });
},
 getTemplate:function(){
   var template;
   //for operation template
   if(this.state.templateNode){
     if(this.state.templateNode.get('Type')==6){
       switch(this.state.templateId) {
         case 1:
             template=<CopyView onDismiss={this._onTemplateDismiss} copyNode={this.state.templateNode}/>;
           break;
         case 2:
             template=<SendView onDismiss={this._onTemplateDismiss} sendNode={this.state.templateNode}/>;
           break;
         case 3:
             template=<DeleteView onDismiss={this._onTemplateDismiss} deleteNode={this.state.templateNode}/>;
           break;
     }
   }
     else {
       switch(this.state.templateId) {
         case 1:
             template=<CopyView onDismiss={this._onTemplateDismiss} copyNode={this.state.templateNode}/>;
           break;
         case 2:
             template=<SendView onDismiss={this._onTemplateDismiss} sendNode={this.state.templateNode}/>;
           break;
         case 3:
             template=<ShareView onDismiss={this._onTemplateDismiss} shareNode={this.state.templateNode}/>;
           break;
         case 4:
             template=<DeleteView onDismiss={this._onTemplateDismiss} deleteNode={this.state.templateNode}/>;
           break;
         case 5:
             template=<DeleteView onDismiss={this._onTemplateDismiss} deleteNode={this.state.templateNode}/>;
           break;
         case 6:
             template=<SaveAsView onDismiss={this._onTemplateDismiss} saveAsNode={this.state.templateNode}/>;
           break;
     }
   }
 }
 return template;
 },
_onWidgetMenuSelect:function(index){
  var id=(index==1)?6:index;
  this.setState({
    templateNode:this.state.selectedNode,
    templateId:id,
    templateShow:true
  });
},
  _onEnergyTypeChanged(energyType){
    this.setState({selectedEnergyType:energyType});
  },
  //just for test commoditypanel
componentWillMount:function(){
  CommodityAction.setEnergyConsumptionType('Cost');
},
componentDidMount:function(){
  FolderStore.addModifyNameSuccessListener(this._onModifyNameSuccess);
  FolderStore.addModifyNameErrorListener(this._onModifyNameError);
  FolderStore.addSendStatusListener(this._onSendStatusChange);
  FolderStore.addSelectedNodeListener(this._onSelectedNodeChange);
},
componentWillUnmount:function(){
  FolderStore.removeModifyNameSuccessListener(this._onModifyNameSuccess);
  FolderStore.removeModifyNameErrorListener(this._onModifyNameError);
  FolderStore.removeSendStatusListener(this._onSendStatusChange);
  FolderStore.removeSelectedNodeListener(this._onSelectedNodeChange);
},
render: function () {
    let me = this;
    let bizTypeMap = {1:'Energy',2:'Unit',3:'Ratio', 4:'Label', 5:'Rank'};
    let mainPanel, rightPanel=null;
    let selectedNode = this.state.selectedNode;

    if(!selectedNode || this.state.refreshChart){
      mainPanel = null;
    }else{
      let type = selectedNode.get('Type');
      if(type === 6){
        //forder
        mainPanel = (this.state.selectedNode?<FolderDetailPanel onToggle={this._onSwitchButtonClick}
                                                                nodeData={this.state.selectedNode}
                                                                onOperationSelect={this._onTemplateSelect}/>:null);
      }else if(type === 7){
        //chart panel
        let title = selectedNode.get('Name');
        let bizType = bizTypeMap[selectedNode.get('WidgetType')];
        let energyType = this.state.selectedEnergyType || CommonFuns.extractEnergyType( selectedNode.get('EnergyType') );
        rightPanel = this.getRightPanel(bizType, energyType);
        mainPanel =<AnalysisPanel chartTitle = {title} bizType={bizType} energyType={energyType} onEnergyTypeChange={me._onEnergyTypeChanged} onOperationSelect={this._onWidgetMenuSelect}></AnalysisPanel>;
      }
    }

    let operation=(this.state.templateShow?this.getTemplate():null);
    return (
      <div style={{display:'flex', flex:1}}>
        <LeftPanel isShow={!this.state.showRightPanel} onToggle={this._onSwitchButtonClick}/>
        {mainPanel}
        {rightPanel}
        {operation}
        <Snackbar ref='snackbar' message={this.state.errorText}/>
      </div>
    );
  },
  getRightPanel(bizType, energyType){
    let rightPanel = null;
    switch (bizType) {
      case 'Energy':
        if(!energyType || energyType === 'Energy'){
          rightPanel = <DataSelectPanel  defaultStatus={false} widgetType={bizType}></DataSelectPanel>;
        }else{

        }
        break;
      case 'Unit':
        if(!energyType || energyType === 'Energy'){
          rightPanel = <DataSelectPanel  defaultStatus={false}  widgetType={bizType}></DataSelectPanel>;
        }else{

        }
        break;
      case 'Ratio':
        //return Ratio rightPanel
        break;
      case 'Label':
        rightPanel = <DataSelectPanel defaultStatus={false} widgetType={bizType}></DataSelectPanel>;
        break;
      case 'Rank':
        //return Rank rightPanel
        rightPanel = <RightPanel onButtonClick={this._onSwitchButtonClick}
                      defaultStatus={this.state.showRightPanel}
                      container={<RankingContainer ecType={energyType || 'Energy'}/>}/>;

        break;
    }
    return rightPanel;
  }
});

module.exports = Setting;
