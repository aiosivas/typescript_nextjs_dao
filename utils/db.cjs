// @ts-ignore

const { resolve } = require('path');
const { Client, Pool } = require('pg')

const localdbinfo = {
    user: 'postgres',
    host: 'localhost',
    database: 'daotossigners',
    password: 'adminpw',
    port: 5432,
}

const serverdbinfo = {
    user: 'postgres',
    host: 'localhost',
    database: 'daotossigners',
    password: 'admin',
    port: 5432,
}

const insertDiscInfo = async (name, address, version) => {
    const pool = new Pool(localdbinfo);
    await pool.query(`INSERT INTO signerinfo(discord_name,wallet_address,tos_version) VALUES ('${name}','${address}',${version})`, (err, res) => {
        console.log(err, res);
        pool.end();
    });
}

const insertAddress = async address => {
    const pool = new Pool(localdbinfo);
    await pool.query(`INSERT INTO signerinfo(address) VALUES ('${address}')`, (err, res) => {
        console.log(err, res);
        pool.end();
    });
}

//must use promise for async module export
const getAll = new Promise(async (resolve, reject) => {
    const pool = new Pool(localdbinfo);
    try {
        const queryResult = await pool.query('SELECT * FROM signerinfo', (err, res) => {
            console.log(err, res?.rows);
            resolve(res?.rows)
        });
    } catch (err) {
        reject(err);
    }
});

module.exports = {insertDiscInfo, getAll, insertAddress}