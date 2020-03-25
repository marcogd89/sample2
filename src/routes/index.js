const express = require('express');
/* eslint-disable */
const router = express.Router();
/* eslint-enable */
const axios = require('axios');
const logger = require('../lib/util').logger;
const salesLogger = require('../lib/util').salesLogger;
const CryptoJS = require('crypto-js');

/* GET index route */
router.get('/CBNotification', (req, res) => {
  res.status(200).json({title: 'CBNotification'});
});

/* GET index route */
router.post('/CBNotification', async (req, res) => {

  const CBHOOK = (process.env.REGION="PRODUCTION") ? process.env.SLACK_WEBHOOK : process.env.WEBHOOK_TEST;
  const reqbody = processIN(req.body);
  logger.info(`${reqbody}`);
  
  var jsonObj = JSON.parse(reqbody);
  salesLogger.info(`${JSON.stringify(jsonObj)}`);

//  console.log(CBHOOK);
  
  let saleType;
  if (jsonObj.lineItems[0].lineItemType='ORIGINAL') {
      saleType="New Sale for " + jsonObj.vendor;    
  } else {
      saleType="Upsell"; 
  };

//  console.log("ok");

  const requestBody = {
    'username': 'CB Notification for ' + jsonObj.affiliate, // This will appear as user name who posts the message
    'text': saleType, // text
    'icon_emoji': ':bangbang:', // User icon, you can also use custom icons here
    'attachments': [{ // this defines the attachment block, allows for better layout usage
      'color': '#eed140', // color of the attachments sidebar.
      'fields': [ // actual fields
        {
            'title': 'Account',
            'value': jsonObj.affiliate,
            'short': false 
        },
        {
          'title': 'Product', // Custom field
          'value': jsonObj.lineItems[0].productTitle, // Custom value
          'short': false // long fields will be full width
        },
        {
          'title': 'Commission Amount (USD$)',
          'value': jsonObj.totalAccountAmount,
          'short': true
        }
      ]
    }]
  };

  let response;

  try {
    logger.info(CBHOOK, requestBody);
    response = await axios.post(CBHOOK, requestBody);
    res.status(response.status).json(response.data);
  } catch (error) {
    res.status(500).json(error.message);
  }
});


function processIN(secretParams) {
  let encrypted = CryptoJS.enc.Base64.parse(decodeURIComponent(secretParams.notification));
  let ive = CryptoJS.enc.Base64.parse(decodeURIComponent(secretParams.iv));

  let key = CryptoJS.enc.Utf8.parse(CryptoJS.SHA1('796E87324C49BD55').toString().substring(0, 32));

  let decrypted = CryptoJS.AES.decrypt(
      { ciphertext: encrypted },
      key,
      {
          iv: ive,
          mode: CryptoJS.mode.CBC,
          padding: CryptoJS.pad.Pkcs7
      }
  );
  const schema =  decrypted.toString(CryptoJS.enc.Utf8);
  
  return schema;
}

module.exports = router;
