var express = require('express');
var { format } = require('date-fns');
const random = require('canvas-sketch-util/random');
var router = express.Router();

const getValue = (prevValue, boundaries) => {
  if (!prevValue) {
    // Get first value with random number between the two boundaries
    return random.range(boundaries[0], boundaries[1]);
  } else {
    const increment =
      random.range(boundaries[0], boundaries[1]) * 0.05 * random.sign();

    let newValue =
      prevValue + (prevValue + increment < 0 ? increment * -1 : increment);
    return newValue;
  }
};

const routes = [
  {
    name: 'savings',
    boundaries: [0, 10000]
  }
];

const splitByConfig = {
  month: [
    'jan',
    'feb',
    'march',
    'apr',
    'may',
    'jun',
    'jul',
    'aug',
    'sep',
    'oct',
    'nov',
    'dev'
  ],
  cateogry: ['birthday', 'wedding', 'holiday', 'misc'],
  undefined: []
};

routes.map(route => {
  return router.get(`/${route.name}`, function(req, res, next) {
    let data = {};
    // Get query params from URL
    const splitBy = req.query['split-by'];
    const start = req.query['start'];
    const end = req.query['end'];

    const splitBys = splitByConfig[splitBy] || [];

    let allTimestamps = [];

    if (start && end) {
      // Convert UNIX style date (2019-10-24T13:40:00Z) to timestamp, and then convert to a number so that we can add to it later
      const startTimestamp = Number(format(new Date(start), 'T'));
      const endTimestamp = Number(format(new Date(end), 'T'));

      // Increment 900000 milliseconds (15 minutes) from the startTimestamp until the endTimestamp
      for (let i = startTimestamp; i <= endTimestamp; i = i + 900000) {
        allTimestamps.push(i);
      }
    }

    splitBys.forEach(split => {
      let values = [];
      return (data[split] = allTimestamps.map((timestamp, index) => {
        const prevValue = values.length > 0 ? values[index - 1] : false;
        const value = getValue(prevValue, route.boundaries);
        values.push(value);
        return {
          timestamp,
          value
        };
      }));
    });

    res.json({
      meta: {},
      data
    });
  });
});

module.exports = router;
