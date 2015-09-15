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

import DataSelectMainPanel from '../DataSelectMainPanel.jsx';
//import ChartPanel from '../alarm/ChartPanel.jsx';
import AnalysisPanel from '../energy/AnalysisPanel.jsx';
import ChartAction from '../../actions/ChartAction.jsx';
import FolderAction from '../../actions/FolderAction.jsx';
//for test commoditypanel
import CommodityAction from '../../actions/CommodityAction.jsx';
import CommodityStore from '../../stores/CommodityStore.jsx';

import LeftPanel from '../folder/FolderLeftPanel.jsx';
import FolderStore from '../../stores/FolderStore.jsx';
import WidgetStore from '../../stores/energy/WidgetStore.jsx';
import FolderDetailPanel from '../folder/FolderDetailPanel.jsx';
import CopyView from '../folder/operationView/CopyView.jsx';
import DeleteView from '../folder/operationView/DeleteView.jsx';
import ShareView from '../folder/operationView/ShareView.jsx';
import SendView from '../folder/operationView/SendView.jsx';
import SaveAsView from '../folder/operationView/SaveAsView.jsx';
import ExportChartAction from '../../actions/ExportChartAction.jsx';

let lastEnergyType=null;

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
  _onExportWidgetSuccess:function(){
    this.setState({
      errorText:null
    });
  },
  _onExportWidgetError:function(){
    this.setState({
      errorText:I18N.Folder.Export.Error
    });
    this.refs.snackbar.show();
  },
  _onMoveItemSuccess:function(){
    this.setState({
      errorText:null
    });
  },
  _onMoveItemError:function(){
    this.setState({
      errorText:FolderStore.getMoveItemError()
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
    },()=>{
        let selectedNode = FolderStore.getSelectedNode();
        let type = selectedNode.get('Type');
        if(type === 7){
          FolderAction.GetWidgetDtos([selectedNode.get('Id')], selectedNode);
        }else{
          me.setState({
                        refreshChart: false,
                        selectedEnergyType: null,
                        selectedNode: selectedNode
                      });
        }});
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
_onCreateFolderOrWidget:function(){
  var node=CommodityStore.getDefaultNode();
  var newNode=FolderStore.getNewNode();
  if(node){
      CommodityAction.setCurrentHierarchyInfo(node.Id,node.Name);
  }

    if(newNode.WidgetType==5){
      CommodityStore.clearRankingTreeList();
    }


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
             template=<DeleteView onDismiss={this._onTemplateDismiss} deleteNode={this.state.templateNode} isLoadByWidget={false}/>;
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
            let path = '/Dashboard.svc/ExportWidget';
            let params= {
                        widgetId:this.state.templateNode.get('Id')
                      }
            ExportChartAction.getTagsData4Export(params,path);
           break;
         case 5:
             template=<DeleteView onDismiss={this._onTemplateDismiss} deleteNode={this.state.templateNode} isLoadByWidget={false}/>;
           break;
         case 6:
             template=<SaveAsView onDismiss={this._onTemplateDismiss} saveAsNode={this.state.templateNode}/>;
           break;
        case 7:
             template=<DeleteView onDismiss={this._onTemplateDismiss} deleteNode={this.state.templateNode} isLoadByWidget={true}/>;
            break;
     }
   }
 }
 return template;
 },
_onWidgetMenuSelect:function(index){
  var id=index;
  if(index==1){
    id=6
  }
  else {
    if(index==5){
      id=7
    }
  };
  this.setState({
    templateNode:this.state.selectedNode,
    templateId:id,
    templateShow:true
  });
},
  _onEnergyTypeChanged(energyType){
    this.setState({selectedEnergyType:energyType});

    let me = this;
    me.setState({
      refreshChart: true
    },()=>{me.setState({
                        refreshChart: false,
                        selectedEnergyType: energyType
                      });
          });
  },


