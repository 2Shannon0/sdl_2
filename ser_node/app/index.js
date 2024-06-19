require("dotenv").config();
const fs = require('fs');

async function toConnect() {
  try {
    const { Client } = require('pg');
    const client = new Client({
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      database: process.env.DB_NAME
    });

    client
      .connect()
      .then(() => {
        console.log('Подключено к базе данных PostgreSQL ');
        fs.appendFileSync('./log/log.txt', `Подключено к базе данных PostgreSQL \n`);

        client.query('SELECT VERSION();', (err, result) => {
          if (err) {
            console.error('Ошибка при выполнении запроса:', err);
            fs.appendFileSync('./log/log.txt', `Ошибка при выполнении запроса: ${err}\n`);

          } else {
            console.log('Версия PostgreSQL:', result.rows[0].version);
            fs.appendFileSync('./log/log.txt', `Версия PostgreSQL: ${result.rows[0].version}\n`);
          }

          client
            .end()
            .then(() => {
              console.log('Подключение к базе данных PostgreSQL закрыто');
              fs.appendFileSync('./log/log.txt', `Подключение к базе данных PostgreSQL закрыто\n`);
            })
            .catch((err) => {
              console.error('Ошибка при отключении: ', err);
              fs.appendFileSync('./log/log.txt', `Ошибка при отключении: ' ${err}\n`);
            });
        });
      })
      .catch((err) => {
        console.error('Ошибка при подключение к базе данных PostgreSQL!', err);
        fs.appendFileSync('./log/log.txt', `Ошибка при подключение к базе данных PostgreSQL!' ${err}\n`);
      });
      
  } catch (err) {
    console.error('Ошибка:', err);
    fs.appendFileSync('./log/log.txt', `Ошибка: ' ${err}\n`);
  }
}

async function run() {
  const interval = process.env.INTERVAL ? process.env.INTERVAL : 50000;
  while (true) {
    await toConnect();
    await new Promise(resolve => setTimeout(resolve, interval)); 
  }
}

run();