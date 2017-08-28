import React, { Component, PropTypes } from 'react';
import find from 'lodash-es/find';
import CircularProgress from 'material-ui/CircularProgress';

import ReduxDecorator from 'decorator/ReduxDecorator.jsx';

import {
  getChartDataByCustomer,
  getChartDataByBuilding,
  getChartMinYear,
  initStore,
} from 'actions/save_effect_action';

import CurrentUserCustomerStore from 'stores/CurrentUserCustomerStore.jsx';
import HierarchyStore from 'stores/HierarchyStore.jsx';
import OverviewStore from 'stores/save_effect/overview_store';

import ActionComp from 'controls/action_comp.jsx';

import EffectByYear from './effect_by_year.jsx';

const currentYear = new Date().getFullYear();

function getChartData(hierarchyId, year, isCustomer) {
  if( isCustomer ) {
    return getChartDataByCustomer(hierarchyId, year);
  }
  return getChartDataByBuilding(hierarchyId, year);
}

@ReduxDecorator
export default class SaveEffectOverview extends Component {
  static contextTypes = {
    hierarchyId: PropTypes.number
  };
  static calculateState = (state, props, ctx) => {
    return {
      chartData: OverviewStore.getOverview(),
      minYear: OverviewStore.getMinYear(),
    }
  };
  static getStores = () => [OverviewStore];
  static contextTypes = {
    hierarchyId: PropTypes.string,
    router: PropTypes.object,
  };
  constructor(props, ctx) {
    super(props);
    this.state = {
      year: currentYear
    }
    initStore();
    getChartMinYear(ctx.hierarchyId, ctx.hierarchyId + '' === props.router.params.customerId);
  }
  componentWillReceiveProps(nextProps, nextCtx) {
    if( nextCtx.hierarchyId !== this.context.hierarchyId ) {
      initStore();
      this.setState((state, props) => {
        return {...{
          year: currentYear
        }, ...SaveEffectOverview.calculateState(state, props, nextCtx)};
      });
      getChartMinYear(nextCtx.hierarchyId, nextCtx.hierarchyId + '' === nextProps.router.params.customerId);
    }
  }
	render() {
    let isCustomer = this.context.hierarchyId + '' === this.props.router.params.customerId,
    hierarchyName = find( CurrentUserCustomerStore.getAll().concat(HierarchyStore.getBuildingList()), 
      hier => hier.Id === this.context.hierarchyId
    ).Name ,
    {minYear, chartData, year} = this.state;
    if( minYear === null ) {
      return (<div className='flex-center'>{'暂无节能效果'}</div>);
    }
    let byYearProps = {
      isCustomer,
      year: year
    };
    if( year < currentYear ) {
      byYearProps.onRight = () => {
        getChartData(this.context.hierarchyId, year + 1, isCustomer);
        this.setState((state, props) => {
          return {
            year: state.year + 1,
            chartData: undefined,
          }
        });
      }
    }
    if( year > minYear ) {
      byYearProps.onLeft = () => {
        getChartData(this.context.hierarchyId, year - 1, isCustomer);
        this.setState((state, props) => {
          return {
            year: state.year - 1,
            chartData: undefined,
          }
        });
      }
    }
		return (
      <div className='jazz-save-effect-overview'>
	      <header className='overview-header'>{hierarchyName + I18N.SaveEffect.OverviewLabel}</header>
        {minYear ? 
        <div>
          <ActionComp triggerKey={this.context.hierarchyId} action={() => {
            getChartData(this.context.hierarchyId, year, isCustomer);
          }}/>
          {chartData ? 
          <EffectByYear {...byYearProps} data={this.state.chartData} /> :
          <div className='flex-center' style={{height: 305}}><CircularProgress mode="indeterminate" size={80} /></div>
          }
        </div> :
        <div className='flex-center' style={{height: 305}}><CircularProgress mode="indeterminate" size={80} /></div>}
      </div>
		);
	}
}
