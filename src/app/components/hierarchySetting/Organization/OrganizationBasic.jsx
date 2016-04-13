'use strict';

import React from "react";
import classnames from "classnames";
import moment from "moment";
import { formStatus } from '../../../constants/FormStatus.jsx';
import { dataStatus } from '../../../constants/DataStatus.jsx';
import ViewableTextField from '../../../controls/ViewableTextField.jsx';
import ViewableTextFieldUtil from '../../../controls/ViewableTextFieldUtil.jsx';
import CommonFuns from '../../../util/Util.jsx';
import Regex from '../../../constants/Regex.jsx';
import ReceiversList from '../../customerSetting/VEERules/ReceiversList.jsx';


var OrganizationBasic = React.createClass({

  propTypes: {
    selectedNode: React.PropTypes.object,
    merge: React.PropTypes.func,
    formStatus: React.PropTypes.string,
  },
  mixins: [React.addons.LinkedStateMixin, ViewableTextFieldUtil],
  _renderDetail: function() {
    var {Code, Comment, Administrators} = this.props.selectedNode.toJS(),
      isView = this.props.formStatus === formStatus.VIEW,
      isAdd = this.props.formStatus === formStatus.ADD,
      title = this.props.selectedNode.get('Type') === 0 ? I18N.Common.Glossary.Organization : I18N.Common.Glossary.Site,
      adminList = null;
    var codeProps = {
        isViewStatus: isView,
        title: I18N.format(I18N.Setting.Organization.Code, title),
        defaultValue: Code,
        regex: Regex.CustomerCode,
        errorMessage: I18N.Setting.CustomerManagement.CodeError,
        isRequired: true,
        didChanged: value => {
          this.props.merge({
            value,
            path: "Code"
          })
        }
      },
      commentProps = {
        isViewStatus: isView,
        title: I18N.Setting.UserManagement.Comment,
        defaultValue: Comment || "",
        multiLine: true,
        maxLen: -1,
        didChanged: value => {
          this.props.merge({
            value,
            path: "Comment"
          });
        }
      };
    if (!isView || (Administrators && Administrators.length > 0)) {
      var adminsProps = {
        status: this.props.formStatus,
        ruleId: this.props.selectedNode.get('Id'),
        receivers: this.props.rule.get('Receivers'),
        dataDidChanged: (status, value, index) => {
          var path = "Administrators";
          if (status === dataStatus.DELETED) {
            path += "." + index;
          }
          this.props.merge({
            status,
            value,
            path,
            index
          })
        }
      };

      adminList = (
        <ReceiversList {...receiversProps}/>
      );
    }
    return (
      <div>
        <div className={"pop-customer-detail-content"}>
        <div className="pop-customer-detail-content-left">
          <div className="pop-customer-detail-content-left-item">
            <ViewableTextField {...codeProps} />
          </div>
          {Comment || !isView ? <div className={classnames("pop-user-detail-content-item", "jazz-customer-comment")}>
                    <ViewableTextField {...commentProps}/>
                  </div> : null}

        </div>
      </div>
      {adminList}
      </div>
      )

  },
  componentWillMount: function() {
    this.initBatchViewbaleTextFiled();
    this.clearErrorTextBatchViewbaleTextFiled();
  },
  componentWillUnmount: function() {
    this.clearErrorTextBatchViewbaleTextFiled();
  },
  render: function() {
    return (
      <div className="pop-manage-detail-content">
        {this._renderDetail()}
      </div>
      )

  },
});
module.exports = OrganizationBasic;
