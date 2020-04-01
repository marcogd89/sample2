const express = require('express');
/* eslint-disable */
const router = express.Router();
/* eslint-enable */
const axios = require('axios');
const logger = require('../lib/util').logger;
const salesLogger = require('../lib/util').salesLogger;
const CryptoJS = require('crypto-js');


////
//@ts-check
const CosmosClient = require('@azure/cosmos').CosmosClient

const config = require('../db/config')
const url = require('url')

const endpoint = config.endpoint
const key = config.key

const databaseId = config.database.id
const containerId = config.container.id
const partitionKey = { kind: 'Hash', paths: ['/Country'] }

const client = new CosmosClient({ endpoint, key })

/**
 * Create the database if it does not exist
 */
async function createDatabase() {
  const { database } = await client.databases.createIfNotExists({
    id: databaseId
  })
  console.log(`Created database:\n${database.id}\n`)
}


/**
 * Read the database definition
 */
async function readDatabase() {
  const { resource: databaseDefinition } = await client
    .database(databaseId)
    .read()
  console.log(`Reading database:\n${databaseDefinition.id}\n`)
}

/**
 * Create the container if it does not exist
 */
async function createContainer() {
  const { container } = await client
    .database(databaseId)
    .containers.createIfNotExists(
      { id: containerId, partitionKey },
      { offerThroughput: 400 }
    )
  console.log(`Created container:\n${config.container.id}\n`)
}

/**
 * Read the container definition
 */
async function readContainer() {
  const { resource: containerDefinition } = await client
    .database(databaseId)
    .container(containerId)
    .read()
  console.log(`Reading container:\n${containerDefinition.id}\n`)
}

/**
 * Scale a container
 * You can scale the throughput (RU/s) of your container up and down to meet the needs of the workload. Learn more: https://aka.ms/cosmos-request-units
 */
async function scaleContainer() {
  const { resource: containerDefinition } = await client
    .database(databaseId)
    .container(containerId)
    .read()
  const {resources: offers} = await client.offers.readAll().fetchAll();
  
  const newRups = 500;
  for (var offer of offers) {
    if (containerDefinition._rid !== offer.offerResourceId)
    {
        continue;
    }
    offer.content.offerThroughput = newRups;
    const offerToReplace = client.offer(offer.id);
    await offerToReplace.replace(offer);
    console.log(`Updated offer to ${newRups} RU/s\n`);
    break;
  }
}

/**
 * Exit the app with a prompt
 * @param {string} message - The message to display
 */
function exit(message) {
  console.log(message)
  console.log('Press any key to exit')
  // process.stdin.setRawMode(true)
  // process.stdin.resume()
  // process.stdin.on('data', process.exit.bind(process, 0))
}


createDatabase()
  .then(() => readDatabase())
  .then(() => createContainer())
  .then(() => readContainer())
  .then(() => scaleContainer())
  //.then(() => createNotificationItem(config.items.Notification))
  .then(() => {
    exit(`Completed successfully`)
  })
  .catch(error => {
    exit(`Completed with error ${JSON.stringify(error)}`)
  })

///

/**
 * Create family item if it does not exist
 */
async function createNotificationItem(itemBody) {
  const { item } = await client
    .database(databaseId)
    .container(containerId)
    .items.upsert(itemBody)
  console.log(`Created family item with id:\n${itemBody.receipt}\n`)
}



/* GET index route */
router.get('/CBNotification', (req, res) => {
  res.status(200).json({title: 'CBNotification'});
});

