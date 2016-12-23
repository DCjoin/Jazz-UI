import { expect } from 'chai';
import Immutable from 'immutable';
import {} from 'mockData/KPIData';

import AppDispatcher from 'dispatcher/AppDispatcher.jsx';
import GroupKPIStore from 'stores/KPI/GroupKPIStore.jsx';
import {Action,SettingStatus} from 'constants/actionType/KPI.jsx';

describe('GroupKPIStore', function() {

	it('IsActive test should be right', function() {

        //test for SettingStatus.New
        var res=GroupKPIStore.IsActive(
                SettingStatus.New,
                Immutable.fromJS({
                      CommodityId:-1
                })
        );

        expect(res).to.equal(true);

        res=GroupKPIStore.IsActive(
                SettingStatus.New,
                Immutable.fromJS({
                      Id:1
                })
        );

        expect(res).to.not.equal(true);

        //test for SettingStatus.Edit
        res=GroupKPIStore.IsActive(
                SettingStatus.Edit,
                Immutable.fromJS({
                      CommodityId:-1
                })
        );

        expect(res).to.equal(true);

        //test for SettingStatus.Prolong
        res=GroupKPIStore.IsActive(
                SettingStatus.Prolong,
                Immutable.fromJS({
                      Id:1
                })
        );

        expect(res).to.not.equal(true);

        res=GroupKPIStore.IsActive(
                SettingStatus.Prolong,
                Immutable.fromJS({
                      Id:1,
                      Buildings:[{
                              Id:1
                              }]
                })
        );

        expect(res).to.equal(true);
	});

	it('getBuildingSum test should be right', function() {
		var calcSum=true,
				kpiInfo=Immutable.fromJS({
					Buildings:[{
						AnnualQuota:null
					},{
						AnnualQuota:null
					}]
				});
		var res=GroupKPIStore.getBuildingSum(calcSum,kpiInfo);
		expect(res).to.equal('-');

		 		calcSum=true;
				kpiInfo=Immutable.fromJS({
					Buildings:[{
						AnnualQuota:null
					},{
						AnnualQuota:1
					}]
				});
		 	res=GroupKPIStore.getBuildingSum(calcSum,kpiInfo);
			expect(res).to.equal(1);

			calcSum=false;
			res=GroupKPIStore.getBuildingSum(calcSum);
			expect(res).to.equal(1);
	});

});
