import Regex from '../Regex.jsx';
import { expect } from 'chai';

describe('Regex', function() {

  it('Regex test price 10 should be true', function() {

    var price = 10;
    var result = Regex.FactorRule.test(price);
    expect(result).to.equal(true);

  });
});
