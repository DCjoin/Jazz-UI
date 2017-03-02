'use strict';

import React from 'react';
import ReactDom from 'react-dom';
import ExportChartStore from '../../stores/Energy/ExportChartStore.jsx';

let ExportChart = React.createClass({
  propTypes:{
    url:React.PropTypes.string
  },
  render(){

    return <iframe style={{display: 'none'}} ref='exportIframe'></iframe>;
  },
  componentDidMount(){
    ExportChartStore.addChangeListener(this._exportFn);
  },
  componentWillUnmount(){
    ExportChartStore.removeChangeListener(this._exportFn);
  },
  _exportFn(){
    var createElement = window.Highcharts.createElement,
        discardElement = window.Highcharts.discardElement,
        frame = ReactDom.findDOMNode(this.refs.exportIframe),
        doc = frame.contentDocument;

    let url = ExportChartStore.getPath(),
        data = ExportChartStore.getExportParamsObj(),
        name;
    let form = createElement('form', {
               method: 'post',
               action: url,
               target:'_self'
           }, {
               display: 'none'
           }, doc.body);
if(url.indexOf('/Dashboard/ExportWidget')>=0){

     createElement('input', {
         type: 'hidden',
         name:'widgetId',
         value: data.widgetId,
     }, null, form);

}
else {
  for (name in data) {
     createElement('input', {
         type: 'hidden',
         name: name,
         value: JSON.stringify(data[name])
     }, null, form);
  }
}
     // add the data


     // submit
     form.submit();

     // clean up
     discardElement(form);
  }
});
module.exports = ExportChart;
