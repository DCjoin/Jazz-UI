import * as chai from "chai";
import * as Immutable from 'immutable';
import GroupKPIStore from "../../../../src/app/stores/KPI/GroupKPIStore";
import * as sinon from "sinon";


const expect = chai.expect;

describe("GroupKPIStore", () => {

  describe("#validateKpiInfo", () => {

    function getKpiInfo(): Immutable.Map < string, any > {
      let info = {
        CustomerId: '1',
        Year: '',
        IndicatorName: '1',
        UomId: '',
        CommodityId: '1',
        IndicatorType: '',
        AnnualQuota: '1',
        AnnualSavingRate: '1',
        Buildings: [{
          HierarchyId: '',
          HierarchyName: '',
          ActualTagId: '',
          ActualTagName: '',
          AnnualQuota: '2',
          AnnualSavingRate: '2',
          TargetMonthValues: '',
          TagSavingRates: '',
          MonthPredictionValues: ''
        }]
      }
      return Immutable.fromJS(info);
    }

    function testEmptyFalsy(key: string, values: Array < any > ) {

      values.forEach((item) => {
        let kpiInfo = getKpiInfo();
        kpiInfo = kpiInfo.set(key, item);
        let ret = GroupKPIStore.validateKpiInfo(kpiInfo);
        // console.log("item:%s",item);

        // console.log('result',ret);

        expect(ret).to.be.false;
      })

    }

    it("should return false when CommodityId is invalid", () => {
      //CustomerId is '' | null | undefined | -1
      testEmptyFalsy("CommodityId", ['', null, undefined, -1]);
    })

    it("should return false when IndicatorName is invalid", () => {

      //IndicatorName is '' | null | undefined | 0
      testEmptyFalsy("IndicatorName", ['', null, undefined, 0]);

    })

    it("should return false when AnnualQuota is invalid", () => {

      let kpiInfo = getKpiInfo();

      let quotaValidator = sinon.stub().returns(false);

      let ret = GroupKPIStore.validateKpiInfo(kpiInfo, quotaValidator);

      expect(ret).to.be.false;

    })

    it("should return false when AnnualSavingRate is invalid", () => {

      let kpiInfo = getKpiInfo();

      let quotaValidator = sinon.stub().returns(true);
      let savingRateValidator = sinon.stub().returns(false);

      let ret = GroupKPIStore.validateKpiInfo(kpiInfo, quotaValidator, savingRateValidator);

      expect(ret).to.be.false;

    })


    it("should return false when AnnualSavingRate is invalid", () => {

      let kpiInfo = getKpiInfo();

      let quotaValidator = sinon.stub().returns(true);
      let savingRateValidator = sinon.stub().returns(false);

      let ret = GroupKPIStore.validateKpiInfo(kpiInfo, quotaValidator, savingRateValidator);

      expect(ret).to.be.false;

    })

    it("should return false when AnnualQuota in Buildings is invalid", () => {

      let kpiInfo = getKpiInfo();

      let quotaValidator = sinon.stub();
      quotaValidator.withArgs('1').returns(true);
      quotaValidator.withArgs('2').returns(false);
      let savingRateValidator = sinon.stub().returns(true);

      let ret = GroupKPIStore.validateKpiInfo(kpiInfo, quotaValidator, savingRateValidator);

      expect(ret).to.be.false;

    })

    it("should return false when AnnualSavingRate in Buildings is invalid", () => {

      let kpiInfo = getKpiInfo();

      let quotaValidator = sinon.stub().returns(true);

      let savingRateValidator = sinon.stub();
      savingRateValidator.withArgs('1').returns(true);
      savingRateValidator.withArgs('2').returns(false);

      let ret = GroupKPIStore.validateKpiInfo(kpiInfo, quotaValidator, savingRateValidator);

      expect(ret).to.be.false;

    })

    it("should return true when all parameters are correct", () => {

      let kpiInfo = getKpiInfo();

      let quotaValidator = sinon.stub().returns(true);

      let savingRateValidator = sinon.stub().returns(true);

      let ret = GroupKPIStore.validateKpiInfo(kpiInfo, quotaValidator, savingRateValidator);

      expect(ret).to.be.true;

    })




  })



})