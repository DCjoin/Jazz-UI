'use strict';

import React from 'react';


let ExportChart = React.createClass({
  propTypes:{
    url:React.PropTypes.string
  },
  render(){
    return <iframe style={{display: 'none'}} ref='exportIframe'></iframe>;

  },
  exportFn(){
    var createElement = window.Highcharts.createElement,
        discardElement = window.Highcharts.discardElement,
        frame = this.refs.exportIframe,
        doc = frame.contentDocument;

    let url = '', data, name;
    let form = createElement('form', {
               method: 'post',
               action: url,
               target:''
           }, {
               display: 'none'
           }, doc.body);

     // add the data
     for (name in data) {
        createElement('input', {
            type: 'hidden',
            name: name,
            value: data[name]
        }, null, form);
     }

     // submit
     form.submit();

     // clean up
     discardElement(form);
  }
});
module.exports = ExportChart;
