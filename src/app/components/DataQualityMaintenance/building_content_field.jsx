import React, { Component } from 'react';
import PropTypes from 'prop-types';
import DataQualityMaintenanceAction from 'actions/data_quality_maintenance.jsx';
import DataQualityMaintenanceStore from 'stores/data_quality_maintenance.jsx';
import Panel from 'controls/toggle_icon_panel.jsx';
import _ from 'lodash-es';
import ViewableMap from 'controls/ViewableMap.jsx';
import {FontIcon} from 'material-ui';
import classnames from 'classnames';
import ViewableTextField from 'controls/ViewableTextField.jsx';
import Spin from '@emop-ui/piano/spin';

var Admin=({admin})=>{
  var {Id,Name,Title,Telephone,Email}=admin;
    return(
      <div className="data-quality-building-basic-admin" id={Id}>
        <div className="row">
          <div className="name" title={Name}>{Name}</div>
          <div className="title" title={Title}>{Title}</div>
        </div>
        <div className="row">
          <FontIcon className='icon-massive-phone' color={"#999999"} style={{fontSize:'14px'}}/>
          <div className="text" title={Telephone} style={{marginLeft:'6px'}}>{Telephone}</div>
        </div>
        <div className="row">
        <FontIcon className='icon-email' color={"#999999"} style={{fontSize:'14px'}}/>
          <div className="text" title={Email} style={{marginLeft:'6px'}}>{Email}</div>
        </div>
      </div>
)}

export default class BuildingContent extends Component {

  static contextTypes = {
    router: PropTypes.object,
  };

  constructor(props) {
    super(props);

    this.state = {
      building: null,
    };

    this._onChanged = this._onChanged.bind(this);

  }

  _onChanged(){
    this.setState({
      building:DataQualityMaintenanceStore.getBuilding()
    })
  }

  _renderHeader() {
    var tagNameProps = {
      ref: 'tagName',
      isViewStatus: true,
      title: I18N.Setting.KPI.Group.BuildingConfig.Name,
      defaultValue: this.props.nodeData.get('Name') || '',
      isRequired: true,
    };
    return (
      <div className="pop-manage-detail-header" style={{paddingTop:'10px',paddingLeft:'20px',paddingBottom:'6px'}}>
        <div className={classnames("pop-manage-detail-header-name", "jazz-header")} style={{position: 'relative'}}>
          <ViewableTextField  {...tagNameProps} />
        <div className={classnames("pop-user-detail-tabs","data-quality-tabs")}>
                  <span className={classnames({
          "pop-user-detail-tabs-tab": true,
          "selected": true
        })} data-tab-index="1">{I18N.VEE.Basic}</span>
                </div>

        </div>
      </div>
      );
    }

    _renderContent() {

      if(this.state.building===null){
        return(<div className="flex-center">
        <Spin/>
      </div>)
      }
      var style = {
        display: 'flex',
        paddingLeft:'20px'
      };
      var {Code ,IndustryId ,ZoneId,Location,Administrators}=this.state.building.toJS();
      return (
        <div className="data-quality-building-basic" style={style}>
        {Code && Code!==0 && <div className="section">
            <div className="title">{I18N.VEE.BasicProperty.Code}</div>
            <div className="text">{Code}</div>
          </div>}
          {IndustryId && IndustryId!==0 && <div className="section">
            <div className="title">{I18N.Setting.Building.Industry}</div>
            <div className="text">{_.find(DataQualityMaintenanceStore.getIndustry(),industry=>industry.Id===IndustryId).Comment}</div>
          </div>}
          {ZoneId && ZoneId!==0 && <div className="section">
            <div className="title">{I18N.Setting.Building.Zone}</div>
            <div className="text">{_.find(DataQualityMaintenanceStore.getZone(),zone=>zone.Id===ZoneId).Comment}</div>
          </div>}
          {Location && (Location.Province || Location.Address) && <div className="section">
          <ViewableMap title={I18N.Setting.Building.Address} address={Location.Province || Location.Address} lng={Location.Longitude}  lat={Location.Latitude}  isView={true}></ViewableMap>
          </div>}
          {Administrators.length>0 &&
            <div className="section">
            <div className="title">{I18N.Setting.CustomerManagement.Administrator}</div>
            <div style={{display:'flex',flexWrap:'wrap'}}>{Administrators.map(administrator=><Admin admin={administrator}/>)}</div>
            </div>}
        </div>
        );
}


  componentDidMount() {
    DataQualityMaintenanceStore.addChangeListener(this._onChanged);
    DataQualityMaintenanceAction.getBuilding(parseInt(this.context.router.params.customerId),this.props.nodeData.get('Id'));
  }

  componentWillReceiveProps(nextProps){
    if(nextProps.nodeData.get("Id")!==this.props.nodeData.get('Id')){
      this.setState({
        building:null
      },()=>{
        DataQualityMaintenanceAction.getBuilding(parseInt(this.context.router.params.customerId),nextProps.nodeData.get('Id'));
      })
    }
  }

  componentWillUnmount() {
    DataQualityMaintenanceStore.removeChangeListener(this._onChanged);
  }

  render(){

    return (
      <div className={classnames({
        'jazz-ptag-panel': true,
        "jazz-ptag-left-fold": !this.props.showLeft,
        "jazz-ptag-left-expand": this.props.showLeft,
        "jazz-ptag-right-fold": !this.props.showRawDataList,
        "jazz-ptag-right-expand": this.props.showRawDataList

      })} style={{top:'56px',left:this.props.showLeft?'321px':'0'}}>
      <Panel onToggle={this.props.onToggle} isFolded={this.props.showLeft} toggleEnabled={false}>
        {this._renderHeader()}
        {this._renderContent()}
      </Panel>
    </div>
      );
  }
}

BuildingContent.defaultProps={
  showLeft:true,
  showRawDataList:false,
}