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

const insertSingerInfo = async (name, version) => {
    const pool = new Pool(localdbinfo);
    await pool.query(`INSERT INTO signerinfo(discord_name,tos_version) VALUES ('${name}',${version})`, (err, res) => {
        console.log(err, res);
        pool.end();
    });
}


const get = async () => {
    try {
        const queryResult = await pool.query('SELECT * FROM signerinfo', (err, res) => {
            console.log(err, res?.rows);
            const returnobj = new Promise((resolve, reject) => {
                resolve(res?.rows)
            });
        });
    } catch (err) {
        console.log(err);
    }
    return;
}

const query = new Promise((resolve, reject) => {

})
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

module.exports = {insertSingerInfo, getAll}