import PermissionCode, {
	MAP_VIEW, ENERGY_MANAGE,
	BUILDING_LIST, INDEX_AND_REPORT, PUSH_SOLUTION, SOLUTION_FULL,
	BASIC_DATA_ANALYSE, SENIOR_DATA_ANALYSE,
	BASELINE_CONFIG, ENERGY_EXPORT, ENERGY_ALARM, DATA_REPORT_MANAGEMENT,
	TAG_MANAGEMENT, HIERARCHY_MANAGEMENT, CUSTOM_LABELING, PLATFORM_MANAGEMENT
} from 'constants/PermissionCode.jsx';

import {remove} from 'lodash/array';

const PrivilegeUtil = {
	getRolePrivilegeList: () => {
		return [
			BUILDING_LIST,
			INDEX_AND_REPORT,
			PUSH_SOLUTION,
			SOLUTION_FULL,
			BASIC_DATA_ANALYSE,
			// SENIOR_DATA_ANALYSE,
			MAP_VIEW,
			ENERGY_MANAGE,
			BASELINE_CONFIG,
			ENERGY_EXPORT,
			ENERGY_ALARM,
			DATA_REPORT_MANAGEMENT,
			TAG_MANAGEMENT,
			HIERARCHY_MANAGEMENT,
			CUSTOM_LABELING,
			PLATFORM_MANAGEMENT
		];
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
