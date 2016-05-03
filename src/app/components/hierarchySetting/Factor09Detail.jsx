'use strict';

import React from "react";
var Factor09Detail = React.createClass({
  render: function() {
    return (
      <table className="powerfactor" cellpadding="0" cellspacing="0"><thead><tr className="first-head"><th colSpan="2">减收</th><th colSpan="4">增收</th></tr><tr className="second-head"><th>功率因数</th><th>月减收比例</th><th>功率因数</th><th>月增收比例</th><th>功率因数</th><th>月增收比例</th></tr></thead><tbody><tr><td>0.90</td><td>0.00</td><td>0.89</td><td>0.5</td><td>0.75</td><td>7.5</td></tr><tr><td>0.91</td><td>0.15</td><td>0.88</td><td>1.0</td><td>0.74</td><td>8.0</td></tr><tr><td>0.92</td><td>0.30</td><td>0.87</td><td>1.5</td><td>0.73</td><td>8.5</td></tr><tr><td>0.93</td><td>0.45</td><td>0.86</td><td>2.0</td><td>0.72</td><td>9.0</td></tr><tr><td>0.94</td><td>0.60</td><td>0.85</td><td>2.5</td><td>0.71</td><td>9.5</td></tr><tr><td rowSpan="9">0.95~1.00</td><td rowSpan="9">0.75</td><td>0.84</td><td>3.0</td><td>0.70</td><td>10.0</td></tr><tr><td>0.83</td><td>3.5</td><td>0.69</td><td>11.0</td></tr><tr><td>0.82</td><td>4.0</td><td>0.68</td><td>12.0</td></tr><tr><td>0.81</td><td>4.5</td><td>0.67</td><td>13.0</td></tr><tr><td>0.80</td><td>5.0</td><td>0.66</td><td>14.0</td></tr><tr><td>0.79</td><td>5.5</td><td>0.65</td><td>15.0</td></tr><tr><td>0.78</td><td>6.0</td><td colSpan="2" rowSpan="3">&lt;=0.64，每减少0.01，增加2.0</td></tr><tr><td>0.77</td><td>6.5</td></tr><tr><td>0.76</td><td>7.0</td></tr></tbody></table>
      )
  },
});
module.exports = Factor09Detail;
