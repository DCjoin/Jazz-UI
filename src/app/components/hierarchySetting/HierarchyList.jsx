'use strict';

import React from "react";
import { CircularProgress } from 'material-ui';
import { formStatus } from '../../constants/FormStatus.jsx';
import TreeConstants from '../../constants/TreeConstants.jsx';
import CommonFuns from '../../util/Util.jsx';
import classNames from 'classnames';
import Tree from '../../controls/tree/Tree.jsx';
import FlatButton from '../../controls/FlatButton.jsx';
import Dialog from '../../controls/PopupDialog.jsx';
import HierarchyStore from '../../stores/hierarchySetting/HierarchyStore.jsx';
import DropdownButton from '../../controls/DropdownButton.jsx';
let MenuItem = require('material-ui/lib/menus/menu-item');
let {nodeType} = TreeConstants;

var HierarchyList = React.createClass({
  propTypes: {
    formStatus: React.PropTypes.string,
    onHierarchyClick: React.PropTypes.func,
    onAddBtnClick: React.PropTypes.func,
    hierarchys: React.PropTypes.object,
    selectedNode: React.PropTypes.object,
    onExportBtnClick: React.PropTypes.func,
    onReloadHierachyTree: React.PropTypes.func
  //onGragulaNode: React.PropTypes.func
  },
  getInitialState: function() {
    return {
      showImportDialog: false,
      isImporting: false
    };
  },
  getAddMenuItems: function() {
    var items = HierarchyStore.getDropDownMenuItemsByType(this.props.selectedNode.get('Type')),
      menuItems = [];
    var itemStyle = {
      fontSize: '14px',
      color: '#767a7a',
      paddingLeft: '44px'
    };
    if (items !== null) {
      items.forEach((item, index) => {
        menuItems.push(
          <MenuItem key={index} innerDivStyle={itemStyle} primaryText={item}/>
        );
      });
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
    switch (selectedNode.get('Type')) {
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
    let key = parseInt(item.key);
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
      showImportDialog: false
    });
  },
  _downloadLogFile: function() {
    var iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    iframe.src = 'ImpExpHierarchy.aspx?Id=' + this.state.importResult.Id;
    iframe.onload = function() {
      document.body.removeChild(iframe);
    };
    document.body.appendChild(iframe);
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
      }}><CircularProgress  mode="indeterminate" size={2} /></div></div>);
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
      var errorText = this.state.sizeError ? I18N.Setting.TagBatchImport.ImportSizeErrorView : I18N.Setting.TagBatchImport.ImportErrorView;
      dialogContent = (<div>{errorText}</div>);
    }

    return (<Dialog
      ref="importDialog"
      openImmediately={true}
      title={dialogTitle}
      actions={dialogActions}
      onClose={this._handleImportDialogDismiss}
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
    var createElement = window.Highcharts.createElement,
      discardElement = window.Highcharts.discardElement;

    var iframe = createElement('iframe', null, {
      display: 'none'
    }, document.body);
    iframe.onload = function() {
      var json = iframe.contentDocument.body.innerHTML;
      var obj = JSON.parse(json);
      if (obj.success === true) {
        me.setState({
          importResult: obj.TagImportHisDto,
          isImporting: false,
          importSuccess: true
        });
      } else {
        var sizeError = false;
        if (obj.UploadResponse.ErrorCode === -7) {
          sizeError = true;
        }
        me.setState({
          isImporting: false,
          importSuccess: false,
          sizeError: sizeError
        });
      }
    };

    var form = createElement('form', {
      method: 'post',
      action: 'ImpExpHierarchy.aspx',
      target: '_self',
      enctype: 'multipart/form-data',
      name: 'inputForm'
    }, {
      display: 'none'
    }, iframe.contentDocument.body);

    var input = this.refs.fileInput.getDOMNode();
    form.appendChild(input);
    var customerInput = createElement('input', {
      type: 'hidden',
      name: 'CustomerId',
      value: parseInt(window.currentCustomerId)
    }, null, form);
    var hierarchyInput = createElement('input', {
      type: 'hidden',
      name: 'HierarchyId',
      value: me.props.selectedNode.get('Id')
    }, null, form);
    var typeInput = createElement('input', {
      type: 'hidden',
      name: 'TagType',
      value: 'Hierarchy'
    }, null, form);

    form.submit();
    discardElement(form);
    var label = me.refs.fileInputLabel.getDOMNode();
    var tempForm = document.createElement('form');
    document.body.appendChild(tempForm);
    tempForm.appendChild(input);
    tempForm.reset();
    document.body.removeChild(tempForm);
    label.appendChild(input);
    me.setState({
      showImportDialog: true,
      isImporting: true
    });
  },
  render: function() {
    var treeProps = {
        collapsedLevel: 0,
        allNode: this.props.hierarchys,
        allHasCheckBox: false,
        allDisabled: false,
        onSelectNode: this.props.onHierarchyClick,
        selectedNode: this.props.selectedNode,
        arrowClass: 'jazz-foldertree-arrow',
        treeNodeClass: 'jazz-foldertree-node',
      //onGragulaNode: this._onGragulaNode,
      },
      addBtnProps = {
        type: "Add",
        text: I18N.Common.Glossary.Node,
        menuItems: this.getAddMenuItems(),
        onItemClick: this._onMenuAddBtnClick,
      //disabled: this.state.buttonDisabled
      };
    var addBtnClasses = {
        'jazz-tag-leftpanel-header-item': !this.props.isAddStatus,
        'jazz-tag-disabled': this.props.isAddStatus
      },
      fileInputStyle = {
        opacity: 0,
        position: "absolute",
        top: 0,
        left: 0,
        display: 'none'
      };
    var addBtn = null;
    if (this.props.selectedNode.get('Type') > 1) {
      addBtn = <span onClick={this._onAddBtnClick} disabled={this.getAddBtnDisabled()} className={classNames(addBtnClasses)}>
            <span className="icon-add jazz-tag-leftpanel-header-item-icon"></span>
            {I18N.Common.Glossary.Node}
          </span>;
    } else {
      addBtn = <DropdownButton {...addBtnProps}/>;
    }
    var importDialog = this._renderImportDialog();
    return (
      <div className='jazz-tag-leftpanel'>
        <div className="jazz-tag-leftpanel-header">
          {addBtn}
          <label ref="fileInputLabel" className="jazz-tag-leftpanel-header-item" htmlFor="fileInput">
            <span className="icon-import jazz-tag-leftpanel-header-item-icon"></span>
            {I18N.Common.Button.Import}
            <input type="file" ref="fileInput" id='fileInput' name='fileInput' onChange={this._onImportBtnClick} style={fileInputStyle}/>
          </label>
          <span onClick={this.props.onExportBtnClick} className="jazz-tag-leftpanel-header-item">
            <span className="icon-export jazz-tag-leftpanel-header-item-icon"></span>
            {I18N.Common.Button.Export}
          </span>
        </div>
        <div className="jazz-folder-leftpanel-foldertree" style={{
        color: '#ffffff'
      }}>
          <Tree {...treeProps}/>
        </div>
        {importDialog}
      </div>

      );
  }
});
module.exports = HierarchyList;