componentWillMount:function(){
  // CommodityAction.setEnergyConsumptionType('Carbon');
  lastEnergyType=null;
},
componentDidMount:function(){
  FolderStore.addModifyNameSuccessListener(this._onModifyNameSuccess);
  FolderStore.addModifyNameErrorListener(this._onModifyNameError);
  FolderStore.addSendStatusListener(this._onSendStatusChange);
  FolderStore.addCreateFolderOrWidgetListener(this._onCreateFolderOrWidget);
  FolderStore.addSelectedNodeListener(this._onSelectedNodeChange);
  FolderStore.addMoveItemSuccessListener(this._onMoveItemSuccess);
  FolderStore.addMoveItemErrorListener(this._onMoveItemError);
  FolderStore.addExportWidgetErrorListener(this._onExportWidgetError);
  FolderStore.addExportWidgetSuccessListener(this._onExportWidgetSuccess);
  WidgetStore.addChangeListener(this._handleWidgetSelectChange);
},
componentWillUnmount:function(){
  FolderStore.removeModifyNameSuccessListener(this._onModifyNameSuccess);
  FolderStore.removeModifyNameErrorListener(this._onModifyNameError);
  FolderStore.removeSendStatusListener(this._onSendStatusChange);
  FolderStore.removeCreateFolderOrWidgetListener(this._onCreateFolderOrWidget);
  FolderStore.removeSelectedNodeListener(this._onSelectedNodeChange);
  FolderStore.removeMoveItemSuccessListener(this._onMoveItemSuccess);
  FolderStore.removeMoveItemErrorListener(this._onMoveItemError);
  FolderStore.removeExportWidgetErrorListener(this._onExportWidgetError);
  FolderStore.removeExportWidgetSuccessListener(this._onExportWidgetSuccess);
  WidgetStore.removeChangeListener(this._handleWidgetSelectChange);
},
_handleWidgetSelectChange(){
  let widgetDto = WidgetStore.getWidgetDto();
  this.setState({
                  refreshChart: false,
                  selectedEnergyType: null,
                  selectedNode: WidgetStore.getSelectedNode(),
                  widgetDto: widgetDto
                });
},
getEnergyTypeFromWidgetDto(widgetDto){
  let energyType = null;
  if(widgetDto && widgetDto.BizType){
    let map = { Energy:'Energy',Carbon:'Carbon', Cost:'Cost', Ratio:null, Labelling:null,
                UnitEnergy:'Energy', UnitCarbon:'Carbon', UnitCost:'Cost',
                RankingEnergy:'Energy', RankingCost:'Cost', RankCarbon:'Carbon', CostElectric:'Cost'};
    let bizType = widgetDto.BizType;
    energyType = map[bizType];
  }
  return energyType;
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
        let widgetDto = me.state.widgetDto;
        let title = selectedNode.get('Name');
        let bizType = bizTypeMap[selectedNode.get('WidgetType')];
        let energyType = this.state.selectedEnergyType || this.getEnergyTypeFromWidgetDto(widgetDto);
        rightPanel = this.getRightPanel(bizType, energyType);

        let mainPanelProps = {
          chartTitle:title,
          bizType: bizType,
          energyType: energyType,
          widgetDto: widgetDto,
          onEnergyTypeChange: me._onEnergyTypeChanged,
          onOperationSelect: me._onWidgetMenuSelect
        };
        let widgetInitState = WidgetStore.getInitState();
        if(widgetInitState){
          mainPanelProps.widgetInitState = true;
        }
        mainPanel =<AnalysisPanel {...mainPanelProps}></AnalysisPanel>;
      }
    }

    let operation=(this.state.templateShow?this.getTemplate():null);
    let leftPanel=(!this.state.showRightPanel)?<div style={{display:'flex'}}><LeftPanel/></div>:<div style={{display:'none'}}><LeftPanel/></div>;
    return (
      <div style={{display:'flex', flex:1}}>
        {leftPanel}
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
          rightPanel = <RightPanel onButtonClick={this._onSwitchButtonClick}
                                    defaultStatus={this.state.showRightPanel}
                                    container={<DataSelectMainPanel widgetType={bizType}></DataSelectMainPanel>}/>;
        }else{
          rightPanel = <RightPanel onButtonClick={this._onSwitchButtonClick}
                                    defaultStatus={this.state.showRightPanel}
                                    container={<CommodityContainer ecType={energyType}></CommodityContainer>}/>;
        }
        break;
      case 'Unit':
        if(!energyType || energyType === 'Energy'){
          rightPanel =  <RightPanel onButtonClick={this._onSwitchButtonClick}
                                    defaultStatus={this.state.showRightPanel}
                                    container={<DataSelectMainPanel widgetType={bizType}></DataSelectMainPanel>}/>;
        }else{
          rightPanel = <RightPanel onButtonClick={this._onSwitchButtonClick}
                                    defaultStatus={this.state.showRightPanel}
                                    container={<CommodityContainer ecType={energyType}></CommodityContainer>}/>;
        }
        break;
      case 'Ratio':
        rightPanel = <RightPanel onButtonClick={this._onSwitchButtonClick}
                                  defaultStatus={this.state.showRightPanel}
                                  container={<DataSelectMainPanel widgetType={bizType}></DataSelectMainPanel>}/>;
        break;
      case 'Label':
        rightPanel = <RightPanel onButtonClick={this._onSwitchButtonClick}
                                  defaultStatus={this.state.showRightPanel}
                                  container={<DataSelectMainPanel widgetType={bizType}></DataSelectMainPanel>}/>;
        break;
      case 'Rank':
        //return Rank rightPanel
        rightPanel = <RightPanel onButtonClick={this._onSwitchButtonClick}
                      defaultStatus={this.state.showRightPanel}
                      container={<RankingContainer ecType={energyType || 'Energy'}/>}/>;

        break;
    }
    if(bizType=='Rank'){
        if(lastEnergyType!==null && lastEnergyType!=energyType){
          CommodityStore.clearRankingCommodity()
        }
        else {
          lastEnergyType=energyType
        }
      }
      else {
        lastEnergyType=null
      }
    return rightPanel;
  }
});

module.exports = Setting;
