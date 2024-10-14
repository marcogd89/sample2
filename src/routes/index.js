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


/**
 * Query for record 
 */
async function FindIPN(itemBody) {
  let result = false;
  // const { item } = await client
  // .database(databaseId)
  // .container(containerId)
  let database = client.database(databaseId);
  let container = database.container(containerId);

  // query to return all items
  const querySpec = {
    query: `SELECT * from c where c.receipt='${itemBody.receipt}'`
  };

  const { resources: items } = await container.items
    .query(querySpec)
    .fetchAll();

    items.forEach(item => {
      result=true;
      console.log(`Foundrecord:${item.receipt} - ${item.vendor}`);
    });
    return result;
}


/* GET index route */
router.post('/MaxBountyNotification', async (req, res) => {
  MBhandler(req,res);
});

/* GET index route */
router.post('/MaxWebNotification', async (req, res) => {
  MWhandler(req,res);
});

/* GET index route */
router.post('/DigiNotification', async (req, res) => {
  digiHandler(req,res);
});

/* GET index route */
router.get('/ABNotification', async (req, res) => {
  digiHandler(req,res);
});

/* GET index route */
router.get('/DigiNotification', async (req, res) => {
  digiHandler(req,res);
});

/* GET index route */
router.post('/SlackNotification', async (req, res) => {
  genericNotification(req,res);
});


/* GET index route */
router.get('/CBNotification', (req, res) => {
  res.status(200).json({title: 'CBNotification Service For Marco'});
});

/* GET index route */
router.post('/CBNotification', async (req, res) => {
  handler(req,res);
});


async function genericNotification(req, res){

  const CBHOOK = (process.env.REGION="PRODUCTION") ? process.env.SLACK_WEBHOOK : process.env.WEBHOOK_TEST;

  const requestBody = {'text': req.query.text};
  
  try {
    logger.info(CBHOOK, requestBody);
    let response = await axios.post(CBHOOK, requestBody);
    //console.log(response);
    res.status(200).json(response.data);
  } catch (error) {
    console.log(error.message);
    res.status(500).json(error.message);
  }

}


async function digiHandler(req,res) {
  const CBHOOK = (process.env.REGION="PRODUCTION") ? process.env.SLACK_WEBHOOK : process.env.WEBHOOK_TEST;
  //const reqbody = processIN(req.body);
  //logger.info(`${S1}`);
  
  let requestBody;
//  let success = 'false';
 // let cont=  await  FindIPN(jsonObj);

    console.log(`${req.query.S1}`);

    requestBody = prepDigiNotification(`${req.query.clickid}`,`${req.query.status}`,`${req.query.revenue}`,`${req.query.transtype}`,`${req.query.merchid}`,`${req.query.productid}`,`${req.query.sid1}`,`${req.query.ordertype}`);

    //if (success="true") {
      // console.log(success);
      // console.log(CBHOOK);
      console.log(requestBody);
      try {

        logger.info(CBHOOK, requestBody);
        let response = await axios.post(CBHOOK, requestBody);
        //console.log(response);
        res.status(200).json(response.data);
      } catch (error) {
        console.log(error.message);
        res.status(500).json(error.message);
      }
   // }

}


function prepDigiNotification(clickid, status, revenue, transtype, merchid, productid, sid1, ordertype){
  
  let saleType;
  //if (jsonObj.lineItems[0].lineItemType='ORIGINAL') {
  //logger.info(`${jsonObj.transactionType}`);


  saleType = ordertype + " for " + merchid + "(" + revenue + ")";    


  const requestBody = {
    'username': 'Digi Notification', // This will appear as user name who posts the message
    'text': saleType, // text
    'icon_emoji': ':bangbang:', // User icon, you can also use custom icons here
    'attachments': [{ // this defines the attachment block, allows for better layout usage
      'color': '#eed140', // color of the attachments sidebar.
      'fields': [ // actual fields
        {
            'title': 'Account',
            'value': '',
            'short': false 
        },
        {
          'title': 'Receipt',
          'value': '',
          'short': true
        },        {
          'title': 'Product', // Custom field
          'value': productid, // Custom value
          'short': false // long fields will be full width
        },
        {
          'title': 'Commission Amount (USD$)',
          'value': revenue,
          'short': true
        }
      ]
    }]
  };

  return requestBody;
  // let response;

  // try {
  //   logger.info(CBHOOK, requestBody);
  //   response = await axios.post(CBHOOK, requestBody);
  //   //console.log(response);
  //   return response;
  //   //res.status(response.status).json(response.data);
  // } catch (error) {
  //   //res.status(500).json(error.message);
  //   console.log(error.message);
  //   return error.message;
  // }



}


async function MWhandler(req,res) {
  const CBHOOK = (process.env.REGION="PRODUCTION") ? process.env.SLACK_WEBHOOK : process.env.WEBHOOK_TEST;
  //const reqbody = processIN(req.body);
  //logger.info(`${S1}`);
  
  let requestBody;
//  let success = 'false';
 // let cont=  await  FindIPN(jsonObj);

    console.log(`${req.query.S1}`);

    requestBody = prepMBNotification(`${req.query.S1}`,`${req.query.S2}`,`${req.query.S3}`,`${req.query.S4}`,`${req.query.S5}`,`${req.query.offid}`,`${req.query.ip}`,`${req.query.Rate}`);

    //if (success="true") {
      // console.log(success);
      // console.log(CBHOOK);
      console.log(requestBody);
      try {

        logger.info(CBHOOK, requestBody);
        let response = await axios.post(CBHOOK, requestBody);
        //console.log(response);
        //res.status(response.status).json(response.data);
      } catch (error) {
        console.log(error.message);
        //res.status(500).json(error.message);
      }
   // }

}



