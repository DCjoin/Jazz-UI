'use strict';

import React from "react";
var Factor085Detail = React.createClass({
  render: function() {
    if (window.currentLanguage === 0) {
      return (
        <table className="powerfactor" cellpadding="0" cellspacing="0"><thead><tr className="first-head"><th colSpan="2">减收</th><th colSpan="4">增收</th></tr><tr className="second-head"><th>功率因数</th><th>月减收比例</th><th>功率因数</th><th>月增收比例</th><th>功率因数</th><th>月增收比例</th></tr></thead><tbody><tr><td>0.85</td><td>0.00</td><td>0.84</td><td>0.5</td><td>0.70</td><td>7.5</td></tr><tr><td>0.86</td><td>0.1</td><td>0.83</td><td>1.0</td><td>0.69</td><td>8.0</td></tr><tr><td>0.87</td><td>0.2</td><td>0.82</td><td>1.5</td><td>0.68</td><td>8.5</td></tr><tr><td>0.88</td><td>0.3</td><td>0.81</td><td>2.0</td><td>0.67</td><td>9.0</td></tr><tr><td>0.89</td><td>0.4</td><td>0.80</td><td>2.5</td><td>0.66</td><td>9.5</td></tr><tr><td>0.90</td><td>0.5</td><td>0.79</td><td>3.0</td><td>0.65</td><td>10.0</td></tr><tr><td>0.91</td><td>0.65</td><td>0.78</td><td>3.5</td><td>0.64</td><td>11.0</td></tr><tr><td>0.92</td><td>0.80</td><td>0.77</td><td>4.0</td><td>0.63</td><td>12.0</td></tr><tr><td>0.93</td><td>0.95</td><td>0.76</td><td>4.5</td><td>0.62</td><td>13.0</td></tr><tr><td rowSpan="5">0.94~1.00</td><td rowSpan="5">1.10</td><td>0.75</td><td>5.0</td><td>0.61</td><td>14.0</td></tr><tr><td>0.74</td><td>5.5</td><td>0.60</td><td>15.0</td></tr><tr><td>0.73</td><td>6.0</td><td colSpan="2" rowSpan="3">&lt;=0.59，每减少0.01，增加2.0</td></tr><tr><td>0.72</td><td>6.5</td></tr><tr><td>0.71</td><td>7.0</td></tr></tbody></table>
        )
    } else {
      return (
        <table className="powerfactor" cellpadding="0" cellspacing="0"><thead><tr className="first-head"><th colSpan="2">Decrease income</th><th colSpan="4">Increase income</th></tr><tr className="second-head"><th>Power factor</th><th>Monthly decrease income proportion</th><th>Power factor</th><th>Monthly increase income proportion</th><th>Power factor</th><th>Monthly increase income proportion</th></tr></thead><tbody><tr><td>0.85</td><td>0.00</td><td>0.84</td><td>0.5</td><td>0.70</td><td>7.5</td></tr><tr><td>0.86</td><td>0.1</td><td>0.83</td><td>1.0</td><td>0.69</td><td>8.0</td></tr><tr><td>0.87</td><td>0.2</td><td>0.82</td><td>1.5</td><td>0.68</td><td>8.5</td></tr><tr><td>0.88</td><td>0.3</td><td>0.81</td><td>2.0</td><td>0.67</td><td>9.0</td></tr><tr><td>0.89</td><td>0.4</td><td>0.80</td><td>2.5</td><td>0.66</td><td>9.5</td></tr><tr><td>0.90</td><td>0.5</td><td>0.79</td><td>3.0</td><td>0.65</td><td>10.0</td></tr><tr><td>0.91</td><td>0.65</td><td>0.78</td><td>3.5</td><td>0.64</td><td>11.0</td></tr><tr><td>0.92</td><td>0.80</td><td>0.77</td><td>4.0</td><td>0.63</td><td>12.0</td></tr><tr><td>0.93</td><td>0.95</td><td>0.76</td><td>4.5</td><td>0.62</td><td>13.0</td></tr><tr><td rowSpan="5">0.94~1.00</td><td rowSpan="5">1.10</td><td>0.75</td><td>5.0</td><td>0.61</td><td>14.0</td></tr><tr><td>0.74</td><td>5.5</td><td>0.60</td><td>15.0</td></tr><tr><td>0.73</td><td>6.0</td><td colSpan="2" rowSpan="3">"&lt;=0.59,increase by 2.0 per decrease by 0.01"</td></tr><tr><td>0.72</td><td>6.5</td></tr><tr><td>0.71</td><td>7.0</td></tr></tbody></table>
        )
    }

  },
});
module.exports = Factor085Detail;
