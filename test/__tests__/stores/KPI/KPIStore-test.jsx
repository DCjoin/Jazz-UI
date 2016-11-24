import { expect } from 'chai';

import {KPIPeriod, KPIPeriodNon} from 'mockData/KPIData';

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

});