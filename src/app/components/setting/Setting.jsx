import React from "react";
import { Route, DefaultRoute, RouteHandler, Link, Navigation, State } from 'react-router';
import { SvgIcon, IconButton, DropDownMenu, TextField, FlatButton, Overlay, Snackbar } from 'material-ui';
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
import TagStore from '../../stores/TagStore.jsx';


import LeftPanel from '../folder/FolderLeftPanel.jsx';
import FolderStore from '../../stores/FolderStore.jsx';
import WidgetStore from '../../stores/energy/WidgetStore.jsx';
import FolderDetailPanel from '../folder/FolderDetailPanel.jsx';
import CopyView from '../folder/operationView/CopyView.jsx';
import DeleteView from '../folder/operationView/DeleteView.jsx';
import ShareView from '../folder/operationView/ShareView.jsx';
import SendView from '../folder/operationView/SendView.jsx';
import SaveAsView from '../folder/operationView/SaveAsView.jsx';
import ExportView from '../folder/operationView/ExportView.jsx';
import ExportChartAction from '../../actions/ExportChartAction.jsx';
import ChartStatusAction from '../../actions/ChartStatusAction.jsx';
import ExportChartStore from '../../stores/energy/ExportChartStore.jsx';
import OrigamiPanel from '../../controls/OrigamiPanel.jsx';
import Dialog from '../../controls/OperationTemplate/BlankDialog.jsx';


let lastEnergyType = null;
let lastBizType = null;
let nextEnergyType = null;
let isDelete = false;
const DIALOG_TYPE = {
  SWITCH_WIDGET: "switchwidget",
  SWITCH_EC: 'switchec',
  ERROR_NOTICE: 'errornotice'
};


