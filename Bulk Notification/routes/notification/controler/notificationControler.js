let Promise = require('bluebird');
let _ = require('underscore');
let lodash = require('lodash');
let notificationrServices = require('../services/notificationService');


exports.sendBulkNotification                  =            sendBulkNotification;


function sendBulkNotification(req, res) {
    Promise.coroutine(function* () {
        var activeUserCount = yield notificationrServices.getDeviceTokenCount();
        if (!activeUserCount) {
            return {
                message : "No active users available",
                status  : 100
            };
        }

        for(var i=0; i<activeUserCount; i+=100) {
            let ofset = i+1, limit = i+100;
            if(ofset>activeUserCount-1) {
                ofset = activeUserCount-1;
            }
            var activeUser = yield notificationrServices.getDeviceToken({ofset: ofset, limit: limit}) 
            var message = { 
                registration_ids: activeUser, 
                
                notification: {
                    title: 'Title of your push notification', 
                    body: 'Body of your push notification' 
                },
                
                data: { 
                    my_key: 'my value',
                    my_another_key: 'my another value'
                }
            }  
            yield notificationrServices.sendNotification(message);
        }
    

        return {
            message : "Login Success",
            data    : userDetails[0],
            status  : 200
        }; 

    })().then((result) => {
        console.log("LOGIN RESPONCE =>>>>",JSON.stringify(result));
        return res.send({message: result.message, data: result.data||{}, status : result.status});
    }, (error) => {
        console.log("LOGIN ERR =>>>>",JSON.stringify(error));
        return res.send({message: lodash.isEmpty(error.message) ? "" : error.message, status : 0});
    });
}
