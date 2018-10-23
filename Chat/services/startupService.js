/**
 * Created by ashishprasher on 23/04/18.
 */
var apiReferenceModule                          = "startup";

var Promise                                     = require('bluebird');
var _                                           = require('underscore');
var envProperties                               = require('./../properties/envProperties');
var mysqlLib                                    = require('./../database/mysqlLib');


exports.initializeServer                        = initializeServer;

function initializeServer() {
  return new Promise((resolve, reject) => {
    Promise.coroutine(function* () {
      connection          = yield mysqlLib.initializeConnectionPool(envProperties.databaseSettings.mysql);
    })().then((data) => {
      resolve(data);
    }, (error) => {
      console.log("initializeServer==========",error);
      reject(error);
    });
  });
}

function refreshVersions(apiReference) {
  setDriverAppVersionInRedis(apiReference);
  setVendorAppVersionInRedis(apiReference);
}


function setDriverAppVersionInRedis(apiReference, opts) {
  return new Promise((resolve, reject) => {
    Promise.coroutine(function* () {

      var driverAppVersions = yield versionService.getDriverAppVersions(apiReference, opts);
      if(_.isEmpty(driverAppVersions)){
        return;
      }

      var tookanAndroidPath = {
            path      : driverAppVersions[0].path,
            opentok_path : driverAppVersions[0].opentok_path,
            brand_name: driverAppVersions[0].brand_name,
            gateway   : driverAppVersions[0].gateway
          }
          , tookanIosPath = {
            path      : driverAppVersions[1].path,
            opentok_path : driverAppVersions[1].opentok_path,
            brand_name: driverAppVersions[1].brand_name,
            gateway   : driverAppVersions[1].gateway
          },
          tookanAndroidPath1 = {
            path      : driverAppVersions[2].path,
            opentok_path : driverAppVersions[2].opentok_path,
            brand_name: driverAppVersions[2].brand_name,
            gateway   : driverAppVersions[2].gateway
          }, tookanIosPath1 = {
            path      : driverAppVersions[3].path,
            opentok_path : driverAppVersions[3].opentok_path,
            brand_name: driverAppVersions[3].brand_name,
            gateway   : driverAppVersions[3].gateway
          };

      redis_client.set(constants.deviceTypePrefix.DRIVER + 0, JSON.stringify(tookanAndroidPath));
      redis_client.set(constants.deviceTypePrefix.DRIVER + 1, JSON.stringify(tookanIosPath));
      redis_client.set(constants.deviceTypePrefix.DRIVER + 2, JSON.stringify(tookanAndroidPath1));
      redis_client.set(constants.deviceTypePrefix.DRIVER + 3, JSON.stringify(tookanIosPath1));

      for(var i = 0 ; i < driverAppVersions.length; i++){
        if (driverAppVersions[i].user_id) {
          redis_client.set(constants.deviceTypePrefix.DRIVER + driverAppVersions[i].device_type, JSON.stringify({
            path      : driverAppVersions[i].path,
            opentok_path : driverAppVersions[i].opentok_path,
            brand_name: driverAppVersions[i].brand_name,
            gateway   : driverAppVersions[i].gateway
          }));
        }
      }
    })().then((data) => {
      resolve(data);
    }, (error) => {
      logging.logError(apiReference, error);
      reject(error);
    });
  });
}

function setVendorAppVersionInRedis(apiReference, opts) {
  return new Promise((resolve, reject) => {
    Promise.coroutine(function* () {

      var vendorAppVersions = yield versionService.getVendorAppVersions(apiReference, opts);
      if(_.isEmpty(vendorAppVersions)){
        return;
      }

      for(var i = 0 ; i < vendorAppVersions.length; i++){
        if (vendorAppVersions[i].user_id) {
          redis_client.set(constants.deviceTypePrefix.CUSTOMER + vendorAppVersions[i].app_device_type, JSON.stringify({
            path      : vendorAppVersions[i].path,
            opentok_path : vendorAppVersions[i].opentok_path,
            brand_name: vendorAppVersions[i].brand_name,
            gateway   : vendorAppVersions[i].gateway
          }));
        }
      }
    })().then((data) => {
      resolve(data);
    }, (error) => {
      logging.logError(apiReference, error);
      reject(error);
    });
  });
}

function multilingualMiddleWare() {
  return function (req, res, next) {
    // Pass to next layer of middleware
    var temp = res.send;
    res.send = function () {
      if (res.get('Content-Encoding') == 'gzip') {
        return temp.apply(res, arguments);
      }
      var response = arguments[0];
      Promise.coroutine(function* () {
        var opts = {
          lang: req.headers && req.headers['accept-language'] || "en",
          response: response
        }
        return yield getTranslatedResponse(opts);
      })().then((result) => {
        return temp.apply(res, [result]);
      }, (error) => {
        return temp.apply(res, arguments);
      });
    }
    next();
  }
};

function getTranslatedResponse(opts) {
  return new Promise((resolve, reject) => {
    Promise.coroutine(function* () {
      var lang = opts.lang;
      var response = opts.response;
      var value;
      if (response) {
        if (typeof response == "string") {
          try {
            response = JSON.parse(response)
          } catch (e) {
            return response;
          }
        }
        if (lang && response.message) {
          value = yield getMessage({key: response.message, lang:lang})
          if (value && response.values) {
            for (var prop in response.values) {
              var regex = `<%${prop}%>`
              value = value.replace(regex, response.values[prop]);
            }
            delete response.values;
          }
          response.message = value ? value : response.message;
          response = JSON.stringify(response)
          return response;
        } else {
          response = JSON.stringify(response);
          return response;
        }
      } else {
        return response;
      }
    })().then((data) => {
      resolve(data);
    }, (error) => {
      resolve(opts.response);
    });
  });
};

function getMessage(opts) {
  return new Promise((resolve, reject) => {
    Promise.coroutine(function* () {
      opts.lang = opts.lang || 'en';
      var value = yield getResponseKey(opts.lang);
      if (!value) {
        value = yield getResponseKey('en');
      }
      return value;
    })().then((data) => {
      resolve(data);
    }, (error) => {
      resolve(opts.key);
    });
  });

  function getResponseKey(lang) {
    return new Promise((resolve, reject) => {
      try {
        var filePath = `./../translations/${lang}.json`;
        var data = require(filePath);
        resolve(data[opts.key]);
      } catch (e) {
        resolve(0);
      }
    })
  };
};