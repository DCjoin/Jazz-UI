'use strict';

import React from 'react';
import ReactDom from 'react-dom';
import classNames from 'classnames';
import { CircularProgress } from 'material-ui';
import CommonFuns from 'util/Util.jsx';
import SearchAndFilterBar from 'controls/SearchAndFilterBar.jsx';
import Pagination from 'controls/paging/Pagination.jsx';
import FlatButton from 'controls/FlatButton.jsx';
import Dialog from 'controls/NewDialog.jsx';
import UploadForm from 'controls/UploadForm.jsx';
import TagAction from 'actions/customerSetting/TagAction.jsx';

let TagList = React.createClass({
  propTypes: {
    onAddBtnClick: React.PropTypes.func,
    onImportBtnClick: React.PropTypes.func,
    onExportBtnClick: React.PropTypes.func,
    onPrePage: React.PropTypes.func,
    onNextPage: React.PropTypes.func,
    onJumpToPage: React.PropTypes.func,
    curPageNum: React.PropTypes.number,
    totalPageNum: React.PropTypes.number,
    hasJumpBtn: React.PropTypes.bool,
    onSearch: React.PropTypes.func,
    onFilter: React.PropTypes.func,
    onSearchCleanButtonClick: React.PropTypes.func,
    isFilter: React.PropTypes.bool,
    filterObj: React.PropTypes.object,
    contentItems: React.PropTypes.object,
    isAddStatus: React.PropTypes.bool,
    tagType: React.PropTypes.number
  },
  contextTypes:{
      currentRoute: React.PropTypes.object
  },
  getInitialState: function() {
    return {
      showImportDialog: false,
      isImporting: false,
      ErrorMsg: null
    };
  },
  _onSearch: function(value) {
    if (this.props.onSearch) {
      this.props.onSearch(value);
    }
  },
  _onJumpToPage: function(targetPage) {
    if (this.props.onJumpToPage) {
      this.props.onJumpToPage(targetPage);
    }
  },
  _handleImportDialogDismiss: function() {
    if (this.state.importSuccess) {
      this.props.resetFilterObj();
    }
    this.setState({
      showImportDialog: false,
      ErrorMsg: null
    });
  },
  _downloadLogFile: function() {
    var iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    iframe.src = 'TagImportExcel.aspx?Id=' + this.state.importResult.Id;
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
      TagType: this.props.tagType,
    });
    me.setState({
      showImportDialog: true,
      isImporting: true
    });
  },
  render: function() {
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
    var importDialog = this._renderImportDialog();
    return (
      <div className="jazz-tag-leftpanel">
        <div className="jazz-tag-leftpanel-header">
          <span onClick={this.props.onAddBtnClick} disabled={this.props.isAddStatus} className={classNames(addBtnClasses)}>
            <span className="icon-add jazz-tag-leftpanel-header-item-icon"></span>
            {I18N.Setting.Tag.Tag}
          </span>
          <label ref="fileInputLabel" className="jazz-tag-leftpanel-header-item" htmlFor="fileInput">
            <span className="icon-import jazz-tag-leftpanel-header-item-icon"></span>
            {I18N.Common.Button.Import}
            <div style={fileInputStyle}>
              <UploadForm
                id='fileInput'
                ref='fileInput'
                action='/tag/import'
                method='post'
                onChangeFile={this._onImportBtnClick}
                onload={(iframe) => {
                  var json = iframe.contentDocument.body.innerHTML;
                  var obj = JSON.parse(json);
                  if (obj.success === true) {
                    this.setState({
                      importResult: obj.TagImportHisDto,
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
              />
            </div>
          </label>
          <span onClick={this.props.onExportBtnClick} className="jazz-tag-leftpanel-header-item">
            <span className="icon-export jazz-tag-leftpanel-header-item-icon"></span>
            {I18N.Common.Button.Export}
          </span>
        </div>
        <div className="jazz-tag-search-filter-bar">
          <SearchAndFilterBar onFilter={this.props.onFilter} ref='searchAndFilter'
      onSearch={this._onSearch} value={this.props.filterObj.LikeCodeOrName} onSearchCleanButtonClick={this.props.onSearchCleanButtonClick}
      isFilter={this.props.isFilter}/>
        </div>
        <div className="jazz-tag-list">
          {this.props.contentItems}
        </div>
        <div className="jazz-tag-pagination">
          <Pagination previousPage={this.props.onPrePage}
      nextPage={this.props.onNextPage}
      jumpToPage={this._onJumpToPage}
      curPageNum={this.props.curPageNum}
      totalPageNum={this.props.totalPageNum}
      hasJumpBtn={this.props.hasJumpBtn}/>
        </div>
        {importDialog}
      </div>
      );
  },
});
module.exports = TagList;
