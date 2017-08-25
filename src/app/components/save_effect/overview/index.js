import React, { Component, PropTypes } from 'react';
import find from 'lodash-es/find';

import CurrentUserCustomerStore from 'stores/CurrentUserCustomerStore.jsx';
import HierarchyStore from 'stores/HierarchyStore.jsx';

import EffectByYear from './effect_by_year.jsx';

const currentYear = new Date().getFullYear();

export default class SaveEffectOverview extends Component {
  static contextTypes = {
    hierarchyId: PropTypes.number
  };
  constructor(props) {
    super(props);
    this.state = {
      year: currentYear
    }
  }
	render() {
    let isCustomer = this.context.hierarchyId + '' === this.props.router.params.customerId,
    hierarchyName = find( CurrentUserCustomerStore.getAll().concat(HierarchyStore.getBuildingList()), 
      hier => hier.Id === this.context.hierarchyId
    ).Name ;
    let byYearProps = {
      year: this.state.year
    };
    if( this.state.year < currentYear ) {
      byYearProps.onRight = () => {
        this.setState((state, props) => {
          return {
            year: state.year + 1
          }
        });
      }
    }
    if( true || this.state.year < currentYear ) {
      byYearProps.onLeft = () => {
        this.setState((state, props) => {
          return {
            year: state.year - 1
          }
        });
      }
    }
		return (
      <div className='jazz-save-effect-overview'>
		    <header className='overview-header'>{hierarchyName + I18N.SaveEffect.OverviewLabel}</header>
        <EffectByYear {...byYearProps} data={this.state.data} />
      </div>
		);
	}
}
