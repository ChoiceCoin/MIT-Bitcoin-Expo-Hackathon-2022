require("dotenv").config();
const algosdk = require("algosdk");

const algodServer = process.env.ALGOD_SERVER;
const indexerServer = process.env.INDEXER_SERVER;
const algodToken = { "X-API-Key": process.env.ALGOD_TOKEN };
const algodPort = process.env.ALGOD_PORT;
//Defines the Voting Asset "goBTC" id
const ASSET_ID = parseInt(process.env.ASSET_ID);
//Defines the Voting Asset "goBTC" id
const ASSET_DECIMAL = parseInt(process.env.ASSET_DECIMAL);
//Defines the Voting Asset "goBTC" id
const REWARD_ID = parseInt(process.env.REWARD_ID);
//Defines the Amount rewards in $choice that would be Allocated for the Governance Process
const REWARD_POOL = parseInt(process.env.REWARD_POOL);

//Instantiate the Indexer Client to Search on the Algorand Blockchain
const indexerClient = new algosdk.Indexer(algodToken, indexerServer, algodPort);

//Instantiate Algod Client Using the Javascript SDK
const algodClient = new algosdk.Algodv2(algodToken, algodServer, algodPort);

module.exports = { algodClient, indexerClient, ASSET_DECIMAL, ASSET_ID, REWARD_ID, REWARD_POOL };