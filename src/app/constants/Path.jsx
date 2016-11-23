'use strict';

module.exports = {

    KPI:{
		getKPIPeriod: '/kpi/getkpiperiod/{customerid}',
		setKPIPeriod: '/kpi/setkpiperiod',
		getKPIPeriodByYear: '/kpi/getkpiperiod/{customerid}/{year}',
		calcKPIGradualValue: '/kpi/calckpigradualvalue',
		getDimension:'/AreaDimension/GetAreaDimensionTree',
		getTags:'/Tag/GetTagsByFilter'
	}
};
