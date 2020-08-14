const {Pool} = require('pg')

const pool = new Pool({
    user: 'tzzlagmfsiosdb',
    host: 'ec2-184-72-162-198.compute-1.amazonaws.com',
    database: 'd70si04136a9s8',
    password: '7c924187915ab0ee723245bfa49c5f48e0a95928e9c880f0336b2800b09e714c',
    port: 5432,
  });



module.exports = pool;