/* GET index route */
router.post('/CBNotification', async (req, res) => {

  
  const reqbody = processIN(req.body);
  logger.info(`${reqbody}`);
  
  var jsonObj = JSON.parse(reqbody);
  var jsonStr = JSON.stringify(jsonObj);
  salesLogger.info(`${jsonStr}`);

/**
 * Create Notification item if it does not exist
 */

  // await client
  //   .database(databaseId)
  //   .container(containerId)
  //   .items.upsert(jsonStr)
  // console.log(`Created family item with id:\n${Date.now()}\n`)
//console.log(`${jsonStr}`);
    //delete jsonObj["transactionTime"];

    createNotificationItem(jsonObj)
    .then(() => {
      var response = sendNotification(jsonStr, jsonObj);
      //console.log(response.status);
      res.status(200).json("OK");
    
      

    })
    .catch(error => {
      console.log(error);
      exit(`Completed with error ${JSON.stringify()}`)
      res.status(500).json(error);
    })
    
        // let saleType;
        // //if (jsonObj.lineItems[0].lineItemType='ORIGINAL') {
        // logger.info(`${jsonObj.transactionType}`);
        // if (jsonObj.transactionType=='SALE') {
        //     if (jsonObj.lineItems[0].lineItemType=='ORIGINAL') {
        //       saleType="Initial Sale for " + jsonObj.vendor;    
        //     } else {
        //       saleType="Upsell"; 
        //     }
        // } else if (jsonObj.transactionType=='RFND') {
        //     saleType="Refund"; 
        // } else {
        //     saleType = "Unknown"; 
        // };


        // const requestBody = {
        //   'username': 'CB Notification for ' + jsonObj.affiliate, // This will appear as user name who posts the message
        //   'text': saleType, // text
        //   'icon_emoji': ':bangbang:', // User icon, you can also use custom icons here
        //   'attachments': [{ // this defines the attachment block, allows for better layout usage
        //     'color': '#eed140', // color of the attachments sidebar.
        //     'fields': [ // actual fields
        //       {
        //           'title': 'Account',
        //           'value': jsonObj.affiliate,
        //           'short': false 
        //       },
        //       {
        //         'title': 'Product', // Custom field
        //         'value': jsonObj.lineItems[0].productTitle, // Custom value
        //         'short': false // long fields will be full width
        //       },
        //       {
        //         'title': 'Commission Amount (USD$)',
        //         'value': jsonObj.totalAccountAmount,
        //         'short': true
        //       }
        //     ]
        //   }]
        // };

        // let response;

        // try {
        //   logger.info(CBHOOK, requestBody);
        //   response = await axios.post(CBHOOK, requestBody);
        //   res.status(response.status).json(response.data);
        // } catch (error) {
        //   res.status(500).json(error.message);
        // }

        


});


async function sendNotification(jsonStr, jsonObj){
  const CBHOOK = (process.env.REGION="PRODUCTION") ? process.env.SLACK_WEBHOOK : process.env.WEBHOOK_TEST;
  let saleType;
  //if (jsonObj.lineItems[0].lineItemType='ORIGINAL') {
  logger.info(`${jsonObj.transactionType}`);
  if (jsonObj.transactionType=='SALE') {
      if (jsonObj.lineItems[0].lineItemType=='ORIGINAL') {
        saleType="Initial Sale for " + jsonObj.vendor;    
      } else {
        saleType="Upsell"; 
      }
  } else if (jsonObj.transactionType=='RFND') {
      saleType="Refund"; 
  } else {
      saleType = "Unknown"; 
  };


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
          'title': 'Receipt',
          'value': jsonObj.receipt,
          'short': true
        },        {
          'title': 'Product', // Custom field
          'value': jsonObj.lineItems[0].productTitle, // Custom value
          'short': false // long fields will be full width
        },
        {
          'title': 'Commission Amount (USD$)',
          'value': jsonObj.totalAccountAmount,
          'short': true
        },
        {
          'title': 'Country',
          'value': jsonObj.customer.billing.address.country,
          'short': true
        },        
        {
          'title': 'State',
          'value': jsonObj.customer.billing.address.state,
          'short': true
        },          {
          'title': 'Attempt',
          'value': jsonObj.attemptCount,
          'short': true
        }
      ]
    }]
  };

  let response;

  try {
    logger.info(CBHOOK, requestBody);
    response = await axios.post(CBHOOK, requestBody);
    //console.log(response);
    return response;
    //res.status(response.status).json(response.data);
  } catch (error) {
    //res.status(500).json(error.message);
    console.log(error.message);
    return error.message;
  }



}


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
