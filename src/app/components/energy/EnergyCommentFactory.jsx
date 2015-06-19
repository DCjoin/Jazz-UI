'use strict';

import ReaderFuncs from '../../stores/MixedChartReader.jsx';

let EnergyCommentFactory = {
        //comments relative functions start
        createCommentSeriesByTargetEnergyDataItem: function (item, step, onSeriesId, xaxisMap) {
            var comments = item.EnergyAssociatedData.Comments,
                target = item.Target,
                points = [], comment, xaxis, text,
                factory = EnergyCommentFactory;

            for (var i = 0, len = comments.length; i < len; i++) {
                comment = comments[i];
                xaxis = ReaderFuncs.translateDate.apply(null, [comment.UtcTimeStamp, 1, step]);
                text = comment.Comment;

                xaxisMap[xaxis] = xaxis;//将comment的x轴放到此map中，如果alarm也在这个时间点存在的话，将alarm点提高20像素
                points.push(factory.getCommentPointObj(xaxis, text, comment.Id));
            }
            var seriesObj = factory.getNewFlagSeriesObj(points, step, onSeriesId);
            return seriesObj;
        },
        getCommentPointObj: function (xaxis, text, commentId) {
            return {
                x: xaxis,
                commentId:commentId,
                title: ' ',
                text: text
            };
        },
        getNewFlagSeriesObj: function (data, step, onSeriesId) {
            var newFlagSeries = {
                    type: 'flags',
                    data: data,
                    option: {
                        step: step,
                        flagType: 'comment'
                    },
                    onSeries: onSeriesId,
                    //shape: 'squarepin',
                    y:-18,
                    shape: 'url(./Images/Comments_Normal_Icon.png)',
                    showInLegend: false,
                    width: 16,
                    tooltip: {
                        formatter: function () {
                            var text = this.point.text;

                            if (text === null || text === '') {
                                text = ' ';
                            }
                            return text;
                        }
                    }
                };
            return newFlagSeries;
        },
        getFlagSeriesByOnSeriesId: function (onSeriesId, series, type) {
            var seriesItem;
            for (var i = 0, len = series.length; i < len; i++) {
                seriesItem = series[i];
                if (seriesItem.options.onSeries == onSeriesId && seriesItem.options.option.flagType == type) {//type == comment or alarm
                    return seriesItem;
                }
            }
        },
        getPointByTime: function (series, time) {
            var points = series.data, point;
            for (var i = 0, len = points.length; i < len; i++) {
                point = points[i];
                if (point.x == time) {
                    return point;
                }
            }
        },
        //comments relative functions end

        //alarms relative functions start
        createAlarmSeriesByTargetEnergyDataItem: function (item, onSeriesId, xaxisMap, step) {
            var alarms = item.EnergyAssociatedData.AlarmHistories,
                target = item.Target,
                points = [], alarm, xaxis, text,
                factory = EnergyCommentFactory;

            for (var i = 0, len = alarms.length; i < len; i++) {
                alarm = alarms[i];
                xaxis = ReaderFuncs.translateDate.apply(null, [alarm.UtcTime, 1, step]);
                points.push(factory.getAlarmPointObj(xaxis, alarm.Id, !!xaxisMap[xaxis]));
            }
            var seriesObj = factory.getNewAlarmFlagSeriesObj(points, onSeriesId);
            return seriesObj;
        },
        getAlarmPointObj: function (xaxis, alarmId, hasStackIndex) {
            var point = {
                x: xaxis,
                alarmId: alarmId,
                title: ' '
            };
            if (hasStackIndex) {
                point.customizedStackIndex = 1;
            }
            return point;
        },
        getNewAlarmFlagSeriesObj: function (data, onSeriesId) {
            var newFlagSeries = {
                type: 'flags',
                data: data,
                option: {
                    flagType: 'alarm'
                },
                onSeries: onSeriesId,
                shape: 'url(./Images/Alarm_Normal_Icon.png)',
                showInLegend: false,
                notShowTooltip: true,
                width: 16,
                tooltip: {
                    formatter: function () {
                        return '';
                    }
                },
                point: {
                    events: {
                        click: function (event) {
                            var chart = this.series.chart;
                            chart.trigger('ignorealarm', { event: event, point: this });
                        }
                    }
                },
                y: -18,
                stackDistance: 22
            };
            return newFlagSeries;
        },
        ignoreAlarm: function (point, chartCmp) {
            var alarmId = point.options.alarmId;
            var me = this;
            var factory = EnergyCommentFactory;
/*
            var win = Ext.create('Ext.window.Window', {
                scale: 'small',
                autoShow: true,
                modal: true,
                frame: false,
                frameHeader: false,
                buttons: [
                     {
                         text: I18N.Common.Operation.Ignore,
                         scale: 'medium',
                         minWidth: 45,
                         handler: function () {
                             var checkbox = win.down('checkbox');
                             var store = Ext.StoreManager.get('EnergyAlarmIgnoreStore');
                             if (!store) {
                                 store = Ext.create('REM.store.energy.EnergyAlarm', { storeId: 'EnergyAlarmIgnoreStore' });
                             }

                             if (checkbox.getValue()) {
                                 var ignorePoints = [];
                                 var ids = factory.getContinuousPointids(point, ignorePoints);

                                 store.load({
                                     action: 'batchignore',
                                     ignorePoints: ignorePoints,
                                     dto: { ids: ids },
                                     scope: this,
                                     callback: function (records, operation, success) {
                                         if (success) {
                                             var points = operation.ignorePoints;
                                             for (var i = 0, len = points.length; i < len; i++) {
                                                 points[i].remove(false);
                                             }

                                             if (chartCmp.ownerCt.xtype == 'widgetmaxchart' && chartCmp.ownerCt.smallCmpData) {
                                                 chartCmp.ownerCt.smallCmpData.isCommentOrAlarmChanged = true;
                                             }
                                         }
                                     }
                                 });
                             } else {
                                 store.load({
                                     action: 'ignore',
                                     alarmPoint: point,
                                     dto: { alarmId: alarmId },
                                     scope: this,
                                     callback: function (records, operation, success) {
                                         if (success) {
                                             operation.alarmPoint.remove(false);
                                             if (chartCmp.ownerCt.xtype == 'widgetmaxchart' && chartCmp.ownerCt.smallCmpData) {
                                                 chartCmp.ownerCt.smallCmpData.isCommentOrAlarmChanged = true;
                                             }
                                         }
                                     }
                                 });

                             }
                             win.close();
                             console.log(win);
                         }
                     },
                     {
                         text: I18N.Common.Button.Cancel,
                         scale: 'medium',
                         minWidth: 45,
                         handler: function () {
                             win.close();
                         }
                     }],
                items: {
                    xtype: 'panel',
                    margin: 0,
                    header: false,
                    frame: false,
                    frameHeader: false,
                    items: [{
                        xtype: 'container',
                        frame: false,
                        items: [{
                            xtype: 'label',
                            text: I18N.Common.Label.ConfirmIgnoreAlarm,
                            style: {
                                marginBottom: '5px',
                                display: 'block'
                            }
                        }, {
                            xtype: 'checkbox',
                            boxLabel: I18N.Common.Label.BatchIgnoreAlarm,
                            name:'ContinuePoints'
                        }]
                    }]
                }
            });*/
        },
        getContinuousPointids: function (selectedPoint, ignorePoints) {
            var series = selectedPoint.series,
                points = series.data,
                previousPoint,
                point, ids = [], position = 0;

            //找到当前选中alarm point的位置
            for (let i = 0, len = points.length; i < len; i++) {
                point = points[i];
                if (point == selectedPoint) {
                    position = i;
                    break;
                }
            }

            //找到连续的points
            for (let i = position, len = points.length; i < len; i++) {
                point = points[i];

                if (ids.length === 0 || point.x - previousPoint.x === 3600000) {//alarm都是小时步长，所以用3600000来判断是否是连续的
                    ids.push(point.options.alarmId);
                    ignorePoints.push(point);
                } else {
                    break;
                }
                previousPoint = point;
            }

            return ids;
        }
    //alarms relative functions end
  };

  module.exports = EnergyCommentFactory;
