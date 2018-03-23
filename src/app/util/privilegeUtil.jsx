import PermissionCode, {
	/*MAP_VIEW, ENERGY_MANAGE,*/
	BUILDING_LIST, INDEX_AND_REPORT, PUSH_SOLUTION, SOLUTION_FULL,
	BASIC_DATA_ANALYSE, SENIOR_DATA_ANALYSE,
	BASIC_SMART_DIACRISIS, SENIOR_SMART_DIACRISIS, BASIC_SMART_DIACRISIS_LIST, SENIOR_SMART_DIACRISIS_LIST,
	/*BASELINE_CONFIG, ENERGY_EXPORT, ENERGY_ALARM, DATA_REPORT_MANAGEMENT,*/
	TAG_MANAGEMENT, HIERARCHY_MANAGEMENT, CUSTOM_LABELING, PLATFORM_MANAGEMENT,
	Save_Effect,  C_LEVEL_APP, DASH_BOARD,BEST_SOLUTION, DATA_SPIRIT,
} from 'constants/PermissionCode.jsx';
import CurrentUserStore from 'stores/CurrentUserStore.jsx';

import {remove} from 'lodash-es';

const PrivilegeUtil = {
	getRolePrivilegeList: () => {
		let spPrivilege = CurrentUserStore.getSpPrivilege();
		return [
			BUILDING_LIST,
			INDEX_AND_REPORT,
			PUSH_SOLUTION,
			SOLUTION_FULL,
			BASIC_DATA_ANALYSE,
			SENIOR_DATA_ANALYSE,
			BASIC_SMART_DIACRISIS,
			SENIOR_SMART_DIACRISIS,
			BASIC_SMART_DIACRISIS_LIST,
			SENIOR_SMART_DIACRISIS_LIST,
			// MAP_VIEW,
			// ENERGY_MANAGE,
			// BASELINE_CONFIG,
			// ENERGY_EXPORT,
			// ENERGY_ALARM,
			// DATA_REPORT_MANAGEMENT,
			TAG_MANAGEMENT,
			HIERARCHY_MANAGEMENT,
			CUSTOM_LABELING,
			PLATFORM_MANAGEMENT,
			Save_Effect,
      C_LEVEL_APP,
			DASH_BOARD,
			BEST_SOLUTION,
      DATA_SPIRIT,
		].filter( privilege => spPrivilege.indexOf(privilege.READONLY) !== -1 || spPrivilege.indexOf(privilege.FULL) !== -1 );
	},

	findView: (targetCodeObj, privilegeCodes) => privilegeCodes.indexOf(targetCodeObj.READONLY + ''),
	findFull: (targetCodeObj, privilegeCodes) => privilegeCodes.indexOf(targetCodeObj.FULL + ''),

	isView: (...arg) => PrivilegeUtil.findView(...arg) !== -1,

	isFull: (...arg) => PrivilegeUtil.findFull(...arg) !== -1,

	canView: (...arg) => PrivilegeUtil.isView(...arg)
					||	 PrivilegeUtil.isFull(...arg),

	getViewCode: (targetCodeObj, privilegeCodes) => PrivilegeUtil.isView(targetCodeObj, privilegeCodes) && targetCodeObj.READONLY,
	getFullCode: (targetCodeObj, privilegeCodes) => PrivilegeUtil.isFull(targetCodeObj, privilegeCodes) && targetCodeObj.FULL,

	changePrivilegeCodes: (targetCodeObj, privilegeCodes, value) => {
		remove(privilegeCodes, code => code === targetCodeObj.FULL + "" );
		remove(privilegeCodes, code => code === targetCodeObj.READONLY + "" );

		if(value) {
			privilegeCodes.push(value + "");
		}

		return privilegeCodes;
	},
};

module.exports = PrivilegeUtil;
