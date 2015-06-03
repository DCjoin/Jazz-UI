'use strict';
import {dateAdd} from '../../util/Util.jsx';

let ChartXAxisSetter = {
    statics: {
        setTicks: function (min, max) {
            var width = this.width,
                    serieses = this.series,
                    series,
                    ret = [];
            if (!serieses || serieses.length === 0) return;
            var xDataMax = 0;
            for (var i = 0; i < serieses.length; ++i) {
                if (serieses[i].xData) {
                    if (serieses[i].xData.length > xDataMax) {
                        series = serieses[i];
                    }
                }
            }
            if (!series) series = serieses[0];
            var step = series.options.option.step;
            ret.info = {
                higherRanks: {}
            };
            var tpp = (max - min) / width;
            var cleanTick = function (series, ret) {
                var idx;
                for (var i = 0, len = ret.length; i < len; ++i) {
                    idx = series.xData.findIndex( (item) => {return item == ret[i]; } );
                    if (idx != -1) {
                        if (series.yData[idx] === null) {
                            ret.splice(i, 1);
                            delete ret.info.higherRanks[ret[i]];
                        }
                    }
                    else {
                        ret.splice(i, 1);
                        delete ret.info.higherRanks[ret[i]];
                    }
                }
            };
            var paddingTick = function (obj) {

                if (obj.ret.length <= 0) return;
                var step = obj.step,
                    tick, ret = obj.ret;

                do {
                    if (tick) {
                        ret.unshift(tick);
                        ret.info.higherRanks[tick] = obj.shortLabel;
                    }
                    tick = dateAdd(new Date(ret[0]), 0 - obj.round, step);
                    tick = tick.getTime();
                }
                while (tick > obj.min);
                tick = null;
                do {
                    if (tick) {
                        ret.push(tick);
                        ret.info.higherRanks[tick] = obj.shortLabel;
                    }
                    tick = tick = dateAdd(new Date(ret[ret.length - 1]), obj.round, step);
                    tick = tick.getTime();
                }
                while (tick < obj.max);

            };
            var calcSegment = function (obj) {
                var min = new Date(obj.min),
                    max = new Date(obj.max),
                    step = obj.step,
                    ret = obj.ret,
                    lval = 0,
                    series = obj.series,
                    round = obj.round;
                var delta = 0;
                if (obj.round != 1) {
                    delta = obj.round - min[obj.getTime]() + obj.base;
                    delta = delta == obj.round ? 0 : delta;
                }
                var tick = dateAdd(new Date(min), delta, step);  //extDate.add(min, step, delta);
                if (obj.tickFormatter) tick = obj.tickFormatter(tick);
                while (tick <= max) {
                    //先添加周期的日期labal，然后如果之间有间隙，再继续插入label
                    if (((tick.getTime() - lval) / obj.tpp) >= 80) {
                        lval = tick.getTime();
                        ret.push(lval);
                        ret.info.higherRanks[lval] = obj.longLabel;
                    }
                    tick = dateAdd(new Date(tick), obj.round, step);//extDate.add(tick, step, obj.round);
                }
                if (obj.deep) {
                    var hasSpace = true;
                    do {
                        var len = ret.length;

                        for (let i = 0; i < len - 1; i++) {
                            var first = ret[i];
                            var second = ret[i + 1];
                            var space = (second - first) / obj.tpp;
                            if (space > 160) {
                                //当obj.round / 2不为整数的时候，需要space大于200
                                if (((obj.round / 2) % 1) !== 0 && space < 200) {
                                    continue;
                                }
                                tick = dateAdd(new Date(first), obj.round / 2, step);//extDate.add(new Date(first), step, obj.round / 2);
                                lval = tick.getTime();
                                ret.push(lval);
                                ret.info.higherRanks[lval] = obj.shortLabel;
                            }
                        }
                        if (len != ret.length) {
                            hasSpace = true;
                            obj.round = Math.ceil(obj.round / 2);
                            ret.sort();
                        }
                        else {
                            hasSpace = false;
                        }
                    } while (hasSpace);
                }
                var maxPadding, sign;
                if (ret.length == 1) {
                    maxPadding = Math.max(ret[0] - obj.min, obj.max - ret[0]);
                    sign = maxPadding == (ret[0] - obj.min) ? -1 : 1;
                    if ((maxPadding / obj.tpp) > 80) {
                        let i = obj.unit;
                        do {
                            tick = dateAdd(new Date(ret[0]), i * sign, step);//extDate.add(new Date(ret[0]), step, i * sign);
                            lval = tick.getTime();
                            delta = Math.abs(lval - ret[0]) / obj.tpp;
                            i += obj.unit;
                        }
                        while (delta < 80);

                        ret.push(lval);
                        ret.info.higherRanks[lval] = obj.shortLabel;
                        ret.sort();
                        i -= obj.unit;
                        obj.round = i;
                    }
                }
                if (ret.length === 0) {
                    maxPadding = obj.max - obj.min;
                    sign = 1;
                    if ((maxPadding / obj.tpp) > 80) {
                        var i = obj.unit;
                        do {
                            tick = dateAdd(new Date(obj.min), i * sign, step);//extDate.add(new Date(obj.min), step, i * sign);
                            lval = tick.getTime();
                            delta = Math.abs(lval - obj.min) / obj.tpp;
                            i += obj.unit;
                        }
                        while (delta < 80);

                        ret.push(obj.min);
                        ret.info.higherRanks[obj.min] = obj.shortLabel;
                        ret.sort();
                        i -= obj.unit;
                        obj.round = i;
                    }
                }
                if (round != 1 && obj.round != round) {
                    paddingTick(obj);
                }
                //cleanTick(obj.series, ret);
            };

            var calcPoint = function (obj) {
                var series = obj.series,
                    xData = series.xData;
                var yData = series.yData;
                var firstData, i = 0;
                var ret = obj.ret;

                while (i < xData.length) {
                    if (yData[i] !== null) {
                        firstData = xData[i];
                        break;
                    }
                    ++i;
                }

                //var validRange = max - firstData;
                //var interval = Math.floor(validRange / (obj.tpp * xData.length));
                //var count = 1, sum = interval;
                //while (sum < 80) {
                //    count++;
                //    sum += interval;
                //}
                var count = 1;
                var j = i;
                while ((xData[j + count] - xData[j]) / obj.tpp < 80) {
                    count++;
                    //j++;
                }
                j = i;
                while (j < xData.length) {
                    //when use all data, data will be greater than xAxis
                    if (xData[j] >= min && xData[j] <= max) {
                        ret.push(xData[j]);
                        ret.info.higherRanks[xData[j]] = obj.label;


                    }
                    j += count;

                }

                //cleanTick(obj.series, ret);
            };
            switch (step) {
                case 0: //raw must show 0 o'clock
                case 6:
                case 7:
                case 1: //hour must show 0 o'clock
                    {
                        calcSegment({
                            min: min,
                            max: max,
                            round: 24,
                            tpp: tpp,
                            base: 0,
                            deep: 1,
                            unit: 1,
                            series: series,
                            step: 'HOUR',
                            longLabel: 'dayhour',
                            shortLabel: 'hour',
                            getTime: 'getHours',
                            ret: ret
                        });
                        break;
                    }
                case 2: //day
                    {
                        calcPoint({
                            series: series,
                            label: 'day',
                            tpp: tpp,
                            ret: ret
                        });
                        if (ret.length === 0) {
                            calcSegment({
                                min: min,
                                max: max,
                                round: 1,
                                tpp: tpp,
                                base: 0,
                                deep: 0,
                                unit: 1,
                                series: series,
                                step: 'DAY',
                                longLabel: 'day',
                                shortLabel: 'day',
                                getTime: 'getDay',
                                ret: ret
                            });
                        }
                        break;
                    }
                case 3: //month
                    {
                        calcSegment({
                            min: min,
                            max: max,
                            round: 12,
                            tpp: tpp,
                            base: 0,
                            deep: 1,
                            unit: 1,
                            series: series,
                            step: 'MONTH',
                            longLabel: 'fullmonth',
                            shortLabel: 'month',
                            getTime: 'getMonth',
                            ret: ret,
                            tickFormatter: function (tick) {
                                return new Date(tick.getFullYear(), tick.getMonth(), 16);
                            }
                        });
                        if (ret.length === 0) {
                            calcPoint({
                                series: series,
                                label: 'month',
                                tpp: tpp,
                                ret: ret
                            });
                        }
                        break;
                    }
                case 4: //year
                    {
                        calcPoint({
                            series: series,
                            label: 'year',
                            tpp: tpp,
                            ret: ret
                        });
                        if (ret.length === 0) {
                            calcSegment({
                                min: min,
                                max: max,
                                round: 12,
                                tpp: tpp,
                                base: 0,
                                deep: 1,
                                unit: 1,
                                series: series,
                                step: 'MONTH',
                                longLabel: 'year',
                                shortLabel: 'fullmonth',
                                getTime: 'getMonth',
                                ret: ret
                            });
                        }
                        break;
                    }
                case 5: //week
                    {
                        calcSegment({
                            min: min,
                            max: max,
                            round: 7,
                            tpp: tpp,
                            base: 1,
                            deep: 0,
                            unit: 7,
                            series: series,
                            step: 'DAY',
                            longLabel: 'day',
                            shortLabel: 'day',
                            getTime: 'getDay',
                            ret: ret
                        });
                        break;
                    }
            }
            return ret;
        }
    }
};

module.exports = ChartXAxisSetter;
