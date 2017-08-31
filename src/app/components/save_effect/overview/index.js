import React, { Component, PropTypes } from 'react';
import find from 'lodash-es/find';
import CircularProgress from 'material-ui/CircularProgress';

import ReduxDecorator from 'decorator/ReduxDecorator.jsx';

import {
  getChartDataByCustomer,
  getChartDataByBuilding,
  getChartMinYear,
  getBuildingShow,
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
      classData: OverviewStore.getClassificationData(),
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
      year: currentYear,
      showCommodity: true,
    }
    // initStore();
    getChartMinYear(ctx.hierarchyId, ctx.hierarchyId + '' === props.router.params.customerId);
  }
  componentWillReceiveProps(nextProps, nextCtx) {
    if( nextCtx.hierarchyId !== this.context.hierarchyId ) {
      initStore();
      this.setState((state, props) => {
        return {...{
          year: currentYear,
          showCommodity: true,
        }, ...SaveEffectOverview.calculateState(state, props, nextCtx)};
      });
      getChartMinYear(nextCtx.hierarchyId, nextCtx.hierarchyId + '' === nextProps.router.params.customerId);
    }
  }
	render() {
    let hierarchyId = this.context.hierarchyId,
    isCustomer = hierarchyId + '' === this.props.router.params.customerId,
    hierarchyName = find( CurrentUserCustomerStore.getAll().concat(HierarchyStore.getBuildingList()), 
      hier => hier.Id === hierarchyId
    ).Name ,
    {minYear, chartData, year, showCommodity} = this.state;
    if( minYear === null ) {
      return (<div className='flex-center'>{I18N.SaveEffect.Tip}</div>);
    }
    let byYearProps = {
      isCustomer,
      year: year,
      showCommodity: showCommodity,
      switchTab: (idx) => {
        return () => {
          let _showCommodity = true;
          if( idx === 0 ) {
            getChartData(hierarchyId, year, isCustomer);
          } else {
            _showCommodity = false;
            getBuildingShow(hierarchyId, year);
          }
          this.setState((state, props) => {
            return {showCommodity: _showCommodity};
          });
        }
      }
    };
    if( year < currentYear ) {
      byYearProps.onRight = () => {
        let _year = year + 1;
        if( showCommodity ) {
          getChartData(hierarchyId, _year, isCustomer);
        } else {
          getBuildingShow(hierarchyId, _year);
        }
        this.setState((state, props) => {
          return {
            year: _year,
          }
        });
      }
    }
    if( year > minYear ) {
      byYearProps.onLeft = () => {
        let _year = year - 1;
        if( showCommodity ) {
          getChartData(hierarchyId, _year, isCustomer);
        } else {
          getBuildingShow(hierarchyId, _year);
        }
        this.setState((state, props) => {
          return {
            year: state.year - 1,
          }
        });
      }
    }
		return (
      <div className='jazz-save-effect-overview'>
	      <header className='overview-header'>{hierarchyName + I18N.SaveEffect.OverviewLabel}</header>
        {minYear ? 
        <div>
          <ActionComp triggerKey={hierarchyId} action={() => {
            getChartData(hierarchyId, year, isCustomer);
          }}/>
          {chartData ? 
          <EffectByYear {...byYearProps} data={this.state.chartData} classData={this.state.classData} /> :
          <div className='flex-center' style={{height: 305}}><CircularProgress mode="indeterminate" size={80} /></div>
          }
        </div> :
        <div className='flex-center' style={{height: 305}}><CircularProgress mode="indeterminate" size={80} /></div>}
      </div>
		);
	}
}
