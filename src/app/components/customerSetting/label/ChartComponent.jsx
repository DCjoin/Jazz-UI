'use strict';

import React from 'react';
let Highcharts = window.Highcharts;
import LabelChartComponent from '../../energy/LabelChartComponent.jsx';
import CommonFuns from '../../../util/Util.jsx';
import mui from 'material-ui';


var showTitle = false,
  //labels property
  //firstLabelWidth = 150, //the first label's(A) width
  widthIncrease = 30, // the second label is wider than the first one
  jh = 15, // standered label's arrow's half height
  jw = 20, // standered label's arrow's half width
  lh = 30,
  baseX = 20, // the x-coordinate for the labels
  baseY = 25, // the y-coordinate for the labels
  spaceH = 10, // the height space between labels

  // tag labels property
  tw = 67, //tag label's width
  tjh = 23, //tag label's arrow's half height
  tjw = 23, //tag label's arrow's half width
  wholeTagWidth = 0,
  tagAndSpaceWidth = 0,
  tagTitleAboveHeight = 30,
  labelsHeight = 0,
  labelsWidth = 0,
  // splitLine's property
  linespace = 15, //the space between the splitLine and label

  lineTagSpace = 12, // the space between the splitLine and the tag label

  arrowSpace = 15, // the space between the arrow and the labels

  config = {
    labelingLevels: [{
      Name: 'A'
    }, {
      Name: 'B'
    }, {
      Name: 'C'
    }, {
      Name: 'D'
    }, {
      Name: 'E'
    }, {
      Name: 'F'
    }, {
      Name: 'G'
    }, {
      Name: 'H'
    }]
  },

  labelSizeConfig = {
    3: {
      firstLabelWidth: 25,
      widthIncrease: 60,
      jh: 15,
      jw: 12,
      spaceH: 9
    },
    4: {
      firstLabelWidth: 25,
      widthIncrease: 40,
      jh: 15,
      jw: 12,
      spaceH: 9
    },
    5: {
      firstLabelWidth: 25,
      widthIncrease: 30,
      jh: 15,
      jw: 12,
      spaceH: 9
    },
    6: {
      firstLabelWidth: 25,
      widthIncrease: 24,
      jh: 15,
      jw: 12,
      spaceH: 9
    },
    7: {
      firstLabelWidth: 25,
      widthIncrease: 20,
      jh: 15,
      jw: 12,
      spaceH: 9
    },
    8: {
      firstLabelWidth: 25,
      widthIncrease: 17,
      jh: 15,
      jw: 12,
      spaceH: 9
    }
  };


class ChartComponent {
  constructor(props) {
    // super(props);
    this.state = {
    };
  }
  createChart(isFromRender) {
    var me = this;

    if (!isFromRender) {
      return;
    }

    me.chartRenderer = new Highcharts.Renderer(
      me.refs.jazz_energy_view.getDOMNode(),
      400,
      me.props.chartHeight + 40
    );
    var data = {
      LabelingLevels: config.labelingLevels.slice(0, me.props.levelCount),
      TargetEnergyData: []
    };
    me.initData(data, me.chartRenderer);
  }
  initProperties(data) {
    var me = this,
      d = data,
      len = d.LabelingLevels.length,
      lc = labelSizeConfig[len];

    me.firstLabelWidth = lc['firstLabelWidth'];
    widthIncrease = lc['widthIncrease'];
    jh = lc['jh'];
    jw = lc['jw'];
    spaceH = lc['spaceH'];
  }
  caculatePosition(data) {
    var d = data,
      me = this,
      len = d.LabelingLevels.length,
      elen = d.TargetEnergyData.length;

    var chartHeight = lh + (len - 1) * (lh + spaceH) + tagTitleAboveHeight + 20;
    var chartWidth = firstLabelWidth + (len - 1) * widthIncrease + jw + elen * (wholeTagWidth + lineTagSpace * 2);

    labelsHeight = lh + (len - 1) * (lh + spaceH);
    labelsWidth = firstLabelWidth + (len - 1) * widthIncrease + jw;
  }
  componentDidMount() {
    this.createChart(true);
  }
  componentDidUpdate() {
    this.createChart(true);
  }
  render() {
    return (
      <div style={{
        flex: 1
      }} className="pop-chart-paper" ref="jazz_energy_view"/>
      );
  }

}

ChartComponent.propTypes = {
  levelCount: React.PropTypes.number,
  chartHeight: React.PropTypes.number
};
ChartComponent.defaultProps = {
  levelCount: 5,
  chartHeight: 330
};

module.exports = ChartComponent;
