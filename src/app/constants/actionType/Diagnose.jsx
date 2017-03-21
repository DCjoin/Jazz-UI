import keyMirror from 'keymirror';

module.exports = {
  Action:keyMirror({
    LOAD_DIM_NODE:null
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
        DomesticWater:110,
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
    }

};
