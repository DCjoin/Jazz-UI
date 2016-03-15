'use strict';

import React from 'react';
let Highcharts = window.Highcharts;
import CommonFuns from '../../../util/Util.jsx';
import { JazzCommon } from '../../../util/Util.jsx';

var labelConfig = {
    3: {
      colors: ['#33963f', '#ffd92a', '#eb4040'],
      firstLabelWidth: 25,
      widthIncrease: 60,
      jh: 15,
      jw: 12,
      spaceH: 9
    },
    4: {
      colors: ['#33963f', '#95eb40', '#ffd92a', '#eb4040'],
      firstLabelWidth: 25,
      widthIncrease: 40,
      jh: 15,
      jw: 12,
      spaceH: 9
    },
    5: {
      colors: ['#33963f', '#40d12c', '#ffd92a', '#fc7b35', '#eb4040'],
      firstLabelWidth: 25,
      widthIncrease: 30,
      jh: 15,
      jw: 12,
      spaceH: 9
    },
    6: {
      colors: ['#33963f', '#40d12c', '#95eb40', '#ffd92a', '#fc7b35', '#eb4040'],
      firstLabelWidth: 25,
      widthIncrease: 24,
      jh: 15,
      jw: 12,
      spaceH: 9
    },
    7: {
      colors: ['#33963f', '#40d12c', '#95eb40', '#fffc2a', '#ffd92a', '#fc7b35', '#eb4040'],
      firstLabelWidth: 25,
      widthIncrease: 20,
      jh: 15,
      jw: 12,
      spaceH: 9
    },
    8: {
      colors: ['#33963f', '#40d12c', '#95eb40', '#fffc2a', '#ffd92a', '#fcaf35', '#fc7b35', '#eb4040'],
      firstLabelWidth: 25,
      widthIncrease: 17,
      jh: 15,
      jw: 12,
      spaceH: 9
    }
  },
  labelingLevels = [{
    Name: 'A',
    MinValue: null,
    MaxValue: null
  }, {
    Name: 'B',
    MinValue: null,
    MaxValue: null
  }, {
    Name: 'C',
    MinValue: null,
    MaxValue: null
  }, {
    Name: 'D',
    MinValue: null,
    MaxValue: null
  }, {
    Name: 'E',
    MinValue: null,
    MaxValue: null
  }, {
    Name: 'F',
    MinValue: null,
    MaxValue: null
  }, {
    Name: 'G',
    MinValue: null,
    MaxValue: null
  }, {
    Name: 'H',
    MinValue: null,
    MaxValue: null
  }],

  title = '能效标识',
  isDashboard = false,
  showTitle = false,

  //labels property
  firstLabelWidth = 150, //the first label's(A) width
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

  arrowSpace = 15; // the space between the arrow and the labels


