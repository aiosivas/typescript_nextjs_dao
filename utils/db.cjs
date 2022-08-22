const {Client, Pool} = require('pg')

const dbinfo = {
    user: 'postgres',
    host: 'localhost',
    database: 'daotossigners',
    password: process.env.POSTGRESQLPW,
    port: 5432,
}

const insertSingerInfo = async (name, version) => {
    const pool = new Pool(dbinfo);
    pool.query(`INSERT INTO signerinfo(discord_name,tos_version) VALUES ('${name}',${version})`, (err, res) => {
        //console.log(err, res);
        pool.end();
    });
}

const getAll = async () => {
    const pool = new Pool(dbinfo);
    pool.query('SELECT * FROM signerinfo', (err, res) => {
        console.log(err, res.rows);
        pool.end();
    });
}

module.exports = { insertSingerInfo, getAll };
