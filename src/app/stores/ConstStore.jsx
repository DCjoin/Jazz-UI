'use strict';
import PrototypeStore from './PrototypeStore.jsx';
import React from 'react';
import MenuItem from 'material-ui/MenuItem';
import assign from 'object-assign';


var ConstStore = assign({}, PrototypeStore, {
  getSearchDate() {
    var searchDate = [
      <MenuItem value='Customerize' primaryText={I18N.Common.DateRange.Customerize} />,
      <MenuItem value='Last7Day' primaryText={I18N.Common.DateRange.Last7Day} />,
      <MenuItem value='Last30Day' primaryText={I18N.Common.DateRange.Last30Day} />,
      <MenuItem value='Last12Month' primaryText={I18N.Common.DateRange.Last12Month} />,
      <MenuItem value='Today' primaryText={I18N.Common.DateRange.Today} />,
      <MenuItem value='Yesterday' primaryText={I18N.Common.DateRange.Yesterday} />,
      <MenuItem value='ThisWeek' primaryText={I18N.Common.DateRange.ThisWeek} />,
      <MenuItem value='LastWeek' primaryText={I18N.Common.DateRange.LastWeek} />,
      <MenuItem value='ThisMonth' primaryText={I18N.Common.DateRange.ThisMonth} />,
      <MenuItem value='LastMonth' primaryText={I18N.Common.DateRange.LastMonth} />,
      <MenuItem value='ThisYear' primaryText={I18N.Common.DateRange.ThisYear} />,
      <MenuItem value='LastYear' primaryText={I18N.Common.DateRange.LastYear} />];

    this.searchDate = searchDate;
    return this.searchDate;
  },
  getCarbonTypeItem() {
    var carbonTypeItem = [
      <MenuItem value={2} primaryText={I18N.Common.CarbonUomType.StandardCoal} />,
      <MenuItem value={3} primaryText={I18N.Common.CarbonUomType.CO2} />,
      <MenuItem value={4} primaryText={I18N.Common.CarbonUomType.Tree} />];

    this.carbonTypeItem = carbonTypeItem;
    return this.carbonTypeItem;
  },
  getUnits() {
    var units = [
      <MenuItem value={2} primaryText={I18N.EM.Unit.UnitPopulation} />,
      <MenuItem value={3} primaryText={I18N.EM.Unit.UnitArea} />,
      <MenuItem value={4} primaryText={I18N.EM.Unit.UnitColdArea} />,
      <MenuItem value={5} primaryText={I18N.EM.Unit.UnitWarmArea} />,
      <MenuItem value={7} primaryText={I18N.EM.Unit.UnitRoom} />,
      <MenuItem value={8} primaryText={I18N.EM.Unit.UnitUsedRoom} />,
      <MenuItem value={9} primaryText={I18N.EM.Unit.UnitBed} />,
      <MenuItem value={10} primaryText={I18N.EM.Unit.UnitUsedBed} />];

    this.units = units;
    return this.units;
  },
  getKpiTypeItem() {
    var kpiTypeItem = [
      <MenuItem value={1} primaryText={I18N.EM.Unit.UnitPopulation} />,
      // {
      //   value: 1,
      //   index: 0,
      //   text: I18N.EM.Unit.UnitPopulation,
      //   name: 'UnitPopulation'
      // },
      <MenuItem value={2} primaryText={I18N.EM.Unit.UnitArea} />,
      // {
      //   value: 2,
      //   index: 1,
      //   text: I18N.EM.Unit.UnitArea,
      //   name: 'UnitArea'
      // },
      <MenuItem value={3} primaryText={I18N.EM.Unit.UnitColdArea} />,
      // {
      //   value: 3,
      //   index: 2,
      //   text: I18N.EM.Unit.UnitColdArea,
      //   name: 'UnitColdArea'
      // },
      <MenuItem value={4} primaryText={I18N.EM.Unit.UnitWarmArea} />,
      // {
      //   value: 4,
      //   index: 3,
      //   text: I18N.EM.Unit.UnitWarmArea,
      //   name: 'UnitWarmArea'
      // },
      <MenuItem value={8} primaryText={I18N.EM.Unit.UnitRoom} />,
      // {
      //   value: 8,
      //   index: 4,
      //   text: I18N.EM.Unit.UnitRoom,
      //   name: 'UnitRoom'
      // },
      <MenuItem value={9} primaryText={I18N.EM.Unit.UnitUsedRoom} />,
      // {
      //   value: 9,
      //   index: 5,
      //   text: I18N.EM.Unit.UnitUsedRoom,
      //   name: 'UnitUsedRoom'
      // },
      <MenuItem value={10} primaryText={I18N.EM.Unit.UnitBed} />,
      // {
      //   value: 10,
      //   index: 6,
      //   text: I18N.EM.Unit.UnitBed,
      //   name: 'UnitBed'
      // },
      <MenuItem value={11} primaryText={I18N.EM.Unit.UnitUsedBed} />,
      // {
      //   value: 11,
      //   index: 7,
      //   text: I18N.EM.Unit.UnitUsedBed,
      //   name: 'UnitUsedBed'
      // },
      <MenuItem value={5} primaryText={I18N.EM.Unit.DayNightRatio} />,
      // {
      //   value: 5,
      //   index: 8,
      //   text: I18N.EM.DayNightRatio,
      //   name: 'DayNightRatio'
      // },
      <MenuItem value={6} primaryText={I18N.EM.Unit.WorkHolidayRatio} />,
      // {
      //   value: 6,
      //   index: 9,
      //   text: I18N.EM.WorkHolidayRatio,
      //   name: 'WorkHolidayRatio'
      // }
    ];

    this.kpiTypeItem = kpiTypeItem;
    return this.kpiTypeItem;
  },
  getRankTypeItem() {
    var rankTypeItem = [
      <MenuItem value={1} primaryText={I18N.EM.Rank.TotalRank} />,
      <MenuItem value={2} primaryText={I18N.EM.Rank.RankByPeople} />,
      <MenuItem value={3} primaryText={I18N.EM.Rank.RankByArea} />,
      <MenuItem value={4} primaryText={I18N.EM.Rank.RankByCoolArea} />,
      <MenuItem value={5} primaryText={I18N.EM.Rank.RankByHeatArea} />,
      <MenuItem value={7} primaryText={I18N.EM.Rank.RankByRoom} />,
      <MenuItem value={8} primaryText={I18N.EM.Rank.RankByUsedRoom} />,
      <MenuItem value={9} primaryText={I18N.EM.Rank.RankByBed} />,
      <MenuItem value={10} primaryText={I18N.EM.Rank.RankByUsedBed} />];

    this.rankTypeItem = rankTypeItem;
    return this.rankTypeItem;
  },
  getRangeItem() {
    var rangeItem = [
      <MenuItem value={3} primaryText={I18N.Common.Glossary.Order.Rank3} />,
      <MenuItem value={5} primaryText={I18N.Common.Glossary.Order.Rank5} />,
      <MenuItem value={10} primaryText={I18N.Common.Glossary.Order.Rank10} />,
      <MenuItem value={20} primaryText={I18N.Common.Glossary.Order.Rank20} />,
      <MenuItem value={50} primaryText={I18N.Common.Glossary.Order.Rank50} />,
      <MenuItem value={1000} primaryText={I18N.Common.Glossary.Order.All} />
      // {
      //   value: 3,
      //   index: 0,
      //   text: I18N.Common.Glossary.Order.Rank3
      // },
      // {
      //   value: 5,
      //   index: 1,
      //   text: I18N.Common.Glossary.Order.Rank5
      // },
      // {
      //   value: 10,
      //   index: 2,
      //   text: I18N.Common.Glossary.Order.Rank10
      // },
      // {
      //   value: 20,
      //   index: 3,
      //   text: I18N.Common.Glossary.Order.Rank20
      // },
      // {
      //   value: 50,
      //   index: 4,
      //   text: I18N.Common.Glossary.Order.Rank50
      // },
      // {
      //   value: 1000,
      //   index: 5,
      //   text: I18N.Common.Glossary.Order.All
      // }
    ];

    this.rangeItem = rangeItem;
    return this.rangeItem;
  },
  getOrderItem() {
    var orderItem = [
      <MenuItem value={1} primaryText={I18N.Common.Glossary.Order.Descending} />,
      <MenuItem value={2} primaryText={I18N.Common.Glossary.Order.Ascending} />
      // {
      //   value: 1,
      //   index: 0,
      //   text: I18N.Common.Glossary.Order.Descending,
      //   name: 'Descending'
      // }, {
      //   value: 2,
      //   index: 1,
      //   text: I18N.Common.Glossary.Order.Ascending,
      //   name: 'Ascending'
      // }
      ];

    this.orderItem = orderItem;
    return this.orderItem;
  },
  getLabelMonth() {
    var labelMonthItem = [
      <MenuItem value={0} primaryText={I18N.DateTimeFormat.HighFormat.FullYear} />,
      <MenuItem value={1} primaryText='01' />,
      <MenuItem value={2} primaryText='02' />,
      <MenuItem value={3} primaryText='03' />,
      <MenuItem value={4} primaryText='04' />,
      <MenuItem value={5} primaryText='05' />,
      <MenuItem value={6} primaryText='06' />,
      <MenuItem value={7} primaryText='07' />,
      <MenuItem value={8} primaryText='08' />,
      <MenuItem value={9} primaryText='09' />,
      <MenuItem value={10} primaryText='10' />,
      <MenuItem value={11} primaryText='11' />,
      <MenuItem value={12} primaryText='12' />];

    this.labelMonthItem = labelMonthItem;
    return this.labelMonthItem;
  },
});
module.exports = ConstStore;
