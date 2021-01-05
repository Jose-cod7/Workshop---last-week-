const express = require("express")
const app = express()
const port = 3000
const {
    Pool
} = require("pg")

//const secrets = require('./secrets.json')

const bodyParser = require("body-parser");
const { request, response } = require("express")

app.use(bodyParser.json());

const pool = new Pool({
    user: "pepe",
    host: "localhost",
    database: "migracode-classes",
    password: "pepe1234",
    port: 5432,
})