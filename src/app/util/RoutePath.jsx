export default {
	base: p => `/${p.lang}`,
	resetPSW: p => `/${p.lang}/u=${p.user}&t=${p.token}&a=resetpwd&lang=${p.lang}`,
	contactus: p => `/${p.lang}/contactus`,
	demoLogin: p => `/${p.lang}/u=${p.user}&t=${p.token}&a=demologin&lang=${p.lang}`,
	initChangePSW: p => `/${p.lang}/u=${p.user}&t=${p.token}&a=initpwd&lang=${p.lang}`,
	login: p => `/${p.lang}/login`,
	config: p => `/${p.lang}/platform/config`,
	workday: p => `/${p.lang}/service/${p.cusnum}/workday`,
	main: p => `/${p.lang}/${p.customerId||''}`,
	kpi: p => `/${p.lang}/${p.customerId}/kpi`,
	Actuality: p => `/${p.lang}/${p.customerId}/actuality`,
	KPIActuality: p => `/${p.lang}/${p.customerId}/actuality`,
	KPIGroupConfig: p => `/${p.lang}/${p.customerId}/actuality/config`,
	KPIConfig: p => `/${p.lang}/${p.customerId}/actuality/config/kpiconfig`,
	KPIRankConfig: p => `/${p.lang}/${p.customerId}/actuality/config/rankconfig`,
	KPITemplate:p => `/${p.lang}/${p.customerId}/actuality/template`,
	dataAnalysis:p => `/${p.lang}/${p.customerId}/data_analysis`,
	setting: p => `/${p.lang}/${p.customerId}/setting`,
	alarm: p => `/${p.lang}/${p.customerId}/alarm`,
	map: p => `/${p.lang}/${p.customerId}/map`,
	report:{
		actualityReport: p => `/${p.lang}/${p.customerId}/actuality/report`,
		dailyReport: p => `/${p.lang}/${p.customerId}/dailyReport`,
		template: p => `/${p.lang}/${p.customerId}/template`,
	},
	customerSetting:{
		ptag:p => `/${p.lang}/${p.customerId}/ptag`,
		vtag:p => `/${p.lang}/${p.customerId}/vtag`,
		vee:p => `/${p.lang}/${p.customerId}/vee`,
		log:p => `/${p.lang}/${p.customerId}/log`,
		hierNode:p => `/${p.lang}/${p.customerId}/hierNode`,
		hierLog:p => `/${p.lang}/${p.customerId}/hierLog`,
		customerLabeling:p => `/${p.lang}/${p.customerId}/customerLabeling`,
		KPICycle:p => `/${p.lang}/${p.customerId}/KPICycle`,
	},
	service: {
		workday: p => `/${p.lang}/service/${p.cusnum}/workday`,
		worktime: p => `/${p.lang}/service/${p.cusnum}/worktime`,
		coldwarm: p => `/${p.lang}/service/${p.cusnum}/coldwarm`,
		daynight: p => `/${p.lang}/service/${p.cusnum}/daynight`,
		price: p => `/${p.lang}/service/${p.cusnum}/price`,
		carbon: p => `/${p.lang}/service/${p.cusnum}/carbon`,
		benchmark: p => `/${p.lang}/service/${p.cusnum}/benchmark`,
		labeling: p => `/${p.lang}/service/${p.cusnum}/labeling`,
		customer: p => `/${p.lang}/service/${p.cusnum}/customer`,
		user: p => `/${p.lang}/service/${p.cusnum}/user`,
		privilege: p => `/${p.lang}/service/${p.cusnum}/privilege`,
	},
	// platform: {
		config: p => `/${p.lang}/platform/config`,
		mail: p => `/${p.lang}/platform/mail`,
	// }
	blankPage: p => `/${p.lang}/${p.customerId}/blankPage`,
}