let Setting = React.createClass({

  mixins: [Navigation, State],
  getInitialState: function() {
    return {
      showRightPanel: false,
      showLeftPanel: true,
      refreshChart: false,
      errorText: '',
      selectedNode: null,
      templateShow: false,
      templateNode: null,
      templateId: null,
      templateWidgetDto: null,
      selectedEnergyType: null,
      dialogType: null,
    };
  },
  _onLeftSwitchButtonClick() {
    var leftShow, rightShow;
    leftShow = !this.state.showLeftPanel;
    if (this.state.showLeftPanel) {
      rightShow = this.state.showRightPanel;
    } else {
      if (this.state.showRightPanel) {
        rightShow = false;
      } else {
        rightShow = this.state.showRightPanel;
      }
    }
    this.setState({
      showLeftPanel: leftShow,
      showRightPanel: rightShow
    }, ChartAction.redrawChart);
  },
  _onRightSwitchButtonClick() {
    var leftShow, rightShow;
    rightShow = !this.state.showRightPanel;
    if (this.state.showRightPanel) {
      leftShow = this.state.showLeftPanel;
    } else {
      if (this.state.showLeftPanel) {
        leftShow = false;
      } else {
        leftShow = this.state.showLeftPanel;
      }
    }
    this.setState({
      showLeftPanel: leftShow,
      showRightPanel: rightShow
    }, ChartAction.redrawChart);
  },
  _onModifyNameSuccess: function() {
    this.setState({
      errorText: null
    });
  },
  _onModifyNameError: function() {
    this.setState({
      errorText: FolderStore.GetModifyNameError()
    });
    this.refs.snackbar.show();
  },
  _onWidgetSaveError: function() {
    this.setState({
      errorText: I18N.ALarm.Save.Error
    });
    this.refs.snackbar.show();
  },
  _onWidgetSaveSuccess: function() {
    this.setState({
      errorText: null
    });
  },
  // _onExportWidgetSuccess: function() {
  //   this.setState({
  //     errorText: null,
  //     templateShow: false
  //   });
  // },
  // _onExportWidgetError: function() {
  //   this.setState({
  //     errorText: I18N.Folder.Export.Error
  //   });
  //   this.refs.snackbar.show();
  // },
  _onMoveItemSuccess: function() {
    this.setState({
      errorText: null
    });
  },
  _onMoveItemError: function() {
    this.setState({
      errorText: FolderStore.getMoveItemError()
    });
    this.refs.snackbar.show();
  },
  _onSendStatusChange: function() {
    this.setState({
      errorText: FolderStore.getSendStatus()
    });
    this.refs.snackbar.show();
  },
  _onShareStatusChange: function() {
    this.setState({
      errorText: FolderStore.getShareStatus()
    });
    this.refs.snackbar.show();
  },
  _onSelectedNodeChange: function() {
    let me = this;
    me.setState({
      refreshChart: true
    }, () => {
      let selectedNode = FolderStore.getSelectedNode();
      let type = selectedNode.get('Type');
      if (type === 7) {
        FolderAction.GetWidgetDtos([selectedNode.get('Id')], selectedNode);
      } else {
        me.setState({
          refreshChart: false,
          selectedEnergyType: null,
          selectedNode: selectedNode
        });
      }
      // if (!!this.state.templateNode) {
      //   if (selectedNode.get('Id') == this.state.templateNode.get('Id')) {
      //     this.setState({
      //       templateNode: selectedNode
      //     });
      //   }
      // }

    });
    lastEnergyType = null;
    lastBizType = null;
  },
  _onFolderTreeChanged: function() {
    let selectedNode = FolderStore.getSelectedNode();
    if (selectedNode != this.state.selectedNode) {
      this.setState({
        selectedNode: selectedNode
      });
    }
    if (!!this.state.templateNode) {
      if (selectedNode.get('Id') == this.state.templateNode.get('Id')) {
        this.setState({
          templateNode: selectedNode
        });
      }
    }
  },
  _onTemplateDismiss: function() {
    this.setState({
      templateShow: false
    });
  },
  _onTemplateSelect: function(nodeData, index, flag) {
    if (!!flag) {
      isDelete = flag;
    } else {
      isDelete = false;
    }
    this.setState({
      templateNode: nodeData,
      templateId: index,
      templateShow: true
    });
  },
  _onCreateFolderOrWidget: function() {
    // var node = CommodityStore.getDefaultNode();
    var newNode = FolderStore.getNewNode();
    // if (node) {
    //   CommodityAction.setCurrentHierarchyInfo(node.Id, node.Name);
    // }

    if (newNode.WidgetType == 5) {
      CommodityStore.clearRankingTreeList();
    }


  },
  getTemplate: function() {
    var template;
    var me = this;
    //for operation template
    if (this.state.templateNode) {
      if (this.state.templateNode.get('Type') == 6) {
        switch (this.state.templateId) {
          case 1:
            template = <CopyView onDismiss={this._onTemplateDismiss} copyNode={this.state.templateNode}/>;
            break;
          case 2:
            template = <SendView onDismiss={this._onTemplateDismiss} sendNode={this.state.templateNode}/>;
            break;
          case 3:
            template = <DeleteView onDismiss={this._onTemplateDismiss} deleteNode={this.state.templateNode} isLoadByWidget={isDelete}/>;
            break;
        }
      } else {
        switch (this.state.templateId) {
          case 1:
            template = <CopyView onDismiss={this._onTemplateDismiss} copyNode={this.state.templateNode}/>;
            break;
          case 2:
            template = <SendView onDismiss={this._onTemplateDismiss} sendNode={this.state.templateNode}/>;
            break;
          case 3:
            template = <ShareView onDismiss={this._onTemplateDismiss} shareNode={this.state.templateNode}/>;
            break;
          case 4:
            let path = '/Dashboard.svc/ExportWidget';
            let params = {
              widgetId: this.state.templateNode.get('Id')
            };
            template = <ExportView onDismiss={this._onTemplateDismiss} params={params} path={path}/>;
            //ExportChartAction.getTagsData4Export(params, path);

            break;
          case 5:
            template = <DeleteView onDismiss={this._onTemplateDismiss} deleteNode={this.state.templateNode} isLoadByWidget={false}/>;
            break;
          case 6:
            template = <SaveAsView onDismiss={this._onTemplateDismiss} saveAsNode={this.state.templateNode} widgetDto={this.state.templateWidgetDto}/>;
            break;
          case 7:
            template = <DeleteView onDismiss={this._onTemplateDismiss} deleteNode={this.state.templateNode} isLoadByWidget={true}/>;
            break;
        }
      }
    }
    return template;
  },
  _onWidgetMenuSelect: function(index, widgetDto) {
    var id = index;
    if (index == 1) {
      id = 6;
      this.setState({
        templateWidgetDto: widgetDto
      });
    } else {
      if (index == 5) {
        id = 7;
      }
    }
    this.setState({
      templateNode: this.state.selectedNode,
      templateId: id,
      templateShow: true
    });
  },
  _onEnergyTypeChanged(energyType) {
    var that = this;
    var widgetDto = that.state.widgetDto;
    widgetDto.Comment = '';
    widgetDto.WidgetSeriesArray = [];
    ChartStatusAction.clearStatus();
    that.setState({
      selectedEnergyType: energyType
    });

    that.setState({
      refreshChart: true
    }, () => {
      that.setState({
        refreshChart: false,
        selectedEnergyType: energyType,
        widgetDto: widgetDto
      });
    });
    // if (energyType != this.state.selectedEnergyType) {
    //   nextEnergyType = energyType;
    //   this.setState({
    //     dialogType: DIALOG_TYPE.SWITCH_EC
    //   })
    // }


  },
  _onDialogChanged: function() {
    this.setState({
      dialogType: FolderStore.getDisplayDialog().type,
    });
  },
  componentDidUpdate: function() {
    if (window.lastLanguage != window.currentLanguage) {
      document.title = I18N.Title.Energy;
      window.lastLanguage = window.currentLanguage;
    }
  },
  componentWillMount: function() {
    // CommodityAction.setEnergyConsumptionType('Carbon');
    lastEnergyType = null;
    lastBizType = null;
    document.title = I18N.Title.Energy;
  },
  componentDidMount: function() {
    FolderStore.addModifyNameSuccessListener(this._onModifyNameSuccess);
    FolderStore.addModifyNameErrorListener(this._onModifyNameError);
    FolderStore.addSendStatusListener(this._onSendStatusChange);
    FolderStore.addShareStatusListener(this._onShareStatusChange);
    FolderStore.addCreateFolderOrWidgetListener(this._onCreateFolderOrWidget);
    FolderStore.addSelectedNodeListener(this._onSelectedNodeChange);
    FolderStore.addMoveItemSuccessListener(this._onMoveItemSuccess);
    FolderStore.addMoveItemErrorListener(this._onMoveItemError);
    WidgetStore.addChangeListener(this._handleWidgetSelectChange);
    FolderStore.addWidgetSaveErrorListener(this._onWidgetSaveError);
    FolderStore.addWidgetSaveSuccessListener(this._onWidgetSaveSuccess);
    FolderStore.addFolderTreeListener(this._onFolderTreeChanged);
    FolderStore.addDialogListener(this._onDialogChanged);
  },
  componentWillUnmount: function() {
    FolderStore.removeModifyNameSuccessListener(this._onModifyNameSuccess);
    FolderStore.removeModifyNameErrorListener(this._onModifyNameError);
    FolderStore.removeSendStatusListener(this._onSendStatusChange);
    FolderStore.removeCreateFolderOrWidgetListener(this._onCreateFolderOrWidget);
    FolderStore.removeSelectedNodeListener(this._onSelectedNodeChange);
    FolderStore.removeMoveItemSuccessListener(this._onMoveItemSuccess);
    FolderStore.removeMoveItemErrorListener(this._onMoveItemError);
    WidgetStore.removeChangeListener(this._handleWidgetSelectChange);
    FolderStore.removeWidgetSaveErrorListener(this._onWidgetSaveError);
    FolderStore.removeWidgetSaveSuccessListener(this._onWidgetSaveSuccess);
    FolderStore.removeFolderTreeListener(this._onFolderTreeChanged);
    FolderStore.removeDialogListener(this._onDialogChanged);
    this.setState({
      errorText: null
    });
    this.refs.snackbar.dismiss();
  },
  _handleWidgetSelectChange() {
    let widgetDto = WidgetStore.getWidgetDto();
    this.setState({
      refreshChart: false,
      selectedEnergyType: null,
      selectedNode: WidgetStore.getSelectedNode(),
      widgetDto: widgetDto
    });
  },
  getEnergyTypeFromWidgetDto(widgetDto) {
    let energyType = null;
    if (widgetDto && widgetDto.BizType) {
      let map = {
        Energy: 'Energy',
        Carbon: 'Carbon',
        Cost: 'Cost',
        Ratio: null,
        Labelling: null,
        UnitEnergy: 'Energy',
        UnitCarbon: 'Carbon',
        UnitCost: 'Cost',
        RankingEnergy: 'Energy',
        RankingCost: 'Cost',
        RankCarbon: 'Carbon',
        CostElectric: 'Cost'
      };
      let bizType = widgetDto.BizType;
      energyType = map[bizType];
    }
    return energyType;
  },

  _getSwitchWidgetDialog: function() {
    var that = this;
    var _onConfirm = function() {
      FolderAction.swtichWidget();
    };
    var _onCancel = function() {
      that.setState({
        dialogType: ''
      })
    };
    var props = {
      title: I18N.Folder.Widget.Leave,
      firstActionLabel: I18N.Folder.Widget.LeaveButton,
      secondActionLabel: I18N.Folder.Widget.LeaveCancel,
      content: I18N.Folder.Widget.LeaveContent,
      onFirstActionTouchTap: _onConfirm,
      onSecondActionTouchTap: _onCancel,
      onDismiss: _onCancel,
    }
    return (
      <Dialog {...props}/>
      )
  },
  _getErrorNoticeDialog: function() {
    var that = this;
    var _onCancel = function() {
      that.setState({
        dialogType: ''
      })
    };
    var props = {
      title: I18N.Platform.ServiceProvider.ErrorNotice,
      firstActionLabel: I18N.Mail.Send.Ok,
      content: FolderStore.getDisplayDialog().contentInfo,
      onFirstActionTouchTap: _onCancel,
      onDismiss: _onCancel,
    }
    return (
      <Dialog {...props}/>
      )
  },
  render: function() {
    let me = this;
    var dialog;
    switch (this.state.dialogType) {
      case DIALOG_TYPE.SWITCH_WIDGET:
        dialog = this._getSwitchWidgetDialog();
        break;
      case DIALOG_TYPE.ERROR_NOTICE:
        dialog = this._getErrorNoticeDialog();
        break;

    }

    let bizTypeMap = {
      1: 'Energy',
      2: 'Unit',
      3: 'Ratio',
      4: 'Label',
      5: 'Rank'
    };
    let mainPanel,
      rightPanel;
    let selectedNode = this.state.selectedNode;
    if (!selectedNode || this.state.refreshChart) {
      mainPanel = (<div style={{
        marginTop: '-16px',
        backgroundColor: '#ffffff',
        flex: 1
      }}>
      <OrigamiPanel/>
    </div>);
    } else {
      let type = selectedNode.get('Type');
      if (type === 6) {
        //forder
        mainPanel = (this.state.selectedNode ? <FolderDetailPanel onToggle={this._onLeftSwitchButtonClick}
        nodeData={this.state.selectedNode}
        onOperationSelect={this._onTemplateSelect}/> : null);
      } else if (type === 7) {
        //chart panel
        let widgetDto = me.state.widgetDto;
        let title = selectedNode.get('Name');
        let sourceUserName = selectedNode.get('SourceUserName');
        let bizType = bizTypeMap[selectedNode.get('WidgetType')];
        let energyType = this.state.selectedEnergyType || this.getEnergyTypeFromWidgetDto(widgetDto);
        rightPanel = this.getRightPanel(bizType, energyType);

        let mainPanelProps = {
          chartTitle: title,
          sourceUserName: sourceUserName,
          bizType: bizType,
          energyType: energyType,
          widgetDto: widgetDto,
          onEnergyTypeChange: me._onEnergyTypeChanged,
          onOperationSelect: me._onWidgetMenuSelect,
          onCollapseButtonClick: me._onLeftSwitchButtonClick
        };
        let widgetInitState = WidgetStore.getInitState();
        if (widgetInitState) {
          mainPanelProps.widgetInitState = true;
        }
        mainPanel = <AnalysisPanel {...mainPanelProps}></AnalysisPanel>;
      }
    }

    let operation = (this.state.templateShow ? this.getTemplate() : null);
    let leftPanel = (this.state.showLeftPanel) ? <div style={{
      display: 'flex'
    }}><LeftPanel/></div> : <div style={{
      display: 'none'
    }}><LeftPanel/></div>;

    return (
      <div style={{
        display: 'flex',
        flex: 1
      }}>
        {leftPanel}
        {mainPanel}
        {rightPanel}
        {operation}
        {dialog}
        <Snackbar ref='snackbar' message={this.state.errorText}/>
      </div>
      );
  },
  getRightPanel(bizType, energyType) {
    let rightPanel = null;
    switch (bizType) {
      case 'Energy':
        if (!energyType || energyType === 'Energy') {
          rightPanel = <RightPanel onButtonClick={this._onRightSwitchButtonClick}
          defaultStatus={this.state.showRightPanel}
          container={<DataSelectMainPanel widgetType={bizType}></DataSelectMainPanel>}/>;
        } else {
          rightPanel = <RightPanel onButtonClick={this._onRightSwitchButtonClick}
          defaultStatus={this.state.showRightPanel}
          container={<CommodityContainer ecType={energyType}></CommodityContainer>}/>;
        }
        break;
      case 'Unit':
        if (!energyType || energyType === 'Energy') {
          rightPanel = <RightPanel onButtonClick={this._onRightSwitchButtonClick}
          defaultStatus={this.state.showRightPanel}
          container={<DataSelectMainPanel widgetType={bizType}></DataSelectMainPanel>}/>;
        } else {
          rightPanel = <RightPanel onButtonClick={this._onRightSwitchButtonClick}
          defaultStatus={this.state.showRightPanel}
          container={<CommodityContainer ecType={energyType}></CommodityContainer>}/>;
        }
        break;
      case 'Ratio':
        rightPanel = <RightPanel onButtonClick={this._onRightSwitchButtonClick}
        defaultStatus={this.state.showRightPanel}
        container={<DataSelectMainPanel widgetType={bizType}></DataSelectMainPanel>}/>;
        break;
      case 'Label':
        rightPanel = <RightPanel onButtonClick={this._onRightSwitchButtonClick}
        defaultStatus={this.state.showRightPanel}
        container={<DataSelectMainPanel widgetType={bizType}></DataSelectMainPanel>}/>;
        break;
      case 'Rank':
        //return Rank rightPanel
        rightPanel = <RightPanel onButtonClick={this._onRightSwitchButtonClick}
        defaultStatus={this.state.showRightPanel}
        container={<RankingContainer ecType={energyType || 'Energy'}/>}/>;

        break;
    }
    if (lastBizType !== null) {
      if (bizType == 'Rank') {
        if (lastEnergyType !== null && lastEnergyType != energyType) {
          CommodityStore.clearRankingCommodity()
        }
      } else {
        if (lastEnergyType !== null && lastEnergyType != energyType) {
          if (energyType == 'Energy') {
            TagStore.clearTagStatus()
          } else {
            CommodityStore.clearCommodityStatus()
          }
        }
      }
    }
    lastBizType = bizType;
    lastEnergyType = energyType
    // if (bizType == 'Rank') {
    //   if (lastEnergyType !== null && lastEnergyType != energyType) {
    //     CommodityStore.clearRankingCommodity()
    //   } else {
    //     lastEnergyType = energyType
    //   }
    // } else {
    //   lastEnergyType = null
    // }
    return rightPanel;
  }
});

module.exports = Setting;
