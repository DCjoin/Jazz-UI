import { expect } from 'chai';
import {DataConverter} from 'util/Util.jsx';
describe("Util", () => {
  describe("#DatetimeToJson", () => {
    it("dateTime is 2016-11-17,result is 2016-11-17T00:00:00", () => {
      var date=new Date(2016, 10, 17);
      var result=DataConverter.DatetimeToJson(date);
      var exp='2016-11-17T00:00:00';
      expect(result===exp).to.be.true;
  })
  })
  describe("#JsonToDateTime", () => {
    it("Json is 2016-11-17T00:00:00,result is correct", () => {
      var json='2016-11-17T00:00:00';
      var result=DataConverter.JsonToDateTime(json);
      var exp=new Date(2016, 10, 17).getTime();
      expect(result===exp).to.be.true;
  })
  })
})
