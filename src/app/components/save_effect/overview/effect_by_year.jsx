import React, { Component } from 'react';
import classnames from 'classnames';

import CircularProgress from 'material-ui/CircularProgress';

import SwitchBar from 'controls/SwitchBar.jsx';

import EffectReport from './effect_report.jsx';

export default class EffectByYear extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showCommodity: true
    };
  }
	render() {
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
            label={this.props.year}
            onLeft={this.props.onLeft}
            onRight={this.props.onRight}/>
        </header>
				<div className='effect-card-content'>
          {this.props.isCustomer && <div className='effect-card-content-tabs'>
            <a href='javascript:void(0)' className={classnames('effect-card-content-tab', {'actived': this.state.showCommodity})}>{'按介质展示'}</a>
            <a href='javascript:void(0)' className={classnames('effect-card-content-tab', {'actived': !this.state.showCommodity})}>{'按建筑展示'}</a>
          </div>}
          {this.props.data ? this.props.data.map( item =>
          (<EffectReport isCustomer={this.props.isCustomer} data={item} year={this.props.year}/>)
          ) : <div className='flex-center' style={{height: 300}}><CircularProgress size={80}/></div>}
        </div>
			</div>
		);
	}
}
