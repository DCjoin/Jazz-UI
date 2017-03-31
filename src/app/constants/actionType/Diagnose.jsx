import keyMirror from 'keymirror';

module.exports = {
  Action:keyMirror({
    GET_DIAGNOSIS_LIST:null,
    GET_DIAGNOSIS_STATIC:null,
    GET_DIAGNOSIS_BY_ID:null,
    GET_TAGS_LIST:null,
    GET_CHART_DATA:null,
    GET_CHART_DATAING:null,
    CLEAR_CREATE_DATA:null,
  }),
    EnergyLabel:{
        OfficeLighting:101,
        CommerceLighting:102,
        Floodlight:103,
        UndergroundLighting:104,
        Elevator:105,
        Escalator:106,
        ParkingFan:107,
        ElectricTracing:108,
        TransformerPowerFactor:109,
        DomesticWater:112,
        TransformerLoadRate:110,
        Demand:111,
        WaterChillingUnit:201,
        WaterChillingUnitCOP:202,
        FreshAirUnit:203,
        AirConditioningFreshAir:204,
        FreshAirValve:205,
        AirConditioningUnit:206,
        ChilledWaterTemperature:207,
        ChilledWaterTemperatureDifference:208,
        CoolingWaterTemperature:209,
        CoolingRange:210,
        ChilledWaterPump:211,
        CoolingPump:212,
        CoolingTower:213,
        IndoorCO2:301,
        IndoorCO:302,
        IndoorTemperature:303,
        DistrictTemperature:304,
        OutdoorTemperature:305,
        IndoorAndOutdoorTemperatureDifference:306
    },
    Type:{
      Item:1,
      Label:2,
      Problem:3
    },
    DiagnoseStatus:{
      Suspend:1
    },
    ItemType:{
      Basic:{
        NonRunTime:11,
        DeviceEfficiency:12,
        NonEssentialOperation:13,
        IndoorEnvironmental:14,
        DemandOptimization:15
      },
      Senior:{
        RunTime:21,
        NonRunTime:22,
        DeviceEfficiency:23,
        NonEssentialOperation:24,
        IndoorEnvironmental:25,
        OperationOptimization:26
      }
    },
    DIAGNOSE_MODEL: {
        A: 1,
        B: 2,
        C: 3,
    }

};
