const pino = require('pino');
const isProd = process.env.REGION == 'PRODUCTION'
const fs = require('fs');
const logOptions = {
      safe: true,
      level: 'info',
      prettifier: require('pino-pretty'),
      prettyPrint: {
        levelFirst: true,
        translateTime: true,
        messageKey: 'errStack'
      }
    }

const dest = pino.destination('./logs/sales.txt')
const dest2 = pino.destination('./logs/log.txt')
  //: pino.destination(1)
const salesLogger = pino(logOptions, dest)
const logger = pino(logOptions, dest2)

setInterval(function() {
  let stats = fs.statSync('./logs/log.txt')
  let fileSizeInBytes = stats['size']
  let fileSizeInMegabytes = fileSizeInBytes / 1000000
  console.log('Writing file');
  if (fileSizeInMegabytes > .25) {
    fs.unlink('./logs/log.txt', () => {
      dest2.reopen()
    })
  }
  let stats2 = fs.statSync('./logs/sales.txt')
  let fileSizeInBytes2 = stats2['size']
  let fileSizeInMegabytes2 = fileSizeInBytes2 / 1000000
  console.log('Writing sales file');
  if (fileSizeInMegabytes2 > .25) {
    fs.unlink('./logs/sales.txt', () => {
      dest.reopen()
    })
  }


}, 3600000)

// const pino = require('pino');
// const dest = pino.destination('./logs/log')
// const logger = pino({
//   safe: true,
//   timestamp: true,
//   level: 'info',
//   prettyPrint: true
// }, dest);

// setInterval(function() {
//   let stats = fs.statSync('./logs/log')
//   let fileSizeInBytes = stats['size']
//   let fileSizeInMegabytes = fileSizeInBytes / 1000000

//   if (fileSizeInMegabytes > 50) {
//     fs.unlink('./logs/log', () => {
//       dest.reopen()
//     })
//   }
// }, 3600000)

module.exports = {
  logger,
  salesLogger
};
