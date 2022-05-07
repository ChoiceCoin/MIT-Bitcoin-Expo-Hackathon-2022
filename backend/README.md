# MIT Hackathon Backend.

This is the backend folder responsible for creating an election ID, generating an election data and getting the voting result in realtime.

## Requirements

* NPM and Node installed, download [HERE](https://phoenixnap.com/kb/install-node-js-npm-on-windows)
* [MongoDB Atlas](https://www.mongodb.com/atlas/database) cloud database  or [MongoDB](https://www.mongodb.com/) for local environment must be installed.

## Run Backend On Local Machine

* Git clone the repository

```
  $ git clone https://github.com/ChoiceCoin/MIT-Bitcoin-Expo-Hackathon-2022.git
```
* Go into `backend` directory

```
 $ cd backend
```
* Install app dependencies
```
 $ npm install
```

* Start backend server

```
$ npm run dev

```

## ENV
- Create a file `.env`
- Update with your mongodb atlas login details
```
MONGODB_URI="mongodb+srv://<username>:<password>@cluster0.ntpbs.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
```
- Update purestake API details or algosigner
 ```
 ALGOD_PORT = "",
 ALGOD_SERVER = "",
 ALGOD_TOKEN = "",
 INDEXER_SERVER = ""
 ```

 NB: check a tutorial on how to run a decentralized voting with choice-coin on [algorand-developer-blog](https://developer.algorand.org/tutorials/build-a-decentralized-voting-app-with-choice-coin-and-javascript-sdk/) written by me for more understanding how to use purestake API.

- update `AUTHORIZATION_ID` to be able to create election

```
AUTHORIZATION_ID = ""
```

## APIs
 
### Create Election

```
POST /elections/create
```
All parameters are to be in req.body.
| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `address` | `string` | **Required**. vote option 1 escrow address|
| `address` | `string` | **Required**. vote option 2 escrow address|


- This will generate `election ID` as response that can should be updated in the `constant.js` file in the [frontend](https://github.com/ChoiceCoin/MIT-Bitcoin-Expo-Hackathon-2022/blob/main/frontend/src/utils/constants.js),
- Also make sure you are setting the headers as your `AUTHORIZATION-ID` in the `.env`

response.body
```bash
      status: "success",
      message: "Election created successfully!",
      data: { electionId: new_election._id },
```



### Get All Results In Realtime Using Election Id
```
/results/:id
```

All parameters are to be in URL
| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `:id` | `string` | **Required**. election ID|

response.body
```bash
   {
      status: "success",
      message: "Result for election returned successfully!",
      data: results, [] an array of election results -showing total committed assets
   }
```

### Get Each Amount Committed to Governance
```
GET /committed/:address
```

All parameters are to be in URL
| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `:address` | `string` | **Required**. Voter address|

response.body
```bash
   {
      status: "success",
      message: "BTC committed returned successfully",
      data: { amount: txnAmt // committed BTC amount in governance },
    
   }
```

### Get All Ongoing Election
```
GET /elections
```
- This will generate all ongoing elections 

response.body
```bash
{
    status: "success",
    message: "All elections returned successfully",
    data: elections, [] an array of all elections
}
```

## LICENSE

* [MIT](https://github.com/ChoiceCoin/MIT-Bitcoin-Expo-Hackathon-2022/blob/main/LICENSE)
