import { expect } from 'chai';
import Immutable from 'immutable';
import {KPIPeriod, KPIPeriodNon,KPINoAdvanceSettings,KPIHasAdvanceSettings,KPIValidateData} from 'mockData/KPIData';

import AppDispatcher from 'dispatcher/AppDispatcher.jsx';
import KPIStore from 'stores/KPI/KPIStore.jsx';
import {Action} from 'constants/actionType/KPI.jsx';

describe('KPIStore', function() {

	it('KPIPeriod test should be right', function() {

        AppDispatcher.dispatch({
        	type: Action.GET_QUOTAPERIOD,
        	data: KPIPeriod
        });
        expect(KPIStore.getKPIPeriod()).to.not.equal(KPIPeriod);
        expect(KPIStore.getKPIPeriod()).to.deep.equal(KPIPeriod);

        AppDispatcher.dispatch({
        	type: Action.GET_QUOTAPERIOD,
        	data: KPIPeriodNon
        });
        expect(KPIStore.getKPIPeriod()).to.deep.equal({});

	});

		it('clearParam test should be correct', function() {

	        AppDispatcher.dispatch({
	        	type: Action.GET_KPI_INFO_SUCCESS,
	        	data: KPINoAdvanceSettings
	        });

	        expect(KPIStore.clearParam()).to.equal(undefined);
					expect(KPIStore.getKpiInfo().toJS()).to.deep.equal(KPINoAdvanceSettings);

	        AppDispatcher.dispatch({
	        	type: Action.GET_KPI_INFO_SUCCESS,
	        	data: KPIHasAdvanceSettings
	        });

					KPIStore.clearParam();
					let kpi=KPIStore.getKpiInfo();
	        expect(kpi.get('AdvanceSettings').size).to.equal(2);
					expect(kpi.getIn(['AdvanceSettings','Year'])).to.equal(KPIHasAdvanceSettings.AdvanceSettings.Year);
					expect(kpi.getIn(['AdvanceSettings','IndicatorType'])).to.equal(KPIHasAdvanceSettings.AdvanceSettings.IndicatorType);
		});

		it('validateQuota test should be correct', function() {

	        expect(KPIStore.validateQuota(0)).to.equal(true);
					expect(KPIStore.validateQuota(12345687)).to.equal(true);
					expect(KPIStore.validateQuota(-1)).to.equal(false);
					expect(KPIStore.validateQuota('100.0')).to.equal(false);
					expect(KPIStore.validateQuota('12!234')).to.equal(false);

		});

		it('validateSavingRate test should be correct', function() {

			    expect(KPIStore.validateSavingRate(-100.0)).to.equal(true);
					expect(KPIStore.validateSavingRate(100.0)).to.equal(true);
					expect(KPIStore.validateSavingRate(-100.1)).to.equal(false);
					expect(KPIStore.validateSavingRate(100.1)).to.equal(false);
					expect(KPIStore.validateSavingRate('-100.00')).to.equal(false);
					expect(KPIStore.validateQuota('99!234')).to.equal(false);

		});

		it('validateKpiInfo test should be correct', function() {
					var kpi=Immutable.fromJS(KPIValidateData.Empty);
					expect(KPIStore.validateKpiInfo(kpi)).to.equal(false);

					kpi=Immutable.fromJS(KPIValidateData.TestBasic1);
					expect(KPIStore.validateKpiInfo(kpi)).to.equal(false);

					kpi=Immutable.fromJS(KPIValidateData.TestBasic2);
					expect(KPIStore.validateKpiInfo(kpi)).to.equal(false);

					kpi=Immutable.fromJS(KPIValidateData.TestBasic3);
					expect(KPIStore.validateKpiInfo(kpi)).to.equal(false);

					kpi=Immutable.fromJS(KPIValidateData.TestBasic4);
					expect(KPIStore.validateKpiInfo(kpi)).to.equal(true);

					kpi=Immutable.fromJS(KPIValidateData.TestAnnualQuota1);
					expect(KPIStore.validateKpiInfo(kpi)).to.equal(true);

					kpi=Immutable.fromJS(KPIValidateData.TestAnnualQuota2);
					expect(KPIStore.validateKpiInfo(kpi)).to.equal(true);

					kpi=Immutable.fromJS(KPIValidateData.TestAnnualQuota3);
					expect(KPIStore.validateKpiInfo(kpi)).to.equal(false);

					kpi=Immutable.fromJS(KPIValidateData.TestAnnualSavingRate1);
					expect(KPIStore.validateKpiInfo(kpi)).to.equal(true);

					kpi=Immutable.fromJS(KPIValidateData.TestAnnualSavingRate2);
					expect(KPIStore.validateKpiInfo(kpi)).to.equal(true);

					kpi=Immutable.fromJS(KPIValidateData.TestAnnualSavingRate3);
					expect(KPIStore.validateKpiInfo(kpi)).to.equal(false);

					// kpi=Immutable.fromJS(KPIValidateData.TestTargetMonthValues1);
					// expect(KPIStore.validateKpiInfo(kpi)).to.equal(true);
					//
					// kpi=Immutable.fromJS(KPIValidateData.TestTargetMonthValues2);
					// expect(KPIStore.validateKpiInfo(kpi)).to.equal(true);
					//
					// kpi=Immutable.fromJS(KPIValidateData.TestTargetMonthValues3);
					// expect(KPIStore.validateKpiInfo(kpi)).to.equal(false);

				});
});
