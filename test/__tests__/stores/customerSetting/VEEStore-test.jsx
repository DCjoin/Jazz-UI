import VEEStore from 'stores/customerSetting/VEEStore.jsx';
import { expect } from 'chai';

describe('VEEStore', function() {
  var testDelayAndIntervalCase = [{
    Delay: 15,
    Interval: 60
  },
    {
      Delay: 30,
      Interval: 120
    },
    {
      Delay: 15,
      Interval: 240
    },
    {
      Delay: 60,
      Interval: 480
    },
    {
      Delay: 120,
      Interval: 1440
    },
    {
      Delay: 0,
      Interval: 1440
    }];
  var expectResult = [
    '0:15, 1:15, 2:15, 3:15, 4:15, 5:15, 6:15, 7:15, 8:15, 9:15, 10:15, 11:15, 12:15, 13:15, 14:15, 15:15, 16:15, 17:15, 18:15, 19:15, 20:15, 21:15, 22:15, 23:15',
    '0:30, 2:30, 4:30, 6:30, 8:30, 10:30, 12:30, 14:30, 16:30, 18:30, 20:30, 22:30',
    '0:15, 4:15, 8:15, 12:15, 16:15, 20:15',
    '1:00, 9:00, 17:00',
    '2:00',
    '0:00'
  ];

  it('getScanTime test should be right', function() {

    testDelayAndIntervalCase.forEach((item, index) => {
      //console.log('Delay:' + item.Delay + '    Interval:' + item.Interval);
      var result = VEEStore.getScanTime(item.Delay, item.Interval)[0];
      //console.log('result:' + result);
      expect(result).to.equal(expectResult[index]);
    })

  });
});
