var redis                                 =       require('redis');
var properties                            =       require('../../properties/envProperties');

exports.get_redis_client_users            =       get_redis_client_users;
exports.insert_into_redis_users           =       insert_into_redis_users;
exports.getSocketID                       =       getSocketID;
exports.delete_client_user                =       delete_client_user;

var allUserSockets                        =       'userSockets';


function get_redis_client_users (input, callback) {
    getRedis(function (resp) {
        getKeys(allUserSockets + input, function (err, redisKeys) {
            if (redisKeys && redisKeys.length) {
                callback(redisKeys)
            } else callback ([])
        })
    });
};

function insert_into_redis_users (key, value) {
    getRedis(function (resp) {
        redis_client.set(allUserSockets + key, JSON.stringify(value));
        redis_client.expire(allUserSockets + key, 7200);
    });
};

function delete_client_user(key) {
    getRedis(function (resp) {
        getKeys(allUserSockets + key + '*', function (err, redisKeys) {
            var length = redisKeys.length;
            for(var i = 0; i < length; i++) {
                redis_client.del(redisKeys[i]);
            }
        })
    });
};

function getRedis(callback) {
    if (redis_client === undefined) {
        redis_client = redis.createClient(properties.databaseSettings.redis.port, properties.databaseSettings.redis.host);
        redis_client.on('connect', function () {
            callback('Redis Connected Again.');
        });
    } else callback('Redis Already Connected');
    
};

function getSocketID(data) {
    return data.split('USER')[1]
}