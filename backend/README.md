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

## LICENSE

* [MIT](https://github.com/ChoiceCoin/MIT-Bitcoin-Expo-Hackathon-2022/blob/main/LICENSE)
