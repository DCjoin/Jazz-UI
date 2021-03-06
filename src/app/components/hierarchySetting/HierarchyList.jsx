'use strict';

import React from "react";
import ReactDom from 'react-dom';
import classNames from 'classnames';
import { CircularProgress, MenuItem } from 'material-ui';
import PropTypes from 'prop-types';
import { formStatus } from 'constants/FormStatus.jsx';
import { treeSource } from 'constants/TreeSource.jsx';
import TreeConstants from 'constants/TreeConstants.jsx';
import CommonFuns from 'util/Util.jsx';
import Tree from 'controls/tree/Tree.jsx';
import FlatButton from 'controls/FlatButton.jsx';
import Dialog from 'controls/NewDialog.jsx';
import DropdownButton from 'controls/DropdownButton.jsx';
import UploadForm from 'controls/UploadForm.jsx';
var createReactClass = require('create-react-class');
import HierarchyStore from 'stores/hierarchySetting/HierarchyStore.jsx';
import HierarchyAction from 'actions/hierarchySetting/HierarchyAction.jsx';
import downloadFile from 'actions/download_file.js';

let {nodeType} = TreeConstants;

var HierarchyList = createReactClass({
  propTypes: {
    formStatus: PropTypes.string,
    onHierarchyClick: PropTypes.func,
    onAddBtnClick: PropTypes.func,
    hierarchys: PropTypes.object,
    selectedNode: PropTypes.object,
    onExportBtnClick: PropTypes.func,
    onReloadHierachyTree: PropTypes.func,
    onGragulaNode: PropTypes.func
  },
  contextTypes:{
      currentRoute: PropTypes.object
  },
  getInitialState: function() {
    return {
      showImportDialog: false,
      isImporting: false,
      ErrorMsg: null
    };
  },
  getAddMenuItems: function() {
    var items = HierarchyStore.getDropDownMenuItemsByType(this.props.selectedNode.get('Type')),
      menuItems = [],
      that = this;
    var itemStyle = {
      fontSize: '14px',
      color: '#767a7a',
      paddingLeft: '44px'
    };
    if (items !== null) {
      if (items.length === 1) {
        menuItems = [<MenuItem key={2} value={2} innerDivStyle={itemStyle} primaryText={items[0]}/>]
      } else {
        items.forEach((item, index) => {
          if (index === 0) {
            if (!that.getAddBtnDisabled()) {
              menuItems.push(
                <MenuItem key={index} value={index} innerDivStyle={itemStyle} primaryText={item}/>
              );
            }

          } else {
            menuItems.push(
              <MenuItem key={index} value={index} innerDivStyle={itemStyle} primaryText={item}/>
            );
          }

        });
      }

    }
    return menuItems;

  },

  getAddBtnDisabled: function() {
    if (this.props.formStatus === formStatus.ADD) {
      return true;
    } else {
      return HierarchyStore.getAddBtnStatusByNode(this.props.selectedNode);
    }
  },
  _onAddBtnClick: function() {
    let newNodeType = null;
    switch (this.props.selectedNode.get('Type')) {
      case nodeType.Site:
        newNodeType = nodeType.Building;
        break;
      case nodeType.Building:
        newNodeType = nodeType.Area;
        break;
      case nodeType.Area:
        newNodeType = nodeType.Area;
        break;
    }
    this.props.onAddBtnClick(newNodeType);
  },
  _onMenuAddBtnClick: function(e, item) {
    let key = parseInt(item);
    let newNodeType = null;
    switch (key) {
      case 0:
        newNodeType = nodeType.Organization;
        break;
      case 1:
        newNodeType = nodeType.Site;
        break;
      case 2:
        newNodeType = nodeType.Building;
        break;
    }
    this.props.onAddBtnClick(newNodeType);
  },
  _handleImportDialogDismiss: function() {
    if (this.state.importSuccess) {
      this.props.onReloadHierachyTree();
    }
    this.setState({
      showImportDialog: false,
      ErrorMsg: null
    });
  },
  _downloadLogFile: function() {    
    downloadFile.get('/hierarchy/downloadhierarchylog/' + this.context.currentRoute.params.customerId + '/' + this.state.importResult.Id);
    // var iframe = document.createElement('iframe');
    // iframe.style.display = 'none';
    // iframe.src = 'ImpExpHierarchy.aspx?TagType=Hierarchy&Id=' + this.state.importResult.Id;
    // iframe.onload = function() {
    //   document.body.removeChild(iframe);
    // };
    // document.body.appendChild(iframe);
  },
  _renderImportDialog() {
    if (!this.state.showImportDialog) {
      return null;
    }
    var dialogActions = [];
    var dialogContent;
    var dialogTitle = '';
    if (this.state.isImporting) {
      dialogContent = (<div className='jazz-tag-loading'><div style={{
        margin: 'auto',
        width: '100px'
      }}><CircularProgress  mode="indeterminate" size={80} /></div></div>);
    } else if (this.state.importSuccess) {
      dialogTitle = I18N.Setting.TagBatchImport.ImportSuccess;
      var importResult = this.state.importResult;
      dialogContent = (<div>{I18N.format(I18N.Setting.TagBatchImport.ImportSuccessView, importResult.TotalSuccCount, importResult.TotalFailedCount, importResult.TotalCount)}</div>);
      dialogActions = [
        <FlatButton
        label={I18N.Setting.TagBatchImport.DownloadLog}
        onClick={this._downloadLogFile} />,

        <FlatButton
        label={I18N.Common.Button.Close}
        onClick={this._handleImportDialogDismiss} />
      ];
    } else {
      dialogTitle = I18N.Setting.TagBatchImport.ImportError;
      var errorText = this.state.ErrorMsg;
      dialogContent = (<div>{errorText}</div>);
    }

    return (<Dialog
      ref="importDialog"
      open={true}
      title={dialogTitle}
      actions={dialogActions}
      onClose={this._handleImportDialogDismiss}
      onRequestClose={this._handleImportDialogDismiss}
      modal={this.state.isImporting || this.state.importSuccess}>
          {dialogContent}
        </Dialog>);
  },
  _onImportBtnClick: function(event) {
    var me = this;
    var file = event.target.files[0];
    var fileName = file.name;

    if (!CommonFuns.endsWith(fileName.toLowerCase(), '.xlsx') && !CommonFuns.endsWith(fileName.toLowerCase(), '.xls')) {
      CommonFuns.popupErrorMessage(I18N.EM.Report.WrongExcelFile, '', true);
      return;
    }
    this.refs.fileInput.upload({
      CustomerId: parseInt(this.context.currentRoute.params.customerId),
      FileName: fileName,
    });
    me.setState({
      showImportDialog: true,
      isImporting: true
    });
  },
  _ifGragulaInvalid: function(id) {
    if (id < 0) {
      return true;
    }
    if (id === parseInt(this.context.currentRoute.params.customerId)) {
      return true;
    }
    return false;
  },
  render: function() {
    var isAddStatus = this.props.formStatus === formStatus.ADD;
    var treeProps = {
        key: 'hierarchytree',
        collapsedLevel: 0,
        allNode: this.props.hierarchys,
        allHasCheckBox: false,
        allDisabled: false,
        onSelectNode: this.props.onHierarchyClick,
        selectedNode: this.props.selectedNode,
        arrowClass: 'jazz-foldertree-arrow',
        treeNodeClass: 'jazz-foldertree-node',
        onGragulaNode: this.props.onGragulaNode,
        ifGragulaInvalid: this._ifGragulaInvalid,
        onUnfoldNode: this._onUnfoldNode,
        treeSource: treeSource.Hierarchy
      },
      addBtnProps = {
        type: "Add",
        text: I18N.Common.Glossary.Node,
        menuItems: this.getAddMenuItems(),
        onItemClick: this._onMenuAddBtnClick,
        buttonIcon: 'icon-add'
      };
    var addBtnClasses = {
        'jazz-tag-leftpanel-header-item': !isAddStatus,
        'jazz-tag-disabled': isAddStatus || this.getAddBtnDisabled(),
      },
      fileInputStyle = {
        opacity: 0,
        position: "absolute",
        top: 0,
        left: 0,
        display: 'none'
      };
    var addBtn = null;

    if (this.props.selectedNode.get('Type') > 1 || this.props.selectedNode.size === 0) {
      addBtn = <span onClick={this.getAddBtnDisabled() ? null : this._onAddBtnClick} className={classNames(addBtnClasses)} style={{
        margin: '0 15px'
      }}>
              <span className="icon-add jazz-tag-leftpanel-header-item-icon"></span>
              {I18N.Common.Glossary.Node}
            </span>;
    } else {
      addBtnProps.disabled=this.getAddBtnDisabled();
      addBtn = <div style={{
        marginTop: '-2px'
      }}><DropdownButton {...addBtnProps}/></div>;
    }


    var importDialog = this._renderImportDialog();
    return (
      <div className='jazz-tag-leftpanel'>
        <div className="jazz-tag-leftpanel-header">
          {addBtn}
          <label ref="fileInputLabel" className="jazz-tag-leftpanel-header-item" htmlFor="fileInput">
            <span className="icon-import jazz-tag-leftpanel-header-item-icon"></span>
            {I18N.Common.Button.Import}
            <div style={fileInputStyle}>
              <UploadForm
                ref='fileInput'
                id='fileInput'
                method='post'
                action='/hierarchy/import'
                onChangeFile={this._onImportBtnClick}
                onload={(obj) => {
                  if (obj) {
                    this.setState({
                      importResult: obj,
                      isImporting: false,
                      importSuccess: true
                    });
                  } else {
                    var ErrorMsg = null;
                    if (obj.UploadResponse.ErrorCode === -7) {
                      ErrorMsg = I18N.Setting.TagBatchImport.ImportSizeErrorView;
                    } else if (obj.UploadResponse.ErrorCode === -9) {
                      ErrorMsg = I18N.Message.M9;
                    } else if (obj.UploadResponse.ErrorCode === -8) {
                      ErrorMsg = I18N.Message.M8;
                    } else {
                      ErrorMsg = I18N.Setting.TagBatchImport.ImportErrorView;
                    }

                    this.setState({
                      isImporting: false,
                      importSuccess: false,
                      ErrorMsg: ErrorMsg
                    });
                  }
                }}
                onError={(err, res) => {
                  var ErrorCode = '';
                  try {
                    ErrorCode = res.body.error.Code.split('-')[1] * 1;
                  } catch(e) {}
                  var ErrorMsg = null;
                  if (ErrorCode === 7) {
                    ErrorMsg = I18N.Setting.TagBatchImport.ImportSizeErrorView;
                  } else if (ErrorCode === 9) {
                    ErrorMsg = I18N.Message.M9;
                  } else if (ErrorCode === 8) {
                    ErrorMsg = I18N.Message.M8;
                  } else {
                    ErrorMsg = I18N.Setting.TagBatchImport.ImportErrorView;
                  }
                  this.setState({
                    isImporting: false,
                    importSuccess: false,
                    ErrorMsg: ErrorMsg
                  });
                }}
              />
            </div>
          </label>
          <span onClick={this.props.onExportBtnClick} className="jazz-tag-leftpanel-header-item">
            <span className="icon-export jazz-tag-leftpanel-header-item-icon"></span>
            {I18N.Common.Button.Export}
          </span>
        </div>
        <div className="jazz-folder-leftpanel-foldertree" style={{
        color: '#626469'
      }}>
          <Tree {...treeProps}/>
        </div>
        {importDialog}
      </div>

      );
  }
});
module.exports = HierarchyList;
