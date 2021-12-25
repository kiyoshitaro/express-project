// const express = require('express');
import express from "express";
import routes from "./routes/index";
import * as Wallet from "./services/ksm-service";

import { KUSAMA_NETWORK, WESTEND_NETWORK } from "./constants/network"
// API.connectToApi(WESTEND_NETWORK);
const app = express();
const path = require('path');
// setup static
app.use(express.static(path.join(__dirname, '../public')));
// app.use(express.static(path.join(__dirname, '../public/assets')));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
(async () => {
    await Wallet.connectToApi(KUSAMA_NETWORK);
    app.use('/', routes);
    app.listen(9000, () => {
        console.log('Listening on port 9000...')
    });
})();
