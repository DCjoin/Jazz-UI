'use strict';

import React from "react";
import classnames from "classnames";
import { Checkbox } from 'material-ui';
import Immutable from 'immutable';
import { formStatus } from '../../../constants/FormStatus.jsx';
import { dataStatus } from '../../../constants/DataStatus.jsx';
import ViewableTextField from '../../../controls/ViewableTextField.jsx';
import ViewableTextFieldUtil from '../../../controls/ViewableTextFieldUtil.jsx';
import ViewableDropDownMenu from '../../../controls/ViewableDropDownMenu.jsx';
import Regex from '../../../constants/Regex.jsx';
import AdminList from '../../customer/AdminList.jsx';
import HierarchyStore from '../../../stores/hierarchySetting/HierarchyStore.jsx';
import ImageUpload from '../../../controls/ImageUpload.jsx';
//import Path from '../../../constants/Path.jsx';
import ViewableMap from '../../../controls/ViewableMap.jsx';
import Config from 'config';


var BuildingBasic = React.createClass({

  propTypes: {
    selectedNode: React.PropTypes.object,
    merge: React.PropTypes.func,
    formStatus: React.PropTypes.string,
    setEditBtnStatus: React.PropTypes.func
  },
  mixins: [React.addons.LinkedStateMixin, ViewableTextFieldUtil],
  _locationChanged(lng, lat, address) {
    //  console.debug(lng+","+lat+","+address);
    var value = this.props.selectedNode.get('Location');
    if (value) {
      value = value.set('Province', address);
      value = value.set('Latitude', lat);
      value = value.set('Longitude', lng);
    } else {
      value = Immutable.fromJS({
        Province: address,
        Latitude: lat,
        Longitude: lng
      })
    }

    this.props.merge({
      path: 'Location',
      value
    });
  },
  _renderDetail: function() {
    var {Code, Comment, AssoiciatedTagCountP, AssoiciatedTagCountV, IndustryId, ZoneId, CalcStatus, BuildingPictureIds, Administrators} = this.props.selectedNode.toJS(),
      isView = this.props.formStatus === formStatus.VIEW,
      isAdd = this.props.formStatus === formStatus.ADD,
      adminList = null,
      buildingPictureIds = Immutable.fromJS(BuildingPictureIds || []),
      that = this;
    var codeProps = {
        isViewStatus: isView,
        title: I18N.format(I18N.Setting.Organization.Code, I18N.Common.Glossary.Building),
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
      },
      calStatusProps = {
        checked: (CalcStatus != true && CalcStatus != false) ? true : CalcStatus,
        disabled: isView,
        label: I18N.Platform.ServiceProvider.CalcStatus,
        onCheck: (event, checked) => {
          this.props.merge({
            value: checked,
            path: "CalcStatus"
          })
        }
      },
      parmas = "&width=" + 480 + "&height=" + 320 + "&mode=" + 1,
      imageProps = {
        clip: false,
        imageUrl: buildingPictureIds.size !== 0 ? "url(" + Config.ServeAddress + "/BuildingPicture.aspx?pictureId=" + BuildingPictureIds[0] + parmas + ")" : '',
        isViewState: isView,
        updateTips: buildingPictureIds.size === 0 ? I18N.Setting.Building.AddImage : I18N.Setting.Building.UpdateImage,
        imageDidChanged: value => {
          this.props.merge({
            value: [value.pictureId],
            path: "BuildingPictureIds"
          })
        },
        wrapperWidth: 480,
        wrapperHeight: 320,
        uploadUrl: 'BuildingPicture.aspx'
      };
    var industrySelectedIndex = 0,
      industryItems = [];
    HierarchyStore.getAllIndustries().forEach((industry, index) => {
      if (industry.Id === IndustryId) {
        industrySelectedIndex = index
      }
      industryItems.push({
        payload: index,
        text: industry.Comment
      });
    });
    var zoneSelectedIndex = 0,
      zoneItems = [];
    HierarchyStore.getAllZones().forEach((zone, index) => {
      if (zone.Id === ZoneId) {
        zoneSelectedIndex = index
      }
      zoneItems.push({
        payload: index,
        text: zone.Comment
      });
    });
    var industryProps = {
        isViewStatus: isView,
        title: I18N.Setting.Building.Industry,
        selectedIndex: industrySelectedIndex,
        textField: "text",
        dataItems: industryItems,
        didChanged: (idx) => {
          this.props.merge({
            value: HierarchyStore.getAllIndustries()[idx].Id,
            path: "IndustryId"
          })
        }
      },
      zoneProps = {
        isViewStatus: isView,
        title: I18N.Setting.Building.Zone,
        selectedIndex: zoneSelectedIndex,
        textField: "text",
        dataItems: zoneItems,
        didChanged: (idx) => {
          this.props.merge({
            value: HierarchyStore.getAllZones()[idx].Id,
            path: "ZoneId"
          })
        }
      };
    var locationText = this.props.selectedNode.getIn(["Location", "Province"]);
    var lng = this.props.selectedNode.getIn(["Location", "Longitude"]);
    var lat = this.props.selectedNode.getIn(["Location", "Latitude"]);
    var map = <ViewableMap address={locationText} lng={lng}  lat={lat} isAdd={isAdd} isView={isView} didChanged={this._locationChanged}></ViewableMap>;
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
          <div className="pop-customer-detail-content-left-item">
            <ViewableDropDownMenu {...industryProps}/>
          </div>
          <div className="pop-customer-detail-content-left-item">
            <ViewableDropDownMenu {...zoneProps}/>
          </div>
          {locationText || !isView ? <div className="pop-customer-detail-content-left-item">
            {map}
          </div> : null}
          <div className="pop-user-detail-content-item">
            <Checkbox {...calStatusProps} />
          </div>
          {Comment || !isView ? <div className={classnames("pop-user-detail-content-item", "jazz-customer-comment")}>
                    <ViewableTextField {...commentProps}/>
                  </div> : null}

        </div>
        {buildingPictureIds.size === 0 && isView ? null : <div className="pop-customer-detail-content-right pop-customer-detail-info-logo">
          <ImageUpload {...imageProps} />
        </div>}
      </div>
      {adminList}
     <div className='pop-admins section-panel'>
        <div className='pop-admin-container'>
          <div className='jazz-buildingbasic-tag-item' style={{
        width: '200px'
      }}>
            <div className='title'>{I18N.Setting.Building.PTagCount}</div>
            <div className='content'>{AssoiciatedTagCountP || 0}</div>
          </div>
          <div className='jazz-buildingbasic-tag-item'>
            <div className='title'>{I18N.Setting.Building.VTagCount}</div>
            <div className='content'>{AssoiciatedTagCountV || 0}</div>
          </div>
        </div>

      </div>
      </div>
      )

  },
  componentWillMount: function() {
    if (this.props.selectedNode.get('Code'))
      if (this.props.selectedNode.get('Code').length <= 200) {
        this.props.setEditBtnStatus(false);
    }
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
module.exports = BuildingBasic;
