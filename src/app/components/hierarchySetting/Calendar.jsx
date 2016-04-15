'use strict';

import React from "react";
import classnames from "classnames";
import { formStatus } from '../../constants/FormStatus.jsx';
import HierarchyAction from '../../actions/hierarchySetting/HierarchyAction.jsx';
import HierarchyStore from '../../stores/hierarchySetting/HierarchyStore.jsx';
import ViewableDropDownMenu from '../../controls/ViewableDropDownMenu.jsx';
import ViewableTextField from '../../controls/ViewableTextField.jsx';
import Regex from '../../constants/Regex.jsx';


var Calendar = React.createClass({

  propTypes: {
    selectedNode: React.PropTypes.object,
    merge: React.PropTypes.func,
    formStatus: React.PropTypes.string,
  },
  _renderDetail: function() {
    var {Code, Comment, Administrators} = this.props.selectedNode.toJS(),
      isView = this.props.formStatus === formStatus.VIEW,
      title = this.props.selectedNode.get('Type') === 0 ? I18N.Common.Glossary.Organization : I18N.Common.Glossary.Site;
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
          });
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
    return (
      <div>
        <div className={"pop-customer-detail-content"}>
        <div className="pop-customer-detail-content-left">
          <div className="pop-customer-detail-content-left-item">
            <ViewableTextField {...codeProps} />
          </div>

        </div>
      </div>
      </div>
      );

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
      );

  },
});
module.exports = Calendar;
