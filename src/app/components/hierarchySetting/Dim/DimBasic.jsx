'use strict';

import React from "react";
import classnames from "classnames";
import { formStatus } from '../../../constants/FormStatus.jsx';
import { dataStatus } from '../../../constants/DataStatus.jsx';
import ViewableTextField from '../../../controls/ViewableTextField.jsx';
import ViewableTextFieldUtil from '../../../controls/ViewableTextFieldUtil.jsx';
import Regex from '../../../constants/Regex.jsx';


var DimBasic = React.createClass({

  propTypes: {
    selectedNode: React.PropTypes.object,
    merge: React.PropTypes.func,
    formStatus: React.PropTypes.string,
  },
  //mixins: [React.addons.LinkedStateMixin, ViewableTextFieldUtil],
  _renderDetail: function() {
    var {Comment} = this.props.selectedNode.toJS(),
      isView = this.props.formStatus === formStatus.VIEW;
    var commentProps = {
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
    return (

      <div className={"pop-customer-detail-content"}>
        <div className="pop-customer-detail-content-left">
          {Comment || !isView ? <div className={classnames("pop-user-detail-content-item", "jazz-customer-comment")}>
                    <ViewableTextField {...commentProps}/>
                  </div> : null}

        </div>
      </div>

      )

  },
  // componentWillMount: function() {
  //   this.initBatchViewbaleTextFiled();
  //   this.clearErrorTextBatchViewbaleTextFiled();
  // },
  // componentWillUnmount: function() {
  //   this.clearErrorTextBatchViewbaleTextFiled();
  // },
  render: function() {
    return (
      <div className="pop-manage-detail-content">
        {this._renderDetail()}
      </div>
      )

  },
});
module.exports = DimBasic;
