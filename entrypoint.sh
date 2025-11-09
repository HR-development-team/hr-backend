#!/bin/sh

echo "📌 Waiting for MySQL to be ready..."

until node -e "
const mysql = require('mysql2');
const conn = mysql.createConnection({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD
});
conn.connect(err => {
  if (err) process.exit(1);
  conn.end();
});
"; do
  echo '⏳ MySQL not ready — retrying in 2s...'
  sleep 2
done

echo "✅ MySQL ready!"

npm run db:prod

npm start
