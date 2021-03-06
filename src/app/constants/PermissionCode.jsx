'use strict';

const PermissionCode = function() {

	return {

	ASSET_MANAGE_MAP: {
		READONLY: 2100
	},

	DEVICE_DATA_MONITOR: {
		READONLY: 2101
	},

	DEVICE_HISTORY_DATA: {
		READONLY: 2102
	},

	SP_FAULT_ALARM: {
		READONLY: 2104,
		FULL: 2103
	},

	ASSET_BASIC_INFO: {
		READONLY: 2106,
		FULL: 2105
	},

	ASSET_ALARM_INFO: {
		READONLY: 2108,
		FULL: 2107
	},

	ASSET_RUNNING_CONFIG: {
		READONLY: 2109
	},

	ALRAM_SMS_NOTICE_SETTING: {
		// READONLY: 2111,
		FULL: 2110
	},

	DATA_MONITOR_SETTING: {
		// READONLY: 2113,
		FULL: 2112
	},

	DEVICE_HISTORY_DATA_EXPORT: {
		READONLY: 2114
	},

	TREE_STRUCTURE_MANAGE: {
		READONLY: 2116,
		FULL: 2115
	},

	SP_CUSTOMER_MANAGE: {
		READONLY: 2118,
		FULL: 2117
	},

	SP_USER_MANAGE: {
		READONLY: 2120,
		FULL: 2119
	},

	SP_DEVICE_TEMPLATE_MANAGE: {
		READONLY: 2122,
		FULL: 2121
	},

	SP_PARAMETER_TEMPLATE_MANAGE: {
		READONLY: 2124,
		FULL: 2123
	},

	SP_ALARM_TEMPLATE_MANAGEMENT: {
		READONLY: 2126,
		FULL: 2125
	},

	SP_GATEWA_MANAGEMENT: {
		READONLY: 2128,
		FULL: 2127
	},

	INDEX_AND_REPORT: {
		getLabel: () => I18N.Privilege.Role.IndexAndReport,
		READONLY: 1300,
		FULL: 1301,
	},

	BASIC_SMART_DIACRISIS: {
		getLabel: () => I18N.Privilege.Role.BasicSmartDiacrisis,
		READONLY: 1316,
		FULL: 1317,
	},
	SENIOR_SMART_DIACRISIS: {
		getLabel: () => I18N.Privilege.Role.SeniorSmartDiacrisis,
		READONLY: 1322,
		FULL: 1323,
	},
	BASIC_SMART_DIACRISIS_LIST: {
		getLabel: () => I18N.Privilege.Role.BasicSmartDiacrisisList,
		FULL: 1325,
	},
	SENIOR_SMART_DIACRISIS_LIST: {
		getLabel: () => I18N.Privilege.Role.SeniorSmartDiacrisisList,
		FULL: 1327,
	},

	BASIC_DATA_ANALYSE: {
		getLabel: () => I18N.Privilege.Role.BasicDataAnalyse,
		READONLY: 1312,
		FULL: 1313,
	},

	SENIOR_DATA_ANALYSE: {
		getLabel: () => I18N.Privilege.Role.SeniorDataAnalyse,
		FULL: 1315,
	},

	PUSH_SOLUTION: {
		READONLY: 1302,
		FULL: 1303,
		getLabel: () => I18N.Privilege.Role.PushSolution
	},

	SOLUTION_FULL: {
		getLabel: () => I18N.Privilege.Role.SolutionFull,
		FULL: 1321,
	},

	BUILDING_LIST: {
		getLabel: () => I18N.Privilege.Role.BuildingList,
		FULL: 1319,
	},

	SOLUTION_LIBRARY: {
		FULL: 1305
	},

	SOLUTION_DISTRIBUTION: {
		FULL: 1307,
	},

	SINGLE_PROJECT_ENERGY: {
		READONLY: 1308,
		FULL: 1309,
	},

	MULTIPLE_PROJECT_ENERGY: {
		READONLY: 1310,
		FULL: 1311,
	},

	INTERLLIGENCE_DIAGNOSE: {
		FULL: 1317,
	},

	// MAP_VIEW: {
	// 	getLabel: () => I18N.Privilege.Common.MapView,
	// 	READONLY: 1104,
	// },

	// ENERGY_MANAGE: {
	// 	getLabel: () => I18N.Privilege.Common.EnergyManager,
	// 	FULL: 1222,
	// },

	// BASELINE_CONFIG: {
	// 	getLabel: () => I18N.Privilege.Role.BaselineConfigurationI18N.Privilege.Role.BaselineConfiguration,
	// 	FULL: 1223,
	// },

	// ENERGY_EXPORT: {
	// 	getLabel: () => I18N.Privilege.Role.EnergyExport,
	// 	FULL: 1205,
	// },

	// ENERGY_ALARM: {
	// 	getLabel: () => I18N.Privilege.Role.EnergyAlarm,
	// 	FULL: 1221,
	// },

	// DATA_REPORT_MANAGEMENT: {
	// 	getLabel: () => I18N.Privilege.Role.ReportManagement,
	// 	READONLY: 1218,
	// 	FULL: 1219,
	// },

	TAG_MANAGEMENT: {
		getLabel: () => I18N.Privilege.Role.TagManagement,
		FULL: 1208,
		PLATFORM_FULL:2152,
		PLATFORM_READONLY:2153,
	},

	HIERARCHY_MANAGEMENT: {
		getLabel: () => I18N.Privilege.Role.HierarchyManagement,
		FULL: 1207,
		PLATFORM_FULL:2154,
		PLATFORM_READONLY:2155,
	},

	CUSTOM_LABELING: {
		//getLabel: () => I18N.Privilege.Role.CustomLabeling,
		getLabel: () => I18N.Privilege.Role.NewCustomLabeling,
		FULL: 1217,
	},

	PLATFORM_MANAGEMENT: {
		getLabel: () => I18N.Privilege.Role.SPManagement,
		FULL: 1206,
	},

	Save_Effect: {
		getLabel: () => I18N.Privilege.Role.SaveEffect,
		FULL: 1329,
		READONLY: 1328,
	},

  C_LEVEL_APP: {
    getLabel: () => I18N.Privilege.Role.CLevelAPP,
    FULL: 1331,
  },

	DASH_BOARD: {
		getLabel: () => "Dashboard",
    FULL: 1333,
		READONLY: 1332,
	},

	BEST_SOLUTION: {
		getLabel: () => I18N.Privilege.Role.BestSolution,
    FULL: 1335,
		READONLY: 1334,
	},

  SOLUTION_LIBRARY: {
    getLabel: () => I18N.Privilege.Role.SolutionLibrary,
    FULL: 1500,
	},
	
	DATA_QUALITY_MAINTENANCE: {
    getLabel: () => I18N.Privilege.Role.DataQualityMaintenance,
		FULL: 1351,
		READONLY: 1350,
  },

};
};

module.exports = PermissionCode();
