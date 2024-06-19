require("dotenv").config();
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

        client.query('SELECT VERSION();', (err, result) => {
          if (err) {
            console.error('Ошибка при выполнении запроса:', err);
          } else {
            console.log('Версия PostgreSQL:', result.rows[0].version);
          }

          client
            .end()
            .then(() => {
              console.log('Подключение к базе данных PostgreSQL закрыто');
            })
            .catch((err) => {
              console.error('Ошибка при отключении: ', err);
            });
        });
      })
      .catch((err) => {
        console.error('Ошибка при подключение к базе данных PostgreSQL!', err);
      });
  } catch (err) {
    console.error('Ошибка:', err);
    rl.close();
  }
}

async function run() {
  const interval = process.env.INTERVAL ? process.env.INTERVAL : 50000;
  while (true) {
    await toConnect();
    await new Promise(resolve => setTimeout(resolve, interval)); // Ждем 10 секунд
  }
}

run();