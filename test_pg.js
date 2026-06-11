const { Client } = require('pg');

const client = new Client({
  connectionString: "postgresql://postgres.hiulbwlwzooxzhckztwz:PrimeBilty056@aws-0-ap-south-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1"
});

client.connect()
  .then(() => {
    console.log("Connected successfully!");
    return client.query('SELECT NOW()');
  })
  .then(res => {
    console.log(res.rows);
    client.end();
  })
  .catch(err => {
    console.error("Connection error", err.stack);
    client.end();
  });
