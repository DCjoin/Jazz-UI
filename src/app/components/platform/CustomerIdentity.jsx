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
import ViewableDatePicker from '../../controls/ViewableDatePickerByStatus.jsx';
import ViewableDropDownMenu from '../../controls/ViewableDropDownMenu.jsx';
import { formStatus } from '../../constants/FormStatus.jsx';
import Delete from '../../controls/OperationTemplate/Delete.jsx';
import Dialog from '../../controls/OperationTemplate/BlankDialog.jsx';
import ImageUpload from '../../controls/ImageUpload.jsx';
import assign from 'object-assign';
import Config from 'config';


let CustomerIdentity = React.createClass({
  propTypes: {
    provider: React.PropTypes.object,
    customer: React.PropTypes.object
  },
  _renderContent: function(isView) {
    var {SpId, FullName, Abbreviation, AboutLink, Logo, HomeBackground, LogoContent, HomeBackgroundContent} = this.props.customer;
    var tips = isView ? null : (<div className="pop-user-detail-content-item">{I18N.Platform.ServiceProvider.Tips}</div>);
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
        regex: Regex.UrlRule,
        errorMessage: I18N.Platform.ServiceProvider.AboutUrlError,
        didChanged: value => {
          PlatformAction.mergeCustomer({
            value: value,
            path: "AboutLink"
          });
        }
      },
      logoImageProps = {
        id: 'logo',
        clip: false,
        background: 'customer-background-logo',
        imageUrl: (!LogoContent ? (!Logo ? "" : "url(" + Config.ServeAddress + "/Logo.aspx?ossKey=" + Logo + ")") : "url(data:image/png;base64," + LogoContent + ")"),
        isViewState: isView,
        updateTips: (!LogoContent && !Logo) ? I18N.Platform.ServiceProvider.AddImage : I18N.Platform.ServiceProvider.UpdateImage,
        imageDidChanged: img => {
          PlatformAction.mergeCustomer({
            value: img,
            path: "LogoContent"
          });
        },
        uploadUrl: null,
        wrapperWidth: 240,
        wrapperHeight: 160
      },
      backgroundImageProps = {
        id: 'background',
        clip: false,
        background: 'customer-background-logo',
        imageUrl: (!HomeBackgroundContent ? (!HomeBackground ? "" : "url(" + Config.ServeAddress + "/Logo.aspx?ossKey=" + HomeBackground + ")") : "url(data:image/png;base64," + HomeBackgroundContent + ")"),
        isViewState: isView,
        updateTips: (!HomeBackgroundContent && !HomeBackground) ? I18N.Platform.ServiceProvider.AddImage : I18N.Platform.ServiceProvider.UpdateImage,
        imageDidChanged: img => {
          PlatformAction.mergeCustomer({
            value: img,
            path: "HomeBackgroundContent"
          });
        },
        uploadUrl: null,
        wrapperWidth: 240,
        wrapperHeight: 160,
      };
    var imageFontStyle = {
      'font-size': '14px',
      'color': '#abafae',
      'margin-bottom': '6px'
    };
    return (
      <div className={"pop-user-detail-content"}>
        {tips}
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
          <div style={imageFontStyle}>{I18N.Platform.ServiceProvider.Logo}</div>
          <ImageUpload {...logoImageProps} />
        </div>
        <div className="pop-user-detail-content-item">
          <div style={imageFontStyle}>{I18N.Platform.ServiceProvider.Background}</div>
          <ImageUpload {...backgroundImageProps} />
        </div>
        </div>
      );

  },
  componentWillMount: function() {
    PlatformAction.getCustomerIdentity(this.props.provider.Id);
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
    if (!this.props.customer.SpId && isView) {
      return (<div>{I18N.Platform.ServiceProvider.AddInfo}</div>);
    } else {
      return content;
    }

  },
});
module.exports = CustomerIdentity;
