'use strict';

import React from 'react';
import { CircularProgress, FontIcon, IconButton, IconMenu, DropDownMenu, Checkbox } from 'material-ui';
import classnames from "classnames";
import moment from 'moment';
import Regex from '../../constants/Regex.jsx';
import FlatButton from '../../controls/FlatButton.jsx';
import PlatformAction from '../../actions/PlatformAction.jsx';
import PlatformStore from '../../stores/PlatformStore.jsx';
import ViewableTextField from '../../controls/ViewableTextField.jsx';
import ViewableTextFieldUtil from '../../controls/ViewableTextFieldUtil.jsx';
import ViewableDatePicker from '../../controls/ViewableDatePickerByStatus.jsx';
import ViewableDropDownMenu from '../../controls/ViewableDropDownMenu.jsx';
import { formStatus } from '../../constants/FormStatus.jsx';
import Delete from '../../controls/OperationTemplate/Delete.jsx';
import Dialog from '../../controls/OperationTemplate/BlankDialog.jsx';
import ImageUpload from '../../controls/ImageUpload.jsx';
import assign from 'object-assign';
import Config from 'config';


let CustomerIdentity = React.createClass({
  mixins: [ViewableTextFieldUtil],
  propTypes: {
    provider: React.PropTypes.object,
    customerItem: React.PropTypes.object
  },
  _renderContent: function(isView) {
    var {SpId, FullName, Abbreviation, AboutLink, Logo, HomeBackground, LogoContent, HomeBackgroundContent} = this.props.customerItem;
    var providerFullNameProps = {
        isViewStatus: isView,
        title: I18N.Platform.ServiceProvider.FullName + (isView ? '' : I18N.Platform.ServiceProvider.FullNameEtc),
        defaultValue: FullName || "",
        isRequired: true,
        didChanged: value => {
          PlatformAction.mergeCustomer({
            value: value,
            path: "FullName"
          });
        }
      },
      providerAbbreviationProps = {
        isViewStatus: isView,
        title: I18N.Platform.ServiceProvider.Abbreviation + (isView ? '' : I18N.Platform.ServiceProvider.AbbreviationEtc),
        defaultValue: Abbreviation || "",
        isRequired: true,
        didChanged: value => {
          PlatformAction.mergeCustomer({
            value: value,
            path: "Abbreviation"
          });
        }
      },
      providerAboutProps = {
        isViewStatus: isView,
        title: I18N.Platform.ServiceProvider.About,
        defaultValue: AboutLink || "",
        isRequired: true,
        errorMessage: I18N.Platform.ServiceProvider.AboutUrlError,
        didChanged: value => {
          PlatformAction.mergeCustomer({
            value: value,
            path: "AboutLink"
          });
        }
      },
      parmas = "&width=" + 240 + "&height=" + 160 + "&mode=" + 1,
      logoImageProps = {
        clip: false,
        background: 'customer-background-logo',
        url: (LogoContent === null ? (Logo === null ? "url(" + Config.ServeAddress + "/Logo.aspx?ossKey=" + Logo + parmas + ")" : "") : "url(data:image/png;base64," + LogoContent + ")"),
        isViewState: isView,
        updateTips: LogoContent === null ? I18N.Platform.ServiceProvider.AddImage : I18N.Platform.ServiceProvider.UpdateImage,
        imageDidChanged: img => {
          this.props.merge({
            value: img,
            path: "LogoContent"
          });
        },
        wrapperWidth: 240,
        wrapperHeight: 160
      },
      backgroundImageProps = {
        clip: false,
        background: 'customer-background-logo',
        url: (HomeBackgroundContent === null ? (HomeBackground === null ? "url(" + Config.ServeAddress + "/Logo.aspx?ossKey=" + HomeBackground + parmas + ")" : "") : "url(data:image/png;base64," + HomeBackgroundContent + ")"),
        isViewState: isView,
        imageDidChanged: img => {
          this.props.merge({
            value: img,
            path: "HomeBackgroundContent"
          });
        },
        wrapperWidth: 240,
        wrapperHeight: 160,
      };

    return (
      <div className={"pop-user-detail-content"}>
        <div className="pop-user-detail-content-item">
          <ViewableTextField {...providerFullNameProps} />
        </div>
        <div className="pop-user-detail-content-item">
          <ViewableTextField {...providerAbbreviationProps} />
        </div>
        <div className="pop-user-detail-content-item">
          <ViewableTextField {...providerAboutProps} />
        </div>
        <div className="pop-user-detail-content-item">
          <ImageUpload {...logoImageProps} />
        </div>
        <div className="pop-user-detail-content-item">
          <ImageUpload {...backgroundImageProps} />
        </div>
        </div>
      );

  },
  componentWillMount: function() {
    PlatformAction.getCustomerIdentity(this.props.provider.Id);
    this.initBatchViewbaleTextFiled();
  },
  componentDidMount: function() {},
  componentWillUnmount: function() {},
  componentWillReceiveProps: function(nextProps) {
    if (nextProps.provider.Id != this.props.provider.Id) {
      this.clearErrorTextBatchViewbaleTextFiled();

    }
  },

  getInitialState: function() {
    return {
    };
  },
  render: function() {
    var that = this,
      isView = this.props.formStatus === formStatus.VIEW,
      isEdit = this.props.formStatus === formStatus.EDIT,
      isAdd = this.props.formStatus === formStatus.ADD;

    var content = this._renderContent(isView);
    if (!this.props.customerItem.SpId) {
      return (<div>{I18N.Platform.ServiceProvider.AddInfo}</div>);
    } else {
      return content;
    }

  },
});
module.exports = CustomerIdentity;