async function MBhandler(req,res) {
  const CBHOOK = (process.env.REGION="PRODUCTION") ? process.env.SLACK_WEBHOOK : process.env.WEBHOOK_TEST;
  //const reqbody = processIN(req.body);
  //logger.info(`${S1}`);
  
  let requestBody;
//  let success = 'false';
 // let cont=  await  FindIPN(jsonObj);

    console.log(`${req.query.S1}`);

    requestBody = prepMBNotification(`${req.query.S1}`,`${req.query.S2}`,`${req.query.S3}`,`${req.query.S4}`,`${req.query.S5}`,`${req.query.offid}`,`${req.query.ip}`,`${req.query.Rate}`);

    //if (success="true") {
      // console.log(success);
      // console.log(CBHOOK);
      console.log(requestBody);
      try {

        logger.info(CBHOOK, requestBody);
        let response = await axios.post(CBHOOK, requestBody);
        //console.log(response);
        //res.status(response.status).json(response.data);
      } catch (error) {
        console.log(error.message);
        //res.status(500).json(error.message);
      }
   // }

}


async function handler(req,res) {
  const CBHOOK = (process.env.REGION="PRODUCTION") ? process.env.SLACK_WEBHOOK : process.env.WEBHOOK_TEST;
  const reqbody = processIN(req.body);
  logger.info(`${reqbody}`);
  
  var jsonObj = JSON.parse(reqbody);
  var jsonStr = JSON.stringify(jsonObj);
  salesLogger.info(`${jsonStr}`);

  let requestBody;
  let success = 'false';
  let cont=  await  FindIPN(jsonObj);

    console.log(cont);

  if (!cont){
    console.log("not found")
    if (createNotificationItem(jsonObj)) {
      success='true';
      requestBody = prepNotification(jsonObj);
    } else {
      res.status(500).json("error");
    }

    if (success="true") {
      // console.log(success);
      // console.log(CBHOOK);
      // console.log(requestBody);
      try {

        logger.info(CBHOOK, requestBody);
        let response = await axios.post(CBHOOK, requestBody);
        //console.log(response);
        res.status(response.status).json(response.data);
      } catch (error) {
        console.log(error.message);
        res.status(500).json(error.message);
      }
    }
  } else {
    res.status(200).json("ok");
  }
    


}

function prepMBNotification(S1, S2, S3, S4, S5, OFFID, IP, RATE){
  
  let saleType;
  //if (jsonObj.lineItems[0].lineItemType='ORIGINAL') {
  //logger.info(`${jsonObj.transactionType}`);
  saleType="New Sale for " + OFFID;    


  const requestBody = {
    'username': 'MB Notification', // This will appear as user name who posts the message
    'text': saleType, // text
    'icon_emoji': ':bangbang:', // User icon, you can also use custom icons here
    'attachments': [{ // this defines the attachment block, allows for better layout usage
      'color': '#eed140', // color of the attachments sidebar.
      'fields': [ // actual fields
        {
            'title': 'Account',
            'value': '',
            'short': false 
        },
        {
          'title': 'Receipt',
          'value': '',
          'short': true
        },        {
          'title': 'Product', // Custom field
          'value': OFFID, // Custom value
          'short': false // long fields will be full width
        },
        {
          'title': 'Commission Amount (USD$)',
          'value': RATE,
          'short': true
        }
      ]
    }]
  };

  return requestBody;
  // let response;

  // try {
  //   logger.info(CBHOOK, requestBody);
  //   response = await axios.post(CBHOOK, requestBody);
  //   //console.log(response);
  //   return response;
  //   //res.status(response.status).json(response.data);
  // } catch (error) {
  //   //res.status(500).json(error.message);
  //   console.log(error.message);
  //   return error.message;
  // }



}


function prepNotification(jsonObj){
  
  let saleType;
  //if (jsonObj.lineItems[0].lineItemType='ORIGINAL') {
  logger.info(`${jsonObj.transactionType}`);
  if (jsonObj.transactionType=='SALE') {
      if (jsonObj.lineItems[0].lineItemType=='ORIGINAL' || jsonObj.lineItems[0].lineItemType=='STANDARD') {
        saleType="New Sale for " + jsonObj.vendor;    
      } else {
        saleType="Upsell"; 
      }
  } else if (jsonObj.transactionType=='RFND') {
      saleType="Refund"; 
  } else {
      saleType = "Unknown"; 
  };

  saleType = saleType + "(" + jsonObj.totalAccountAmount + ")";

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

  return requestBody;
  // let response;

  // try {
  //   logger.info(CBHOOK, requestBody);
  //   response = await axios.post(CBHOOK, requestBody);
  //   //console.log(response);
  //   return response;
  //   //res.status(response.status).json(response.data);
  // } catch (error) {
  //   //res.status(500).json(error.message);
  //   console.log(error.message);
  //   return error.message;
  // }



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
