'use strict';

import React from 'react';
import CommonFuns from '../../util/Util.jsx';
import ReportAction from '../../actions/ReportAction.jsx';
import { CircularProgress, FlatButton, FontIcon, SelectField, TextField, RadioButton, Dialog } from 'material-ui';
import classNames from 'classnames';


let TemplateItem = React.createClass({
  getInitialState: function() {
    return {
      showDeleteDialog: false
    };
  },
  _getDisplayText() {
    var j2d = CommonFuns.DataConverter.JsonToDateTime;
    var createTime = j2d(this.props.createTime, true);
    var createUser = this.props.createUser;
    var time = CommonFuns.formatChinaDate(createTime, true);
    var str = createUser + ' 创建于' + time;
    return str;
  },
  _handleDialogDismiss() {
    this.setState({
      showDeleteDialog: false,
      showDeleteButton: false
    });
  },
  _showDeleteDialog() {
    this.setState({
      showDeleteDialog: true
    });
  },
  _showDeleteButton(value) {
    this.setState({
      showDeleteButton: value
    });
  },
  _renderDeleteDialog() {
    if (!this.state.showDeleteDialog) {
      return null;
    }
    var dialogActions = [
      <FlatButton
      label={I18N.EM.Report.Delete}
      onClick={this._deleteTemplate} />,

      <FlatButton
      label={I18N.EM.Report.Cancel}
      onClick={this._handleDialogDismiss} />
    ];

    return (<Dialog
      ref="deleteDialog"
      openImmediately={true}
      actions={dialogActions}
      modal={true}>
        {'确定删除 "' + this.props.name + ' "吗？'}
      </Dialog>);
  },
  _deleteTemolate: function() {
    var id = this.props.id;
    ReportAction.deleteTemplateById(id);
  },
  _downloadTemplate: function() {
    var templateId = this.props.id;
    var iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    iframe.src = 'TagImportExcel.aspx?Type=ReportTemplate&Id=' + templateId;
    iframe.onload = function() {
      document.body.removeChild(iframe);
    };
    document.body.appendChild(iframe);
  },

  render() {
    var me = this;
    var displayStr = me._getDisplayText();
    var deleteButton = null;
    if (me.state.showDeleteButton) {
      deleteButton = <FlatButton label={I18N.EM.Report.Delete} onClick={me._showDeleteDialog} />;
    }
    return (
      <div className='jazz-template-grid-item' onMouseOver={me._showDeleteButton.bind(null, true)} onMouseOut={me._showDeleteButton.bind(null, false)}>
      <div className='jazz-template-grid-item-left'>
        <div className='jazz-template-grid-item-name' onClick={me._downloadTemplate}>{me.props.name}</div>
        <div>{displayStr}</div>
      </div>
      <div className='jazz-template-grid-item-right'>
        {deleteButton}
      </div>
    </div>
      );
  }
});

module.exports = TemplateItem;
