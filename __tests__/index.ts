import fixedAxis from '../lib/index';

const E_CHARTS_DEFAULT_OPTION = {
  title: {
    text: null,
    align: 'left',
    textStyle: {
      fontSize: '14px',
      fontWeight: 400,
    },
    margin: 20,
  },
  xAxis: {
    type: 'time',
    splitNumber: 3,
    axisTick: {
      length: 0,
    },
  },
  yAxis: {
    type: 'value',
    axisLabel: {
      margin: 0,
      verticalAlign: 'top',
      padding: [4, 0, 0, 0],
    },
    min: 0,
  },
  tooltip: {
    trigger: 'axis',
    textStyle: {
      fontSize: 10,
      lineHeight: 8,
    },
    transitionDuration: 0,
  },
  grid: {
    top: 20,
    bottom: 5,
    left: 5,
    containLabel: true,
  },
  series: [
    {
      name: 'test',
      type: 'line',
      silent: true,
      data: [
        [1546300800000, 0],
        [1546387200000, 2],
        [1546473600000, 4],
        [1546560000000, 6],
        [1546646400000, 0],
        [1546732800000, 10],
        [1546819200000, 30],
        [1546905600000, 0],
        [1546992000000, 2],
        [1547078400000, 5],
        [1547164800000, 7],
        [1547251200000, 15],
      ] as [number, number][],
    },
  ],
};

test('generate axis option', () => {
  const option = fixedAxis({
    axis: E_CHARTS_DEFAULT_OPTION.yAxis,
    series: E_CHARTS_DEFAULT_OPTION.series,
    splitNumber: 2,
  });
  const expectMax = 40;
  const expectMin = 0;
  const expectInterval = 20;
  const expectSplitNumber = 2;
  expect(expectMax).toBe(option.max);
  expect(expectMin).toBe(option.min);
  expect(expectInterval).toBe(option.interval);
  expect(expectSplitNumber).toBe(option.splitNumber);
});
