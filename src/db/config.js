var config = {}

config.endpoint = 'https://cbnotify.documents.azure.com:443/'
config.key = 'nWMgIX0Sqcy5t5OXek6ddc008m14I4JkhmNnA1HaZoeyUbfQgZ5TX4f2joPoCjm7vUxxzPbps4fyww6JRxyxHg=='

config.database = {
  id: 'CBNotifications'
}

config.container = {
  id: 'Notifications'
}

config.items = {
  Notification: {
    "transactionTime": "20200325T103744-0700",
    "receipt": "RCQI3NSV",
    "transactionType": "SALE",
    "vendor": "instmanfst",
    "affiliate": "majamlink",
    "role": "AFFILIATE",
    "totalAccountAmount": 40.36,
    "paymentMethod": "VISA",
    "totalOrderAmount": 47,
    "lineItems": [
      {
        "itemNo": "fb1125",
        "productTitle": "40% OFF! Instant Manifestation Secrets -w- Added Bonuses",
        "shippable": false,
        "recurring": false,
        "accountAmount": 40.36,
        "quantity": 1,
        "lineItemType": "ORIGINAL",
        "productPrice": 47,
        "productDiscount": 0,
        "taxAmount": 0,
        "shippingAmount": 0,
        "shippingLiable": false
      }
    ],
    "customer": {
      "billing": {
        "address": {
          "state": "FL",
          "postalCode": "32505",
          "country": "US"
        }
      }
    },
    "upsell": {},
    "version": 7,
    "attemptCount": 2
  }
  
}

module.exports = config
