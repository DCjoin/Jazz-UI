export default {
	resetPSW: p => `/${p.lang}/u=${p.user}&t=${p.token}&a=resetpwd&lang=${p.lang}`,
	contactus: p => `/${p.lang}/contactus`,
	demoLogin: p => `/${p.lang}/u=${p.user}&t=${p.token}&a=demologin&lang=${p.lang}`,
	initChangePSW: p => `/${p.lang}/u=${p.user}&t=${p.token}&a=initpwd&lang=${p.lang}`,
	login: p => `/${p.lang}/login`,
	config: p => `/${p.lang}/platform/config`,
	workday: p => `/${p.lang}/service/${p.cusnum}/workday`,
	main: p => `/${p.lang}/${p.customerId||''}`,
	setting: p => `/${p.lang}/${p.customerId}/setting`,
	alarm: p => `/${p.lang}/${p.customerId}/alarm`,
	map: p => `/${p.lang}/${p.customerId}/map`,
	report:{
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
	}
}
