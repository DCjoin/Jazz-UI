'use strict';
import PropTypes from 'prop-types';
import React from "react";
import classnames from "classnames";
import { formStatus } from '../../../constants/FormStatus.jsx';
import { dataStatus } from '../../../constants/DataStatus.jsx';
import ViewableTextField from '../../../controls/ViewableTextField.jsx';
import ViewableTextFieldUtil from '../../../controls/ViewableTextFieldUtil.jsx';
import Regex from '../../../constants/Regex.jsx';
import AdminList from '../../customer/AdminList.jsx';
var createReactClass = require('create-react-class');

var OrganizationBasic = createReactClass({

  propTypes: {
    selectedNode: PropTypes.object,
    merge: PropTypes.func,
    formStatus: PropTypes.string,
    setEditBtnStatus: PropTypes.func
  },
  //mixins: [React.addons.LinkedStateMixin, ViewableTextFieldUtil],
  _renderDetail: function() {
    var {Code, Comment, Administrators} = this.props.selectedNode.toJS(),
      isView = this.props.formStatus === formStatus.VIEW,
      title = this.props.selectedNode.get('Type') === 0 ? I18N.Common.Glossary.Organization : I18N.Common.Glossary.Site,
      that = this,
      adminList = null;
    var codeProps = {
        isViewStatus: isView,
        title: I18N.format(I18N.Setting.Organization.Code, title),
        defaultValue: Code,
        maxLen: 200,
        isRequired: true,
        didChanged: value => {
          if (value.length > 200) {
            that.props.setEditBtnStatus(true);
          } else {
            that.props.setEditBtnStatus(false);
          }
          this.props.merge({
            value,
            path: "Code"
          })
        }
      },
      commentProps = {
        isViewStatus: isView,
        title: I18N.Platform.ServiceProvider.Comment,
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
      var adminProps = {
        status: this.props.formStatus,
        admins: this.props.selectedNode.get("Administrators"),
        dataDidChanged: (status, value, index) => {
          var path = "Administrators";
          if (status !== dataStatus.NEW) {
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
        <AdminList {...adminProps}/>
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
    if (this.props.selectedNode.get('Code'))
      if (this.props.selectedNode.get('Code').length <= 200) {
        this.props.setEditBtnStatus(false);
    }
    //this.initBatchViewbaleTextFiled();
    //this.clearErrorTextBatchViewbaleTextFiled();
  },
  componentWillUnmount: function() {
    //this.clearErrorTextBatchViewbaleTextFiled();
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
