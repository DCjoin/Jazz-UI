'use strict';
import PrototypeStore from './PrototypeStore.jsx';
import assign from 'object-assign';


var ConstStore = assign({},PrototypeStore,{
  getSearchDate(){
    if(!this.searchDate){
      var searchDate = [
      {value:'Customerize',text:I18N.Common.DateRange.Customerize},
      {value: 'Last7Day', text: I18N.Common.DateRange.Last7Day},
      {value: 'Last30Day', text: I18N.Common.DateRange.Last30Day},
      {value: 'Last12Month', text: I18N.Common.DateRange.Last12Month},
      {value: 'Today', text: I18N.Common.DateRange.Today},
      {value: 'Yesterday', text: I18N.Common.DateRange.Yesterday},
      {value: 'ThisWeek', text: I18N.Common.DateRange.ThisWeek},
      {value: 'LastWeek', text: I18N.Common.DateRange.LastWeek},
      {value: 'ThisMonth', text: I18N.Common.DateRange.ThisMonth},
      {value: 'LastMonth', text: I18N.Common.DateRange.LastMonth},
      {value: 'ThisYear', text: I18N.Common.DateRange.ThisYear},
      {value: 'LastYear', text: I18N.Common.DateRange.LastYear}];

      this.searchDate = searchDate;
    }
    return this.searchDate;
  },
  getCarbonTypeItem(){
    if(!this.carbonTypeItem){
      var carbonTypeItem = [
      {value:2,text:I18N.Common.CarbonUomType.StandardCoal},
      {value:3,text:I18N.Common.CarbonUomType.CO2},
      {value:4,text:I18N.Common.CarbonUomType.Tree}];
      this.carbonTypeItem = carbonTypeItem;
    }

    return this.carbonTypeItem;
  },
  getUnits(){
    if(!this.units){
      var units = [
      {text: I18N.EM.Unit.UnitPopulation, name:'UnitPopulation', value: 2}, {text:I18N.EM.Unit.UnitArea,name:'UnitArea', value: 3},
      {text:I18N.EM.Unit.UnitColdArea,name:'UnitColdArea', value: 4},
      {text:I18N.EM.Unit.UnitWarmArea,name:'UnitWarmArea', value: 5},
      {text:I18N.EM.Unit.UnitRoom,name:'UnitRoom', value: 7},
      {text:I18N.EM.Unit.UnitUsedRoom,name:'UnitUsedRoom', value: 8},
      {text:I18N.EM.Unit.UnitBed,name:'UnitBed', value: 9},
      {text:I18N.EM.Unit.UnitUsedBed,name:'UnitUsedBed', value: 10}];
      this.units = units;
    }
    return this.units;
  },
  getKpiTypeItem(){
    if(!this.kpiTypeItem){
      var kpiTypeItem = [
      {value:1,index:0,text:I18N.EM.Unit.UnitPopulation,name:'UnitPopulation'},
      {value:2,index:1,text:I18N.EM.Unit.UnitArea,name:'UnitArea'},
      {value:3,index:2,text:I18N.EM.Unit.UnitColdArea,name:'UnitColdArea'},
      {value:4,index:3,text:I18N.EM.Unit.UnitWarmArea,name:'UnitWarmArea'},
      {value:8,index:4,text:I18N.EM.Unit.UnitRoom,name:'UnitRoom'},
      {value:9,index:5,text:I18N.EM.Unit.UnitUsedRoom,name:'UnitUsedRoom'},
      {value:10,index:6,text:I18N.EM.Unit.UnitBed,name:'UnitBed'},
      {value:11,index:7,text:I18N.EM.Unit.UnitUsedBed,name:'UnitUsedBed'},
      {value:5,index:8,text:I18N.EM.DayNightRatio,name:'DayNightRatio'},
      {value:6,index:9,text:I18N.EM.WorkHolidayRatio,name:'WorkHolidayRatio'}];
      this.kpiTypeItem = kpiTypeItem;
    }
    return this.kpiTypeItem;
  },
  getRankTypeItem(){
    if(!this.rankTypeItem){
      var rankTypeItem = [
      {value:1,index:0,text:I18N.EM.Rank.TotalRank},
      {value:2,index:1,text:I18N.EM.Rank.RankByPeople},
      {value:3,index:2,text:I18N.EM.Rank.RankByArea},
      {value:4,index:3,text:I18N.EM.Rank.RankByCoolArea},
      {value:5,index:4,text:I18N.EM.Rank.RankByHeatArea},
      {value:7,index:5,text:I18N.EM.Rank.RankByRoom},
      {value:8,index:6,text:I18N.EM.Rank.RankByUsedRoom},
      {value:9,index:7,text:I18N.EM.Rank.RankByBed},
      {value:10,index:8,text:I18N.EM.Rank.RankByUsedBed}];
      this.rankTypeItem = rankTypeItem;
    }
    return this.rankTypeItem;
  },
  getRangeItem(){
    if(!this.rangeItem){
      var rangeItem = [
        {value:3,index:0,text:I18N.Common.Glossary.Order.Rank3},
        {value:5,index:1,text:I18N.Common.Glossary.Order.Rank5},
        {value:10,index:2,text:I18N.Common.Glossary.Order.Rank10},
        {value:20,index:3,text:I18N.Common.Glossary.Order.Rank20},
        {value:50,index:4,text:I18N.Common.Glossary.Order.Rank50},
        {value:1000,index:5,text:I18N.Common.Glossary.Order.All}];
      this.rangeItem = rangeItem;
    }
    return this.rangeItem;
  },
  getOrderItem(){
    if(!this.orderItem){
      var orderItem = [
      {value:1,text:I18N.Common.Glossary.Order.Descending,name:'Descending'}, {value:2,text:I18N.Common.Glossary.Order.Ascending,name:'Ascending'}];
      this.orderItem = orderItem;
    }
    return this.orderItem;
  }
});
module.exports = ConstStore;
