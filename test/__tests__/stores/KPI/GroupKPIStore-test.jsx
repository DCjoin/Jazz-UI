import { expect } from 'chai';
import Immutable from 'immutable';
import {KPIPeriod, KPIPeriodNon,KPINoAdvanceSettings,KPIHasAdvanceSettings,KPIValidateData} from 'mockData/KPIData';

import AppDispatcher from 'dispatcher/AppDispatcher.jsx';
import GroupKPIStore from 'stores/KPI/GroupKPIStore.jsx';
import {Action} from 'constants/actionType/KPI.jsx';

describe('GroupKPIStore', function() {

	it('KPIPeriod test should be right', function() {

        AppDispatcher.dispatch({
        	type: Action.GET_QUOTAPERIOD,
        	data: KPIPeriod
        });
        expect(SingleKPIStore.getKPIPeriod()).to.not.equal(KPIPeriod);
        expect(SingleKPIStore.getKPIPeriod()).to.deep.equal(KPIPeriod);

        AppDispatcher.dispatch({
        	type: Action.GET_QUOTAPERIOD,
        	data: KPIPeriodNon
        });
        expect(SingleKPIStore.getKPIPeriod()).to.deep.equal({});

	});

});
