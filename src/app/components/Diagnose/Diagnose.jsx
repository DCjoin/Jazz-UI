import React, { Component } from 'react';
import LabelList from './LabelList.jsx';

export default class Diagnose extends Component {

render(){

  return(
    <div className="diagnose-panel">
      <LabelList isFromProbem={false}/>
    </div>
  )
}
}