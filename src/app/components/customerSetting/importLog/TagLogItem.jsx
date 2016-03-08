'use strict';

import React from 'react';
import CommonFuns from '../../../util/Util.jsx';
import FlatButton from '../../../controls/FlatButton.jsx';

let TagLogItem = React.createClass({
  getInitialState: function() {
    return {
      showDownloadButton: false
    };
  },
  _getDisplayTime() {
    var j2d = CommonFuns.DataConverter.JsonToDateTime;
    var importTime = j2d(this.props.time, true);
    var time = CommonFuns.formatChinaDate(importTime, true);
    return time;
  },
  _getDisplayStr() {
    var resultStr = I18N.format(I18N.Setting.TagBatchImport.ImportResult, this.props.successNum, this.props.failedNum, this.props.total);
    return I18N.Setting.TagBatchImport.File + this.props.fileName + resultStr;
  },
  _showDeleteDialog() {
    if (this.props.showDeleteDialog) {
      this.props.showDeleteDialog(this.props.id, this.props.name);
    }
  },
  _showDownloadButton(value) {
    this.setState({
      showDownloadButton: value
    });
  },
  _downloadLog: function() {
    var iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    iframe.src = 'TagImportExcel.aspx?Id=' + this.props.id;
    iframe.onload = function() {
      document.body.removeChild(iframe);
    };
    document.body.appendChild(iframe);
  },

  render() {
    var me = this;
    var displayTime = me._getDisplayTime();
    var displayStr = me._getDisplayStr();
    var downloadButton = null;
    if (me.state.showDownloadButton) {
      downloadButton = (<div className="jazz-template-item-left-action">
          <FlatButton label={I18N.Setting.TagBatchImport.DownloadLog} onClick={me._downloadLog} rippleColor={'transparent'}></FlatButton>
        </div>);
    }
    return (
      <div className='jazz-template-item' onMouseLeave={me._showDownloadButton.bind(null, false)} onMouseEnter={me._showDownloadButton.bind(null, true)}>
      <div className='jazz-template-item-right'>
        <div className='jazz-template-item-right-name'>{displayStr}</div>
        <div className="jazz-template-item-right-user">
          <div className="jazz-template-user-info jazz-template-item-right-user-info">
            <a href={'mailto:' + me.props.email}>
              <span>{me.props.userName}</span>
              <ul>
                <li>{me.props.roleName}</li>
                <li>{me.props.telephone}</li>
                <li>{me.props.email}</li>
              </ul>
            </a>
            <span>{I18N.Setting.TagBatchImport.UploadAt + displayTime}</span>
          </div>
        </div>
      </div>
      <div className="jazz-template-item-middle">
      </div>
      <div className='jazz-template-item-left'>
        {downloadButton}
      </div>
    </div>
      );
  }
});

module.exports = TagLogItem;
