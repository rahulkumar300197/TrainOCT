var Promise                                     = require('bluebird');
var _                                           = require('underscore');
var redis                                       = require('redis');
var envProperties                               = require('./../properties/envProperties');
var mysqlLib                                    = require('./../database/mysqlLib');
var sockets                                     = require('../sockets/socket');

exports.initializeServer                        = initializeServer;
exports.initializeSocket                        = initializeSocket;

function initializeServer() {
  return new Promise((resolve, reject) => {
    Promise.coroutine(function* () {
      connection          = yield mysqlLib.initializeConnectionPool(envProperties.databaseSettings.mysql);
      redis_client        = redis.createClient(envProperties.databaseSettings.redis.port, envProperties.databaseSettings.redis.host);

    })().then((data) => {
      resolve(data);
    }, (error) => {
      console.log("initializeServer==========",error);
      reject(error);
    });
  });
}

function initializeSocket(server) {
  sockets.socketInitialize(server);
}