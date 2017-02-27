import { expect } from 'chai';
import Immutable from 'immutable';
import MeasuresStore from 'stores/ECM/MeasuresStore.jsx';

describe("MeasuresStore", () => {
    describe("#validateNumber", () => {
      var testResultCorrect=(value,result)=>{

        var ret=MeasuresStore.validateNumber(value)===result;
        expect(ret).to.be.true;
      }

      it("should result is null when number is null", () => {
      //CustomerId is '' | null | undefined | -1
      //expect(MeasuresStore.validateNumber(null)).to.not.equal(true);
      expect(MeasuresStore.validateNumber(null)).to.equal(true);
    })


    it("should result is null when value type is number and string", () => {
    //CustomerId is '' | null | undefined | -1
    //expect(MeasuresStore.validateNumber(null)).to.not.equal(true);
    expect(MeasuresStore.validateNumber(0)).to.equal(true);
    expect(MeasuresStore.validateNumber(0.1)).to.equal(true);
    expect(MeasuresStore.validateNumber('0.1')).to.equal(true);
  })
  it("should result is not null when value type is number and not valid ", () => {
  //CustomerId is '' | null | undefined | -1
  //expect(MeasuresStore.validateNumber(null)).to.not.equal(true);
  expect(MeasuresStore.validateNumber(-0.1)).to.not.equal(true);
  expect(MeasuresStore.validateNumber(0.12)).to.not.equal(true);
})
it("should result is not null when value type is string and not valid ", () => {
//CustomerId is '' | null | undefined | -1
//expect(MeasuresStore.validateNumber(null)).to.not.equal(true);
expect(MeasuresStore.validateNumber('-0.1')).to.not.equal(true);
expect(MeasuresStore.validateNumber('0.12')).to.not.equal(true);
})
    })
})
