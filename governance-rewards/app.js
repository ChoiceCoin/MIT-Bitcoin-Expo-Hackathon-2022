//including the Javascript Algorand SDK
const algosdk = require('algosdk'); 

//including the dotenv config
require("dotenv").config();

const { algodClient, indexerClient, ASSET_ID, REWARD_ID, REWARD_POOL } = require("./config"); 

// Stores the Voters Wallet Addresses and the Amounts
let voters=[];

//merges voters who voted Multiple times
let mergedvoters=[];

//transactions
let transactions=[];


// initial committedAmount
let totalCommittedAmount=0;

let rewardAmount //amount sent + rewards


let govRewardsPool=REWARD_POOL;// Choice rewards pool;

// The two Decisions addresses
let addresses=[
    {
        addr:process.env.OPTION_ZERO
    },
    {
        addr:process.env.OPTION_ONE
    }
   ];

// rewards wallet mmemonic
let rewardMmemonic=process.env.REWARD_MMEMONIC
//Wallet Reward MMemonic to Secret KeyPairs
let secretKey=algosdk.mnemonicToSecretKey(rewardMmemonic); //Put reward wallet Mnemonic Phrase here;

// find address that voted more than once and Merge them Together
const find = (address) => {
    var foundat;
    for(var i=0; i<mergedvoters.length; i++){
      if(mergedvoters[i].sender==address){
        foundat=i;
        break;
      }
    }
    return foundat;
}

// truncate ratio to two decimal places;
const truncateDecimals = (number, digits) =>  {
    var multiplier = Math.pow(10, digits),
        adjustedNum = number * multiplier,
        truncatedNum = Math[adjustedNum < 0 ? 'ceil' : 'floor'](adjustedNum);

    return truncatedNum / multiplier;
};

//Get Voters(addresses + committed amount to governance) + Total committed amounts
const getVoters = async() => {
     
   // get transaction histories between the two addresses 
    for(address of addresses){
        let txnHistory = await indexerClient
        .searchForTransactions()
        .address(address.addr)
        .assetID(ASSET_ID)
        .addressRole("receiver")
        .txType("axfer")
        .do();
       
     
   // if voters' amount committed >= 1 push the voters to the voters array!
     await txnHistory.transactions.map(receiver=>{
          if((receiver['asset-transfer-transaction'].amount)/100000000 >=0.000000001){   
            voters.push({
                    sender:receiver.sender,
                    amount:(receiver['asset-transfer-transaction'].amount)/100000000
                })
            
           // get the total committed amounts
            totalCommittedAmount+=(receiver['asset-transfer-transaction'].amount)/1000000;
          } 
        })
    }
     await getMergedVoters()     
}



// draft transactions

const draftTransaction = async (voters) => {
    var totalchoice=0;
    var totalasset=0;

    const params = await algodClient.getTransactionParams().do(); //get transaction params
    voters.forEach((voter)=>{ 
            var percentagegovreward=(voter.amount/totalCommittedAmount)*100;
            var govreward=(percentagegovreward/100)*govRewardsPool;
            console.log("gvr"+govreward)
      
           
             var votedamount=voter.amount;
             var govreward=truncateDecimals(govreward, 2);

             var govrewardfinal=Math.floor(govreward * 100)

             votedamount=votedamount * 100000000
             votedamount=Math.floor(votedamount);

            //  console.log("goBTC "+votedamount/100000000)
            //  console.log("choice "+govrewardfinal/100);


             totalasset+=votedamount;
             totalchoice+=govrewardfinal;
             

            
           transactions.push(algosdk.makeAssetTransferTxnWithSuggestedParams(secretKey.addr, voter.sender, undefined, undefined,  govrewardfinal , undefined, REWARD_ID, params));
           transactions.push(algosdk.makeAssetTransferTxnWithSuggestedParams(secretKey.addr, voter.sender, undefined, undefined,  votedamount, undefined, ASSET_ID, params));
    })
    //console.log(transactions)
    console.log("total rewards "+totalchoice/100);
    console.log("total asset "+totalasset/100000000);
}


//Sign Transactions, send signed transactions to the Algorand Network
const sendrewards = async () => {
        //let txgroup = algosdk.assignGroupID(transactions);
        transactions.forEach((transaction, index)=>{
        setTimeout(async () => {
             let signedTransaction=transaction.signTxn(secretKey.sk );
             let tx=await algodClient.sendRawTransaction(signedTransaction).do();
             console.log("Transaction : " + index + " " + tx.txId);
         }, 200 * (index + 1));     
     })  
     
     console.log("Done")
}



//get merged voters
const getMergedVoters = async () => {

      mergedvoters.push(voters[0]);

// if addresses that voted more than once exists, add their amounts together + push to the mergedvoters array
    for(var i=1; i<voters.length; i++){
        var exists=find(voters[i].sender);
        if(exists>=0){
          mergedvoters[exists].amount+= voters[i].amount;
        }
        else{
          mergedvoters.push(voters[i])
        }
    }
    
    console.log(mergedvoters)

    //draft transactions with mergedvoters array + the ratio as parameters
    await draftTransaction(mergedvoters)

    // send rewards 
  
  await sendrewards();

}

//getVoters Merge them and Send Out Rewards
getVoters()




