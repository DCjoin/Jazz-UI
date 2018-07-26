import React, { Component } from 'react';
import PropTypes from 'prop-types';
import DataQualityMaintenanceAction from 'actions/data_quality_maintenance.jsx';
import DataQualityMaintenanceStore from 'stores/data_quality_maintenance.jsx';
var createReactClass = require('create-react-class');

// 返回采集周期
function switchCalculationStep (step){
  switch(step){
    case -1:
      return I18N.Common.CaculationType.Non
    case 0:
      return I18N.Common.AggregationStep.Minute
    case 1:
      return I18N.Common.AggregationStep.Hourly
    case 2:  // 表计
      return I18N.Common.AggregationStep.Daily
    case 3:
      return I18N.Common.AggregationStep.Monthly
    case 4:
      return I18N.Common.AggregationStep.Yearly
    case 5:
      return I18N.Common.AggregationStep.Weekly
    case 6:
      return I18N.Common.AggregationStep.Min15
    case 7:
      return I18N.Common.AggregationStep.Min30
    case 8:
      return I18N.Common.AggregationStep.Hour2
    case 9:
      return I18N.Common.AggregationStep.Hour4
    case 10:
      return I18N.Common.AggregationStep.Hour6
    case 11:
      return I18N.Common.AggregationStep.Hour8
    case 12:
      return I18N.Common.AggregationStep.Hour12
  }
}
// 返回汇总方式
function switchCalculationType(type){
  switch(type){
    case 0:
      return I18N.Common.CaculationType.Non
    case 1:
      return I18N.Common.CaculationType.Sum
    case 2:  // 表计
      return I18N.Common.CaculationType.Avg
    case 3:
      return I18N.Common.CaculationType.Max
    case 4:
      return I18N.Common.CaculationType.Min
  }
}
// 组织园区
let Html1 = createReactClass({
  propTypes: {
   id: PropTypes.string,
   data: PropTypes.object,
 },
 render: function() {
   let pageData = this.props.pageData;
   return (
   <div>
     { pageData.Code ? <div className="basicline">
        <div className="title">{I18N.VEE.BasicProperty.Code}</div>
        <div className="content">{pageData.Code}</div>
      </div> : null }
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
    let pageData = this.props.pageData;
    return (
    <div>
      {
        pageData.Code != '' && pageData.Code != null
        ? <div className="basicline">
            <div className="title">{I18N.VEE.BasicProperty.Code}</div>
            <div className="content">{pageData.Code}</div>
          </div>
        : null
      }
      {
        pageData.PhysicalStatus != '' && pageData.PhysicalStatus != null
        ? <div className="basicline">
            <div className="title">{I18N.VEE.BasicProperty.Relate}</div>
            <div className="content">{pageData.PhysicalStatus ? I18N.VEE.onlineText : I18N.VEE.offlineText}</div>
          </div>
        : null
      }
      {
        pageData.Type !=null
        ? <div className="basicline">
            <div className="title">{I18N.VEE.BasicProperty.DeviceType}</div>
            <div className="content">{pageData.Type}</div>
          </div>
        : null
      }
      {
        pageData.Class != null
        ? <div className="basicline">
            <div className="title">{I18N.VEE.BasicProperty.DeviceTypeNumber}</div>
            <div className="content">{pageData.Class}</div>
          </div>
        : null
      }
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
  let pageData = this.props.pageData,
      CollectionMethod = '';
  if (pageData.CollectionMethod == 1) {
    CollectionMethod = I18N.Common.Glossary.Auto;
  } else if (pageData.CollectionMethod == 2) {
    CollectionMethod = I18N.Setting.Tag.Manual;
  }
   return (
   <div>
     <div className="tagbasicline">
        {
          CollectionMethod ? <div>
                                <p>{I18N.VEE.BasicProperty.CollectionType}</p>
                                <p className='content'>{CollectionMethod}</p>
                              </div>
                            : null
        }
        {
          pageData.Code !=='' && pageData.Code !=null
          ? <div>
              <p>{I18N.VEE.BasicProperty.Code}</p>
              <p className='content'>{pageData.Code}</p>
            </div>
          : null
        }
        {
          pageData.MeterCode !=='' && pageData.MeterCode!=null
          ? <div>
              <p>{I18N.VEE.BasicProperty.WatchCode}</p>
              <p className='content'>{pageData.MeterCode}</p>
            </div>
          :null
        }
        {
          pageData.ChannelId !== '' && pageData.ChannelId!=null
          ? <div>
              <p>{I18N.VEE.BasicProperty.Channel}</p>
              <p className='content'>{pageData.ChannelId}</p>
            </div>
          : null
        }
     </div>
     <div className="tagbasicline">
        <div>
          <p>{I18N.VEE.BasicProperty.CollectionTime}</p>
          <p className='content'>{switchCalculationStep(pageData.CalculationStep)}</p>
        </div>
     </div>
      {
        pageData.CalculationType!= null && pageData.IsAccumulated!=null
        ?  <div className="tagbasicline">
                {
                  pageData.CalculationType !=='' && pageData.CalculationType!= null
                  ? <div>
                      <p>{I18N.VEE.BasicProperty.ComputeType}</p>
                      <p className='content'>{switchCalculationType(pageData.CalculationType)}</p>
                    </div>
                  : null
                }
                {
                  pageData.IsAccumulated !=='' && pageData.IsAccumulated!=null
                  ? <div>
                      <p>{I18N.VEE.BasicProperty.IsAllCompute}</p>
                      <p className='content'>{pageData.IsAccumulated ? I18N.Setting.DataAnalysis.Tou.CancelMulti : I18N.Setting.DataAnalysis.Tou.NotCancelMulti  }</p>
                    </div>
                  : null
                }
              </div>
          : null
      }
      {
        pageData.CommodityName!=null && pageData.UomName != null
        ? <div className="tagbasicline">
              {
                pageData.CommodityName !== '' && pageData.CommodityName!=null
                ?  <div>
                    <p>{I18N.VEE.BasicProperty.Medium}</p>
                    <p className='content'>{pageData.CommodityName}</p>
                  </div>
                : null
              }
              {
                pageData.UomName !=='' && pageData.UomName != null
                ? <div>
                    <p>{I18N.VEE.BasicProperty.Unit}</p>
                    <p className='content'>{pageData.UomName}</p>
                  </div>
                : null
              }
          </div>
        : null
      }

     {
       pageData.EnergyLabelName !=='' && pageData.EnergyLabelName !=null
       ? <div className="tagbasicline">
            <div>
              <p>{I18N.VEE.BasicProperty.ResourceTag}</p>
              <p className='content'>{pageData.EnergyLabelName }</p>
            </div>
          </div>
        : null
     }
     {
       pageData.Slope!= null && pageData.Offset!=null
       ? <div className="tagbasicline">
            {
              pageData.Slope !=='' && pageData.Slope!= null
              ? <div>
                  <p>{I18N.VEE.BasicProperty.Rate}</p>
                  <p className='content'>{pageData.Slope}</p>
                </div>
              : null
            }
            {
              pageData.Offset !=='' && pageData.Offset!=null
              ? <div>
                  <p>{I18N.VEE.BasicProperty.Offset}</p>
                  <p className='content'>{pageData.Offset}</p>
                </div>
              : null
            }
          </div>
        : null
     }
     {
       pageData.Comment !=='' && pageData.Comment != null
       ? <div className="lastline">
          <p>{I18N.VEE.BasicProperty.Note}</p>
          <p className='content'>{pageData.Comment }</p>
        </div>
        : null
      }
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
    DataQualityMaintenanceStore.addListDataListener(this._onDataChanged);
    let params = {
      NodeType:  this.props.nodeData.get("NodeType"),
      id: this.props.nodeData.get("Id"),
      SubType: this.props.nodeData.get("SubType")
    };
    DataQualityMaintenanceAction.getBasicPageData(params);
  }
    componentWillReceiveProps(nextProps){
      if(nextProps.nodeData.get("Id")!=this.props.nodeData.get("Id")){
        let params = {
          NodeType:  nextProps.nodeData.get("NodeType"),
          id: nextProps.nodeData.get("Id"),
          SubType: nextProps.nodeData.get("SubType")
        };
        DataQualityMaintenanceAction.getBasicPageData(params);
      }
    }
  componentWillUnmount() {
    DataQualityMaintenanceStore.removeListDataListener(this._onDataChanged);
  }
  _onDataChanged = (pageData) => {

    this.setState({pageData: pageData})
  }
  render() {
    let content = null,
        nodetype = this.props.nodeData.get("NodeType");
    switch(nodetype){
      case 0:
        content = <Html1 pageData={this.state.pageData} />;
        break;
      case 1:
        content = <Html1 pageData={this.state.pageData} />;
        break;
      case 5:
          content = <Html2 pageData={this.state.pageData} />;
          break;
      case 6:
          content = <Html2 pageData={this.state.pageData} />;
          break;
      case 999:
          content=<Html3 pageData={this.state.pageData} />;
          break;
    }
    return(
      <div className="basic_property">
          {content}
      </div>
    )
  }
}