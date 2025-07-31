export default () => ({
  database: {
    host: process.env.DB_HOST,
    port: +(process.env.DB_PORT || 5432),
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
  },
  rabbitmq: {
    uri: process.env.RABBITMQ_URI,
  },
});
