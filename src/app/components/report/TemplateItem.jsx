'use strict';

import React from 'react';
import CommonFuns from '../../util/Util.jsx';
import ReportAction from '../../actions/ReportAction.jsx';
import { CircularProgress, FlatButton, FontIcon, SelectField, TextField, RadioButton, Dialog, LinkButton } from 'material-ui';
import classNames from 'classnames';


let TemplateItem = React.createClass({
  getInitialState: function() {
    return {
      showDeleteDialog: false
    };
  },
  _getDisplayTime() {
    var j2d = CommonFuns.DataConverter.JsonToDateTime;
    var createTime = j2d(this.props.createTime, true);
    var time = CommonFuns.formatChinaDate(createTime, true);
    return time;
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
    var displayTime = me._getDisplayTime();
    var deleteButton = null;
    if (me.state.showDeleteButton) {
      deleteButton = <div className="jazz-template-item-left-action">
          <FlatButton label={I18N.EM.Report.Delete} onClick={me.deleteTemplateById}></FlatButton>
        </div>;
    }
    return (
      <div className='jazz-template-item' onMouseLeave={me._showDeleteButton.bind(null, false)} onMouseEnter={me._showDeleteButton.bind(null, true)}>
      <div className='jazz-template-item-right'>
        <div className='jazz-template-item-right-name' onClick={me._downloadTemplate}>{me.props.name}</div>
        <div className="jazz-template-item-right-user">
          <div className="jazz-template-user-info jazz-template-item-right-user-info">
            <a href={'mailto:' + me.props.email}>
              <span>{me.props.createUser}</span>
              <ul>
                <li>{me.props.roleName}</li>
                <li>{me.props.telephone}</li>
                <li>{me.props.email}</li>
              </ul>
            </a>
            <span>创建于{displayTime}</span>
          </div>
        </div>
      </div>
      <div className="jazz-template-item-middle">
      </div>
      <div className='jazz-template-item-left'>
        {deleteButton}
      </div>
    </div>
      );
  }
});

module.exports = TemplateItem;
