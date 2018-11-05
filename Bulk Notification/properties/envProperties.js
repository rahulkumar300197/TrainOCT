exports.databaseSettings = {
  mysql: {
    host              : "localhost",
    user              : "root",
    password          : "qwerty@123",
    database          : "chat",
    multipleStatements: true
  },
  redis: {
    host              : "127.0.0.1",
    port              : "6379"
  }
};

exports.notificationSettings = {
  fcm_key : ""
};