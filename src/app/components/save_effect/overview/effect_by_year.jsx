import React, { Component } from 'react';
import classnames from 'classnames';

import CircularProgress from 'material-ui/CircularProgress';

import SwitchBar from 'controls/SwitchBar.jsx';

import EffectReport from './effect_report.jsx';
import BuildingTable from './building_table.jsx';
import EffectTotal from './effect_total.jsx';

export default class EffectByYear extends Component {
	render() {
    let { data, classData, isCustomer, year, showCommodity, onLeft, onRight, switchTab,totalData } = this.props,
    total=null,
    content = null;

    if(totalData){
      total=<EffectTotal data={totalData}/>;
    }
    
    
    if( showCommodity) {
      if( data && data.length > 0 ) {        
        content = data.map( item =>
          (<EffectReport isCustomer={isCustomer} data={item} year={year}/>)
        );
      } else if( data && data.length === 0 ) {
        content = (<div className='flex-center' style={{height: 200}}>{I18N.SaveEffect.NoDateTip}</div>);
      }
    } else {
      if( classData && classData.length > 0 ){
        content = classData.map( item =>
          (<BuildingTable {...item} year={year}/>)
        );
      } else if( classData && classData.length === 0 ) {
        content = (<div className='flex-center' style={{height: 200}}>{I18N.SaveEffect.NoDateTip}</div>);
      }
    }
		return (
			<div className='effect-card'>
        <header className='effect-card-header'>
          <span className='effect-card-header-text'>{I18N.SaveEffect.ByYear}</span>
          <SwitchBar 
            iconStyle={{
              color: '#505559',
              cursor: 'pointer',
              opacity: 1,
              backgroundColor: '#fff',
              width: 30,
              height: 30,
              lineHeight: '30px',
              textAlign: 'center',
              borderRadius: 2,
              border: '1px solid #e6e6e6',
            }}
            className='switch-year'
            label={year}
            onLeft={onLeft}
            onRight={onRight}/>
        </header>

				{total!==null && content!==null?<div className='effect-card-content'>
          {total}
          {isCustomer && <div className='effect-card-content-tabs'>
            <a href='javascript:void(0)' onClick={switchTab(0)} className={classnames('effect-card-content-tab', {'actived': showCommodity})}>{I18N.SaveEffect.OrderByCommo}</a>
            <a href='javascript:void(0)' onClick={switchTab(1)} className={classnames('effect-card-content-tab', {'actived': !showCommodity})}>{I18N.SaveEffect.OrderByBuilding}</a>
          </div>}
          {content}
        </div>:<div className='effect-card-content'>
                <div className='flex-center' style={{height: 300}}><CircularProgress size={80}/></div>
                </div>}
			</div>
		);
	}
}
