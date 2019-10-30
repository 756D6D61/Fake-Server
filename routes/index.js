var express = require('express')
var { format } = require('date-fns')
const random = require('canvas-sketch-util/random')
var router = express.Router()

const getValue = (preValue, boundaries) => {
  if(!prevValue) {
    return random.range(boundaries[0], boundaries[1])
  } else {
    const increment = random.range(boundaries[0], boundaries[1]) * 0.01 * (random.value() > 0.5 ? -1:1)
    return preValue + (preValue + increment < 0 ? increment * -1 : increment)
  }
}

const routes = [
  { name: 'activations', boundaries: [1000, 2000] }, 
  { name: 'on-time', boundaries: [0.1, 1] }
]

const splitByConfig = {
  technology: ['adsl', 'fttc']
}

routes.map(route => {
  return router.get(`/${route.name}`, function(req, res, next) {
    let data = {}
    const splitBy = req['split-by']
    const start = req.query['start']
    const end = req.query['end']

    const splitBys = splitByConfig[splitBy] || []

    let allTimeStamps = []

    if(start && end) {
      const startTimeStamp = Number(format(new Date(start), 'T'))
      const endTimeStamp = Number(format(new Date(end), 'T'))

      for (let i = startTimeStamp; i<= endTimeStamp; i = i+90000) {
        allTimeStamps.push(i)
      }
    }

    splitBys.forEach(split => {
      let values = []
      return (data[split] = allTimeStamps.map((timestamp, index) => {
        const prevValue = values.length > 0 ? values[index - 1] : false
        const value = getValue(prevValue, route.boundaries)
        values.push(value)
        return {
          timestamp, 
          value
        }
      }))
    })

    let total = []
    Object.keys(data).map(dataKey => {
      return data[dataKey].map((datum, index) => {
        if(total[index]) {
          const summedValue= {
            ...total[index],
            value: total[index].value + datum.value
          }
          return total.splice(index, 1, summedValue)
        } else {
          return total.push(datum)
        }
      })
    })
    data. total = total
    res.json({
      meta: {},
      data
    })
  })
})

module.exports = router;
