
var mysql                                   = require('mysql');
var moment                                  = require('moment');


exports.mysqlQueryPromise                   = mysqlQueryPromise;
exports.initializeConnectionPool            = initializeConnectionPool;


function initializeConnectionPool(dbConfig) {
  return new Promise((resolve, reject) =>{
    console.log('CALLING INITIALIZE POOL');
    var numConnectionsInPool = 0;
    var conn = mysql.createPool(dbConfig);
    conn.on('connection', function (connection) {
      numConnectionsInPool++;
      console.log('NUMBER OF CONNECTION IN POOL : ', numConnectionsInPool);
    });
    return resolve(conn);
  });
}


function mysqlQueryPromise(queryString, params) {
  return new Promise((resolve, reject) => {
    var query = connection.query(queryString, params, function (sqlError, sqlResult) {
      console.log({
        SQL_RESULT: sqlResult, SQL_RESULT_LENGTH: sqlResult && sqlResult.length
      });
      if (sqlError || !sqlResult) {
        if (sqlError) {
          if (sqlError.code === 'ER_LOCK_DEADLOCK' || sqlError.code === 'ER_QUERY_INTERRUPTED') {
            setTimeout(module.exports.mysqlQueryPromise.bind(queryString, params), 50);
          } else {
            return reject({ERROR: sqlError, QUERY: query.sql});
          }
        }
      }
      return resolve(sqlResult);
    });
  });
}