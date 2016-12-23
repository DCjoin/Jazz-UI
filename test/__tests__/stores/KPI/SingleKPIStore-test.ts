import * as chai from "chai";
// import * as Immutable from 'immutable';
import SingleKPIStore from "../../../../src/app/stores/KPI/SingleKPIStore";


const expect = chai.expect;

describe("SingleKPIStore", () => {

    describe("#validateQuota", () => {

        it("should be false when empty string", () => {
            let ret = SingleKPIStore.validateQuota();
            expect(ret).to.be.true;
        })

        it("should be false when null", () => {
            let ret = SingleKPIStore.validateQuota(null);
            expect(ret).to.be.true;
        })

        it("should be false when 2 digits string", () => {
            let ret = SingleKPIStore.validateQuota('2.22');
            expect(ret).to.be.false;
        })

        it("should be false when 2 digits number", () => {
            let ret = SingleKPIStore.validateQuota(2.22);
            expect(ret).to.be.false;
        })

        it("should be false when integer string", () => {
            let ret = SingleKPIStore.validateQuota('2');
            expect(ret).to.be.true;
        })

        it("should be false when integer number", () => {
            let ret = SingleKPIStore.validateQuota(2);
            expect(ret).to.be.true;
        })

        it("should be false when zero", () => {
            let ret = SingleKPIStore.validateQuota(0);
            expect(ret).to.be.true;
        })

        it("should be true when 1 digit string", () => {
            let ret = SingleKPIStore.validateQuota('1.2');
            expect(ret).to.be.false;
        })

        it("should be true when 1 digit number", () => {
            let ret = SingleKPIStore.validateQuota(1.2);
            expect(ret).to.be.false;
        })

    })
})