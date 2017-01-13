import { expect } from 'chai';
import Immutable from 'immutable';
import {} from 'mockData/KPIData';
import ReportStore from 'stores/KPI/ReportStore.jsx';

describe("ReportStore", () => {
    describe("#getHierarchyName", () => {
      var getDefaultTag=()=>{
        return Immutable.fromJS({
          HierarchyName:'楼宇A',
          AreaDimensionName:'一层'
        })
      }
      var testResultCorrect=(key,value,result)=>{
        var tag=getDefaultTag();
        if(key){
          tag=tag.set(key,value);
        }
        var ret=ReportStore.getHierarchyName(tag)===result;
        expect(ret).to.be.true;
      }

      it("should result is '' when HierarchyName is null", () => {
      //CustomerId is '' | null | undefined | -1
      testResultCorrect("HierarchyName",null,'');
    })

      it("should result is '楼宇A' when AreaDimensionName is null", () => {
        //CustomerId is '' | null | undefined | -1
      testResultCorrect("AreaDimensionName",null,'楼宇A');
    })

    it("should result is '楼宇A-一层' when both HierarchyName and AreaDimensionName are not null", () => {
      //CustomerId is '' | null | undefined | -1
    testResultCorrect(null,null,'楼宇A-一层');
  })

    })
})