let ChartComponent = React.createClass({
  chartRenderer: null,
  propTypes: {
    levelCount: React.PropTypes.number
  },
  getDefaultProps() {
    return {
      levelCount: 5
    };
  },

  getInitialState() {
    return {
    };
  },
  componentWillMount() {},
  componentDidMount() {
    this.createChart();
  },
  componentDidUpdate() {
    this.createChart();
  },
  shouldComponentUpdate: function(nextProps, nextState) {
    return (this.props.levelCount !== nextProps.levelCount);
  },
  render() {
    return <div style={{
        flex: 1
      }} className="pop-chart-paper" ref="jazz_energy_view"/>;
  },
  createChart: function() {
    var me = this;
    if (me.chartRenderer) {
      me.chartRenderer.destroy();
    }
    me.chartRenderer = new Highcharts.Renderer(
      me.refs.jazz_energy_view.getDOMNode(),
      400,
      me.props.levelCount * 40 + 40
    );
    var data = {
      LabelingLevels: labelingLevels.slice(0, me.props.levelCount),
      TargetEnergyData: []
    };
    me.initData(data, me.chartRenderer);
  },
  initProperties: function(data) {
    var me = this,
      d = data,
      len = d.LabelingLevels.length,
      lc = labelConfig[len];

    firstLabelWidth = lc['firstLabelWidth'];;
    widthIncrease = lc['widthIncrease'];
    jh = lc['jh'];
    jw = lc['jw'];
    spaceH = lc['spaceH'];
  },
  caculateProperties: function() {
    lh = 2 * jh;
    wholeTagWidth = tw + tjw;
    tagAndSpaceWidth = wholeTagWidth + 2 * lineTagSpace;
  },
  caculatePosition: function(data) {
    var d = data,
      me = this,
      len = d.LabelingLevels.length,
      elen = d.TargetEnergyData.length;

    // var chartHeight = lh + (len - 1) * (lh + spaceH) + tagTitleAboveHeight + 20;
      // var chartWidth = firstLabelWidth + (len - 1) * widthIncrease + jw + elen * (wholeTagWidth + lineTagSpace * 2);

    labelsHeight = lh + (len - 1) * (lh + spaceH);
    labelsWidth = firstLabelWidth + (len - 1) * widthIncrease + jw;
  },
  initData: function(data, renderer) {
    var me = this,
      d = data || me.props.energyData.toJS();

    me.initProperties(d);
    me.caculateProperties();
    me.caculatePosition(d);

    var labels = d.LabelingLevels,
      len = labels.length,
      cr = renderer || me.chartRenderer,
      labelMap = {};
      //stages = this.stages = [],

    if (showTitle) me.createTitle(title, cr);

    me.createArrow(baseX - arrowSpace, baseY, labelsHeight, cr); //y-axis
    me.createHighLowText(I18N.EM.Labeling.LowEnergy, I18N.EM.Labeling.HighEnergy, cr);

    var y,
      tooltipText = null,
      labelObj;
    for (var i = 0; i < len; i++) {
      y = baseY + i * (lh + spaceH);
      if (labels[i].MinValue !== null || labels[i].MaxValue !== null) {
        tooltipText = me.formatTooltipText(labels[i].MinValue, labels[i].MaxValue, labels[i].Uom);
      }
      labelObj = me.createLabel(baseX, y, i, labels[i].Name, labelConfig[len].colors[i], i + 1, tooltipText, cr);

      labelMap[i + 1] = {
        y: y,
        color: labelConfig[len].colors[i],
        name: labels[i].Name,
        labelObj: labelObj
      };
    }

    var energyData = d.TargetEnergyData,
      elen = energyData.length,
      item,
      value,
      uom,
      name,
      index,
      splitLineX;

    for (var j = 0; j < elen; j++) {
      item = energyData[j];
      name = item.Target.Name;
      splitLineX = baseX + labelsWidth + linespace + j * (wholeTagWidth + lineTagSpace * 2);

      me.createSplitLine(splitLineX, baseY - 20, labelsHeight + 40, cr);
      me.createTagName(splitLineX, baseY - tagTitleAboveHeight, name, cr);
      //me.stages.push({
      //    seriesKey: this.bizDelegator.getSeriesKeyByTarget(item.Target, j),
      //    type: null, //
      //    visible: true,
      //    suppressible: true,
      //    availableType: sType
      //});
      if (item.EnergyData.length > 0) {
        value = item.EnergyData[0].DataValue;
        uom = item.Target.Uom;
        index = item.Target.TargetId;
        me.createTagLabel(splitLineX + lineTagSpace, labelMap[index].y + jh, labelMap[index].name, labelMap[index].color, value, uom, name, cr);
      }
    }
    me.createSplitLine(splitLineX + (wholeTagWidth + lineTagSpace * 2), baseY - 20, labelsHeight + 40, cr);
  },
  formatTooltipText: function(minValue, maxValue, uom) {
    var str = '';
    if (CommonFuns.isNumber(minValue) && CommonFuns.isNumber(maxValue)) {
      str = JazzCommon.thousandCommafy(minValue) + uom + ' - ' + JazzCommon.thousandCommafy(maxValue) + uom;
    } else if (CommonFuns.isNumber(minValue)) {
      str = '> ' + JazzCommon.thousandCommafy(minValue) + uom;
    } else {
      str = '<= ' + JazzCommon.thousandCommafy(maxValue) + uom;
    }
    return str;
  },
  createLabel: function(basex, basey, number, displayText, color, index, tooltipText, renderer) {
    var me = this,
      label,
      basew = firstLabelWidth,
      increase = widthIncrease;

    basew = basew + number * increase;

    var agroup = renderer.g().add();

    if (tooltipText !== null) {
      label = renderer.label(tooltipText, basex + basew, basey, null, null, null, null, null, 'labeltooltip')
        .attr({
          padding: 6,
          fill: 'rgba(255,255,255, .85)',
          'stroke-width': 1,
          stroke: '#30a0d4',
          r: 3,
          zIndex: 8
        }).css({
        color: '#333333',
        cursor: 'default',
        fontSize: '12px',
        whiteSpace: 'nowrap'
      }).add().hide();
    }

    var path = renderer.path(['M', basex, basey, 'L', basex + basew, basey, basex + basew + jw, basey + jh, basex + basew, basey + lh, basex, basey + lh, 'z'])
      .attr({
        'stroke-width': 0,
        fill: color,
        stroke: color,
        value: 300,
        index: index
      })
      .add(agroup).on('mouseover', function(e) {
      //var target = e.target;
      //var index = target.attributes.index.value;
      //me.labelMap[index].labelObj.tooltip.show();
      path.attr({
        'stroke-width': 3
      });
      if (label) label.show();
    }).on('mouseout', function(e) {
      //var target = e.target;
      //var index = target.attributes.index.value;
      //me.labelMap[index].labelObj.tooltip.hide();
      path.attr({
        'stroke-width': 0
      });
      if (label) label.hide();
    });

    var text = renderer.text(displayText, basex + basew - (jw > 16 ? jw : 16), basey + Math.round((lh + 11) / 2))
      .css({
        color: 'white',
        fontSize: isDashboard ? '14px' : '16px'
      })
      .add(agroup).on('mouseover', function(e) {
      path.attr({
        'stroke-width': 3
      });
      if (label) label.show();
    }).on('mouseout', function(e) {
      path.attr({
        'stroke-width': 0
      });
      if (label) label.hide();
    });

    return {
      path: path,
      text: text,
      tooltip: label,
      group: agroup
    };
  },
  createArrow: function(x, y, h, renderer) {
    // arrow group
    var arrowGroup = renderer.g().add();
    //var x = 20, y = 20;

    //arrow's line
    renderer.path(['M', x, y, 'L', x, y + h])
      .attr({
        'stroke-width': 1,
        stroke: 'rgb(219, 219, 219)'
      // 'stroke-dasharray': 6
      })
      .add(arrowGroup);

    //arrow's head
    renderer.path(['M', x - 6, y + 10, 'L', x, y, x, y + 10, 'z'])
      .attr({
        'stroke-width': 1,
        stroke: 'rgb(219, 219, 219)',
        fill: 'rgb(219, 219, 219)'
      })
      .add(arrowGroup);
  },
  getSeriesStates: function() {},
  createTagLabel: function(basex, basey, text, color, value, uom, tagName, renderer) {
    var me = this,
      basew = tw,
      jh = tjh,
      jw = tjw,
      content = JazzCommon.thousandCommafy(value) + uom,
      tooltipText = tagName + ': <br/>' + content,
      tooltipWidth = Math.max(JazzCommon.GetArialStrLen(tagName), JazzCommon.GetArialStrLen(content)) * 12 + 10,
      tooltipX = basex - tooltipWidth;

    var label = renderer.label(tooltipText, tooltipX, basey - jh, null, null, null, null, null, 'labeltooltip')
      .attr({
        padding: 6,
        fill: 'rgba(255,255,255, .85)',
        'stroke-width': 1,
        stroke: '#30a0d4',
        align: 'left',
        r: 3,
        zIndex: 8
      }).css({
      color: '#333333',
      cursor: 'default',
      fontSize: '12px',
      whiteSpace: 'nowrap'
    }).add().hide();

    var path = renderer.path(['M', basex, basey,
      'L', basex + jw, basey - jh,
      basex + basew + jw, basey - jh,
      basex + basew + jw, basey + jh,
      basex + jw, basey + jh, 'z'])
      .attr({
        'stroke-width': 0,
        fill: color,
        stroke: color
      })
      .add().on('mouseover', function(e) {
      path.attr({
        'stroke-width': 3
      });
      label.show();
    }).on('mouseout', function(e) {
      path.attr({
        'stroke-width': 0
      });
      label.hide();
    });

    renderer.text(text, basex + jw + 10, basey + (isDashboard ? 10 : 12))
      .css({
        color: '#ffffff',
        fontSize: isDashboard ? '28px' : '34px'
      })
      .add().on('mouseover', function(e) {
      path.attr({
        'stroke-width': 3
      });
      label.show();
    }).on('mouseout', function(e) {
      path.attr({
        'stroke-width': 0
      });
      label.hide();
    });

  //renderer.text(value + uom, basex + jw, basey - 27)
  //        .css({
  //            color: '#3b3b3b',
  //            fontSize: isDashboard ?'12px':'16px'
  //        })
  //        .add();
  },
  createTagName: function(x, y, text, renderer) {
    var textLen,
      width,
      padding,
      me = this;
    if (!isDashboard) {
      textLen = JazzCommon.GetArialStrLen(text);
      if (textLen > 7) { //114px width and the forn size is 16
        text = JazzCommon.GetArialStr(text, 6);
      }

      width = Math.round(JazzCommon.GetArialStrLen(text) * 16);
      padding = Math.round((112 - width) / 2);
    } else {
      textLen = JazzCommon.GetArialStrLen(text);
      if (textLen > 7) { //114px width and the forn size is 16
        text = JazzCommon.GetArialStr(text, 6);
      }

      width = Math.round(JazzCommon.GetArialStrLen(text) * 12);
      padding = Math.round((80 - width) / 2);
    }

    renderer.text(text, x + padding, y)
      .css({
        color: '#757575',
        fontSize: isDashboard ? '12px' : '16px'
      })
      .add();
  },
  createSplitLine: function(x, y, h, renderer) {
    // line
    renderer.path(['M', x, y, 'L', x, y + h])
      .attr({
        'stroke-width': 1,
        stroke: 'rgb(219, 219, 219)'
      //'stroke-dasharray': 6
      })
      .add();
  },
  createHighLowText: function(ltext, htext, renderer) {
    var me = this;
    renderer.text(htext, baseX, baseY + labelsHeight + 20)
      .css({
        color: '#757575',
        fontSize: '14px'
      })
      .add();

    renderer.text(ltext, baseX, baseY - 10)
      .css({
        color: '#757575',
        fontSize: '14px'
      })
      .add();
  },
  createTitle: function(text, renderer) {
    var x = parseInt(this.state.ctWidth / 2) - 80;
    x = x > 10 ? x : 10;
    renderer.text(text, x, 36)
      .css({
        color: '#3b3b3b',
        fontSize: '16px'
      })
      .add();
  }
});

module.exports = ChartComponent;
