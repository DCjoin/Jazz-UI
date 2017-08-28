import React, { Component } from 'react';
import classnames from 'classnames';

import CircularProgress from 'material-ui/CircularProgress';

import SwitchBar from 'controls/SwitchBar.jsx';

import EffectReport from './effect_report.jsx';
import BuildingTable from './building_table.jsx';

export default class EffectByYear extends Component {
	render() {
    let { data, classData, isCustomer, year, showCommodity, onLeft, onRight, switchTab } = this.props,
    content = (<div className='flex-center' style={{height: 300}}><CircularProgress size={80}/></div>);
    
    if( showCommodity && data ) {
      content = data.map( item =>
        (<EffectReport isCustomer={isCustomer} data={item} year={year}/>)
      );
    } else if( classData ) {
        content = classData.map( item =>
          (<BuildingTable {...item}/>)
        );
    }
		return (
			<div className='effect-card'>
        <header className='effect-card-header'>
          <span className='effect-card-header-text'>{'年度节能效果'}</span>
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
				<div className='effect-card-content'>
          {isCustomer && <div className='effect-card-content-tabs'>
            <a href='javascript:void(0)' onClick={switchTab(0)} className={classnames('effect-card-content-tab', {'actived': showCommodity})}>{'按介质展示'}</a>
            <a href='javascript:void(0)' onClick={switchTab(1)} className={classnames('effect-card-content-tab', {'actived': !showCommodity})}>{'按建筑展示'}</a>
          </div>}
          {content}
        </div>
			</div>
		);
	}
}
