import React, { Component } from 'react';
import util from 'util/Util.jsx';

function formatDate(data){
  return data===null?'—':util.getLabelData(data)
}
export default class EffectReport extends Component {

  render(){
    var {data}=this.props;
    return(
      <div className="save-effect-total">
        <div>
                <header className='report-sum-header hiddenEllipsis'>
                  <em className='report-sum-icon icon-cost_saving'/>
                  <span>{I18N.SaveEffect.Table.TotalSavingCost}</span>
                </header>
                <div className='report-sum-content'>
                  <span className='report-sum-value'>{formatDate(data.TotalSavingCost)}</span>
                  <span className='report-sum-unit'>{'RMB'}</span>
                </div>
          </div>
            <div>
                <header className='report-sum-header hiddenEllipsis'>
                  <em className='report-sum-icon icon-cost_saving'/>
                  <span>{I18N.SaveEffect.Table.TotalSavingStandardCoal}</span>
                </header>
                <div className='report-sum-content'>
                  <span className='report-sum-value'>{formatDate(data.TotalSavingStandardCoal)}</span>
                  <span className='report-sum-unit'>{'kgce'}</span>
                </div>
          </div>
            <div>
                <header className='report-sum-header hiddenEllipsis'>
                  <em className='report-sum-icon icon-cost_saving'/>
                  <span>{I18N.SaveEffect.Table.TotalSavingWater}</span>
                </header>
                <div className='report-sum-content'>
                  <span className='report-sum-value'>{formatDate(data.TotalSavingWater)}</span>
                  <span className='report-sum-unit'>{'m²'}</span>
                </div>
          </div>
      </div>
    )
    
  }
}