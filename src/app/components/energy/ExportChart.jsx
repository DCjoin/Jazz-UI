'use strict';

import React from 'react';
import ExportChartStore from '../../stores/energy/ExportChartStore.jsx';

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
        frame = this.refs.exportIframe.getDOMNode(),
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

     // add the data
     for (name in data) {
        createElement('input', {
            type: 'hidden',
            name: name,
            value: JSON.stringify(data[name])
        }, null, form);
     }

     // submit
     form.submit();

     // clean up
     discardElement(form);
  }
});
module.exports = ExportChart;
