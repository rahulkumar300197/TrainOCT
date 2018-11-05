var express = require('express');
var notificationControler = require('./controler/notificationControler');
var router = express.Router();

/* GET notifications listing. */
router.get('/send_bulk_notification',notificationControler.sendBulkNotification);

module.exports = router;
