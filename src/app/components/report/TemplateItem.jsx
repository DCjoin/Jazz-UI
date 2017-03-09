'use strict';

import React from 'react';
import CommonFuns from '../../util/Util.jsx';
import ReportAction from '../../actions/ReportAction.jsx';
import { CircularProgress, FontIcon, SelectField, TextField, RadioButton, Dialog, LinkButton } from 'material-ui';
import FlatButton from '../../controls/FlatButton.jsx';
import classNames from 'classnames';


let TemplateItem = React.createClass({
  getInitialState: function() {
    return {
      showDeleteButton: false
    };
  },
  _getDisplayTime() {
    var j2d = CommonFuns.DataConverter.JsonToDateTime;
    var createTime = j2d(this.props.createTime, true);
    var time = CommonFuns.formatChinaDate(createTime, true);
    return time;
  },
  _showDeleteDialog() {
    if (this.props.showDeleteDialog) {
      this.props.showDeleteDialog(this.props.id, this.props.name);
    }
  },
  _showReplaceDialog() {
    if (this.props.showReplaceDialog) {
      this.props.showReplaceDialog(this.props.id, this.props.name);
    }
  },
  _showDeleteButton(value) {
    this.setState({
      showDeleteButton: value
    });
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
    if (me.state.showDeleteButton && !me.props.onlyRead) {
      if (!me.props.isReference) {
        deleteButton = <div className="jazz-template-item-left-action">
          <FlatButton label={I18N.Common.Button.Delete} onClick={me._showDeleteDialog} rippleColor={'transparent'}></FlatButton>
        </div>;
      } else {
        deleteButton = <div className="jazz-template-item-left-action">
          <FlatButton label={I18N.EM.Report.Replace} onClick={me._showReplaceDialog} rippleColor={'transparent'}></FlatButton>
        </div>;
      }
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
            <span>{I18N.EM.Report.UploadAt + displayTime}</span>
          </div>
        </div>
      </div>
      <div className='jazz-template-item-left'>
        {deleteButton}
      </div>
    </div>
      );
  }
});

module.exports = TemplateItem;
