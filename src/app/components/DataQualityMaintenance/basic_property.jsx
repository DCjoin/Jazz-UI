import React, { Component } from 'react';
import PropTypes from 'prop-types';
import DataQualityMaintenanceAction from 'actions/data_quality_maintenance.jsx';
import DataQualityMaintenanceStore from 'stores/data_quality_maintenance.jsx';
var createReactClass = require('create-react-class');

// 组织园区
let Html1 = createReactClass({
  propTypes: {
   id: PropTypes.string,
   data: PropTypes.object,
 },
 render: function() {
   return (
   <div>
     <div className="basicline">
        <div className="title">{I18N.VEE.BasicProperty.Code}</div>
        <div className="content">编码</div>
      </div>
   </div>)
 }
});

// 网关和表计
let Html2 = createReactClass({
   propTypes: {
    id: PropTypes.string,
    data: PropTypes.object,
  },
  render: function() {
    return (
    <div>
      <div className="basicline">
        <div className="title">{I18N.VEE.BasicProperty.Code}</div>
        <div className="content">8797897</div>
      </div>
      <div className="basicline">
        <div className="title">{I18N.VEE.BasicProperty.Relate}</div>
        <div className="content">2222222222222</div>
      </div>
      <div className="basicline">
        <div className="title">{I18N.VEE.BasicProperty.DeviceType}</div>
        <div className="content">3333333333333</div>
      </div>
      <div className="basicline">
        <div className="title">{I18N.VEE.BasicProperty.DeviceTypeNumber}</div>
        <div className="content">444444444444444</div>
      </div>
    </div>)
  }
});

// 设备点
let Html3 = createReactClass({
  propTypes: {
   id: PropTypes.string,
   data: PropTypes.object
 },
 render: function() {
   return (
   <div>
     <div className="tagbasicline">
        <div>
          <p>{I18N.VEE.BasicProperty.CollectionType}</p>
          <p className='content'>mmmmmmmm</p>
        </div>
        <div>
          <p>{I18N.VEE.BasicProperty.Code}</p>
          <p className='content'>表计</p>
        </div>
        <div>
          <p>{I18N.VEE.BasicProperty.WatchCode}</p>
          <p className='content'>表计</p>
        </div>
        <div>
          <p>{I18N.VEE.BasicProperty.Channel}</p>
          <p className='content'>表计</p>
        </div>
     </div>
     <div className="tagbasicline">
        <div>
          <p>{I18N.VEE.BasicProperty.CollectionTime}</p>
          <p className='content'>表计</p>
        </div>
     </div>
     <div className="tagbasicline">
        <div>
          <p>{I18N.VEE.BasicProperty.ComputeType}</p>
          <p className='content'>表计</p>
        </div>
        <div>
          <p>{I18N.VEE.BasicProperty.IsAllCompute}</p>
          <p className='content'>表计</p>
        </div>
     </div>
     <div className="tagbasicline">
        <div>
          <p>{I18N.VEE.BasicProperty.Medium}</p>
          <p className='content'>表计</p>
        </div>
        <div>
          <p>{I18N.VEE.BasicProperty.Unit}</p>
          <p className='content'>表计</p>
        </div>
     </div>
     <div className="tagbasicline">
        <div>
          <p>{I18N.VEE.BasicProperty.ResourceTag}</p>
          <p className='content'>表计</p>
        </div>
     </div>
     <div className="tagbasicline">
        <div>
          <p>{I18N.VEE.BasicProperty.Rate}</p>
          <p className='content'>表计</p>
        </div>
        <div>
          <p>{I18N.VEE.BasicProperty.Offset}</p>
          <p className='content'>表计</p>
        </div>
     </div>
     <div className="lastline">
        <p>{I18N.VEE.BasicProperty.Note}</p>
        <p className='content'>表计就发货速度加咖啡和空间撒繁华落尽撒旦画法律框架的萨芬好了撒回复荆防颗粒撒酒疯附近可看的撒拉飞机按时</p>
     </div>
   </div>)
 }
})
export default class Basic extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pageData: {},
    };
  }
  componentDidMount () {
    // DataQualityMaintenanceStore.addListDataListener(this._onDataChanged);
    let params = {
      NodeType:  this.props.nodeData.get("NodeType")
    };
    // DataQualityMaintenanceAction.getBasicPageData(params);
  }
  componentWillUnmount() {
    // DataQualityMaintenanceStore.removeListDataListener(this._onDataChanged);
  }
  _onDataChanged = (pageData) => {
    this.setState({pageData: pageData})
  }
  render() {
    let content = null,
        nodetype = this.props.nodeData.get("NodeType");
    switch(nodetype){
      case 0:
        content = <Html1 />;
        break;
      case 1:
        content = <Html1 />;
        break;
      case 5:  // 表计
          content = <Html2 />;
          break;
      case 999:
          content=<Html3 />;
          break;
    }
    return(
      <div className="basic_property">
          {content}
      </div>
    )
  }
}