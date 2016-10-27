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
}