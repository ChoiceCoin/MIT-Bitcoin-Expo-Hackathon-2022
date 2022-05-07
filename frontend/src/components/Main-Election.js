import $ from "jquery";
import axios from "axios";
import algosdk from "algosdk";
import { useState} from "react";
import "../styles/electionlist.css";
import { useQuery } from "react-query";
import img from '../assets/btc.png';
import BarLoader from "react-spinners/BarLoader";
import WalletConnect from "@walletconnect/client"; 
import MyAlgoConnect from "@randlabs/myalgo-connect";
import { useDispatch, useSelector } from "react-redux";
import { formatJsonRpcRequest } from "@json-rpc-tools/utils";
import QRCodeModal from "algorand-walletconnect-qrcode-modal";
import { ASSET_ID,CHOICE_ID, ELECTION_ID, URL, ADDRESS_1, ADDRESS_2 } from "./constants";


const MainElection = () => {
  const dispatch = useDispatch();

  const [address1, setAddress1] = useState(0);
  const [address2, setAddress2] = useState(0);

  const isThereAddress = localStorage.getItem("address");
  

   // eslint-disable-next-line
  const { isLoading, error, data } = useQuery("elections", () =>
    axios.get(`${URL}/results/${ELECTION_ID}`).then((response) => {
      if (response?.data?.data) {
        setAddress1(response?.data?.data[ADDRESS_1]);
        setAddress2(response?.data?.data[ADDRESS_2]);
      }
    })
  );

  const balance = useSelector((state) => state.status.balance);
  const addressNum = useSelector((state) => state.status.addressNum);
  const algod_token = ""
  const algod_address = "https://api.algoexplorer.io";
  const headers = "";

  const algodClient = new algosdk.Algodv2(algod_token, algod_address, headers);
  const walletType = localStorage.getItem("wallet-type");
 
 

  const election_data = [
    {
      candidates: [
        {
          address: "",
          image: "",
          name: "Option 1: ",
        },

        {
          address: "",
          image: "",
          name: "Option 2: ",
        },
      ],
      card_desc:
        " This Issue has two options.",
      // choice_per_vote: 1,
      process_image: "https://i.postimg.cc/pXn0NRzL/logo.gif",
      title: "Bitcoin Voting",
    },
  ];


  const getMaxVoteValue = () => {
    document.getElementById('max').value = balance[addressNum].balance;
  }

  const myAlgoSign = async (voteData) => {
    const myAlgoWallet = new MyAlgoConnect({ shouldSelectOneAccount: false });

    try {
  
      const address = !!isThereAddress && isThereAddress 

      const myAccountInfo = await algodClient
        .accountInformation(
          !!isThereAddress && isThereAddress 
        )
        .do();

        console.log(myAccountInfo.assets["asset-id"]);
        
      

      // check if the voter address has Choice
      const containsChoice = myAccountInfo.assets
        ? myAccountInfo.assets.some(
            (element) => element["asset-id"] === ASSET_ID
          )
        : false;
       
      // if the address has no ASAs
      if (myAccountInfo.assets.length === 0) {
        dispatch({
          type: "alert_modal",
          alertContent:
            "You need to opt-in to goBTC in your Algorand Wallet.",
        });
        return;
      }

      if (!containsChoice) {
        dispatch({
          type: "alert_modal",
          alertContent:
            "You need to opt-in to goBTC in your Algorand Wallet.",
        });
        return;
      }

      // get balance of the voter
      const balance = myAccountInfo.assets
        ? myAccountInfo.assets.find(
            (element) => element["asset-id"] === ASSET_ID
          ).amount / 1000000
        : 0;

      if (voteData.amount > balance) {
        dispatch({
          type: "alert_modal",
          alertContent:
            "You do not have sufficient balance to make this transaction.",
        });
        return;
      }

      dispatch({
        type: "confirm_wallet",
        alertContent : "Confirming Vote Transaction & Option"
      })

      const suggestedParams = await algodClient.getTransactionParams().do();
      const amountToSend = voteData.amount * 1000000;
  
      const txn1= algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
        from: address,
        to: voteData.address,
        amount: amountToSend,
        assetIndex: ASSET_ID,
        suggestedParams,
      });
     const txn2 = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
      from: address,
      to: address,
      amount: 0,
      assetIndex: CHOICE_ID,
      suggestedParams,
     })
     let txns = [txn1, txn2]
     algosdk.assignGroupID(txns);

    let Txns = [txn1.toByte(), txn2.toByte()]

    

    const signedTxn = await myAlgoWallet.signTransaction(Txns);
    const SignedTx = signedTxn.map((txn) => {
      return txn.blob;
    });

    

    await algodClient.sendRawTransaction(SignedTx).do();
    dispatch({
      type: "close_wallet"
    })
      // alert success
      dispatch({
        type: "alert_modal",
        alertContent: "Your vote has been recorded.",
      });
      setTimeout(() => window.location.reload(), 1500);
    } catch (error) {
      if (error.message === "Can not open popup window - blocked") {
        dispatch({
          type: "close_wallet"
        })
        dispatch({
          type: "alert_modal",
          alertContent:
            "Pop Up windows blocked by your browser. Enable pop ups to continue.",
        });
      } else {
        console.log(error)
        dispatch({
          type: "close_wallet"
        })
        dispatch({
          type: "alert_modal",
          alertContent: "An error occured the during transaction process",
        });
      }
    }
  };

  const algoSignerConnect = async (voteData) => {
    try {
   

        const address = !!isThereAddress && isThereAddress 

        const myAccountInfo = await algodClient
          .accountInformation(
            !!isThereAddress && isThereAddress
          )
          .do();

        

        // check if the voter address has Choice
        const containsChoice = myAccountInfo.assets
          ? myAccountInfo.assets.some(
              (element) => element["asset-id"] === ASSET_ID
            )
          : false;

        // if the address has no ASAs
        if (myAccountInfo.assets.length === 0) {
          dispatch({
            type: "alert_modal",
            alertContent:
              "You need to opt-in to goBTC in your Algorand Wallet.",
          });
          return;
        }

        if (!containsChoice) {
          dispatch({
            type: "alert_modal",
            alertContent:
              "You need to opt-in to goBTC in your Algorand Wallet.",
          });
          return;
        }
        // get balance of the voter
        const balance = myAccountInfo.assets
          ? myAccountInfo.assets.find(
              (element) => element["asset-id"] === ASSET_ID
            ).amount / 1000000
          : 0;

        if (voteData.amount > balance) {
          dispatch({
            type: "alert_modal",
            alertContent:
              "You do not have sufficient balance to make this transaction.",
          });
          return;
        }

        dispatch({
          type: "confirm_wallet",
          alertContent : "Confirming Vote Transaction & Option"
        })

        const suggestedParams = await algodClient.getTransactionParams().do();
        const amountToSend = voteData.amount * 1000000;
    

        const txn1 = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
          from: address,
          to: voteData.address,
          amount: amountToSend,
          assetIndex: ASSET_ID,
          suggestedParams,
        });
        const txn2 = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
          from: address,
          to: address,
          amount: 0,
          assetIndex: CHOICE_ID,
          suggestedParams,
        })
        let txns = [txn1, txn2]
        algosdk.assignGroupID(txns);

        let Txns = []
        // eslint-disable-next-line
        txns.map((transaction) => {
          Txns.push({
            txn: window.AlgoSigner.encoding.msgpackToBase64(transaction.toByte()),
          });
        })


        const signedTxn = await window.AlgoSigner.signTxn(Txns);

        const SignedTx = signedTxn.map((txn) => {
          return  window.AlgoSigner.encoding.base64ToMsgpack(txn.blob);
        });
     

        await algodClient
          .sendRawTransaction(SignedTx).do();

          dispatch({
            type: "close_wallet"
          })

        // alert success
        dispatch({
          type: "alert_modal",
          alertContent: "Your vote has been recorded.",
        });
        setTimeout(() => window.location.reload(), 1500);
      
    } catch (error) {
      if (error.message === "Can not open popup window - blocked") {
        dispatch({
          type: "close_wallet"
        })

        dispatch({
          type: "alert_modal",
          alertContent:
            "Pop Up windows blocked by your browser. Enable pop ups to continue.",
        });
      } else {
        dispatch({
          type: "close_wallet"
        })
        dispatch({
          type: "alert_modal",
          alertContent: "An error occured the during transaction process",
        });
      }
    }
  };

  const algoMobileConnect = async (voteData) => {
    const connector = new WalletConnect({
      bridge: "https://bridge.walletconnect.org",
      qrcodeModal: QRCodeModal,
    });

    try {
      const address = !!isThereAddress ? isThereAddress : "";

      const myAccountInfo = await algodClient.accountInformation(address).do();


      const containsChoice = myAccountInfo.assets
        ? myAccountInfo.assets.some(
            (element) => element["asset-id"] === ASSET_ID
          )
        : false;

      if (myAccountInfo.assets.length === 0) {
        alert("You need to opt-in to goBTC in your Algorand Wallet.");
        return;
      }

      if (!containsChoice) {
        alert("You need to opt-in to goBTC in your Algorand Wallet.");
        return;
      }

      const balance = myAccountInfo.assets
      ? myAccountInfo.assets.find(
          (element) => element["asset-id"] === ASSET_ID
        ).amount / 1000000
      : 0;

      if (voteData.amount > balance) {
        alert("You do not have sufficient balance to make this transaction.");
        return;
      }

      dispatch({
        type: "confirm_wallet",
        alertContent : "Go to Pera Wallet & Confirm your Vote"
      })

      const suggestedParams = await algodClient.getTransactionParams().do();
      const amountToSend = voteData.amount * 1000000;
     
      const txn1 = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
        from: address,
        to: voteData.address,
        amount: amountToSend,
        assetIndex: ASSET_ID,
        suggestedParams,
        
      });
      const txn2 = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
        from: address,
        to: address,
        amount: 0,
        assetIndex: CHOICE_ID,
        suggestedParams,
        
      });

      let txns = [txn1, txn2]
      algosdk.assignGroupID(txns);
      let Txns = []

      // eslint-disable-next-line
      txns.map((transaction) => {

        Txns.push({
          txn: Buffer.from(algosdk.encodeUnsignedTransaction(transaction)).toString(
            "base64"
          ),
          message: "Transaction using Mobile Wallet",
        })
      })


      const requestParams = [Txns];

      const request = formatJsonRpcRequest("algo_signTxn", requestParams);
      const result = await connector.sendCustomRequest(request);

      const decodedResult = result.map((element) => {
        return element ? new Uint8Array(Buffer.from(element, "base64")) : null;
      });

   
     await algodClient.sendRawTransaction(decodedResult).do();
     dispatch({
      type: "close_wallet"
    })


      // alert success
      dispatch({
        type: "alert_modal",
        alertContent: "Your vote has been recorded.",
      });
      setTimeout(() => window.location.reload(), 1500);
    } catch (error) {
      if (error.message === "Can not open popup window - blocked") {
        dispatch({
          type: "close_wallet"
        })

        dispatch({
          type: "alert_modal",
          alertContent:
            "Pop Up windows blocked by your browser. Enable pop ups to continue.",
        });
      } else {
        dispatch({
          type: "close_wallet"
        })

        dispatch({
          type: "alert_modal",
          alertContent: "An error occured during the transaction process",
        });
      }
    }
  };

  const placeVote = (address, amount, election) => {
    if(!isThereAddress) {
      dispatch({
        type: "alert_modal",
        alertContent: "Kindly connect wallet to vote!!",
      });
      return;
    }

    if (!address) {
      dispatch({
        type: "alert_modal",
        alertContent: "Select an option to vote!!",
      });
      return;
    } 
     
    
    if (walletType === "my-algo") {
      myAlgoSign({ address, amount, election });
    } else if (walletType === "algosigner") {
      algoSignerConnect({ address, amount, election });
    } else if (walletType === "walletconnect") {
      algoMobileConnect({ address, amount, election });
    }
   
  };

  if (isLoading)
    return (
      <div className="ptt_elt">
        <div className="ptt_elt_inn">
          <div className="ptt_hd">
            <p>Participate by Voting</p>
          </div>

          <ul className="card_list">
            <div
              style={{
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                flexDirection: "column",
                color: "var(--wht)",
                textAlign: "center",
                fontSize: "14px",
                fontWeight:  500,
                textTransform: "uppercase",
              }}
            >
              <p style={{ opacity: 0.8, margin: "30px 0px 20px" }}>Loading</p>
              <BarLoader
                color="#888"
                size={150}
                speedMultiplier="0.5"
              />
            </div>
          </ul>
        </div>
      </div>
    );
  if (error) return "An error has occurred: " + error.message;

  return (
    <div className="ptt_elt">
      <div className="ptt_elt_inn">
        <div className="ptt_hd">
          <p>Participate By Voting</p>
        </div>

        <ul className="card_list">
          {election_data?.map((slug, index) => {
            return (
              <div className="card_cont" key={index}>
                <div className="card_r1">
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    <div className="card_elt_img">
                      {slug.process_image ? (
                        <img src={slug.process_image} alt="" />
                      ) : (
                        <i
                          className="uil uil-asterisk"
                          style={{ paddingLeft: "2px", paddingBottom: "2px" }}
                        />
                      )}
                    </div>
                    <div className="card_elt_tit">{slug.title}</div>
                  </div>
                </div>

                <div className="card_elt_desc">{slug?.card_desc}</div>

                <div className="results">
                  <div className="resultsTit">Results</div>

                  <div className="results_cont">
                    <div className="optionButt">
                      <div className="optionButtDets">
                        <p>Option 1</p>
                        <p>{address1.toLocaleString()} <img src={img} style={{width : '13px', marginTop : '-1px'}} alt="choice logo"/></p>
                      </div>
                      <div className="optRange">
                        <div
                          className={`optRangeSlide ${(address1 > address2) ? "optRangeSlide1" :"optRangeSlide2"}`}
                          style={{
                            width: `calc(100% * ${
                              address1 / (address1 + address2)
                            })`,
                          }}
                        ></div>
                      </div>
                    </div>
                    <div className="optionButt">
                      <div className="optionButtDets">
                        <p>Option 2</p>
                        <p>{address2.toLocaleString()} <img src={img} style={{width : '13px', marginTop : '-1px'}} alt="choice logo"/></p>
                      </div>
                      <div className="optRange">
                        <div
                          className={`optRangeSlide ${(address2 > address1) ? "optRangeSlide1" :"optRangeSlide2"}`}
                          style={{
                            width: `calc(100% * ${
                              address2 / (address1 + address2)
                            })`,
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="card_cand">
                  <div className="card_cand_hd">
                    <div className="amountToCommit">
                      <p>Amount to commit:</p>
                      <input
                        id="max"
                        type="number"
                        min="1"
                        placeholder='1'
                        className="amtToCommitInp"
                      />
                      {
                        isThereAddress ? 
                      (<p className="max"
                         onClick={getMaxVoteValue}>
                          max
                        </p>
                            ) : null
                      }
                      
                    </div>
                  </div>

                  <div className="vote_collap">
                    <div className="card_cand_hd">Options</div>
                    <ul className="vote_now_list">
                      {slug?.candidates?.map((item, index) => {
                        return (
                          <li key={index}>
                            <input
                              type="radio"
                              name="options"
                              value={item.address}
                            />

                            <p>{item.name}</p>
                          </li>
                        );
                      })}
                    </ul>

                    <div className="rec_vote_cont">
                      <button
                        className="record_vote button"
                        onClick={(e) => {
                          var voteVal = $(e.target)
                            .closest(".card_cand")
                            .find(".vote_now_list");

                          var amountToSend = $(e.target)
                            .closest(".card_cand")
                            .find(".amtToCommitInp")
                            .val();

                          var amt = !!amountToSend
                            ? amountToSend
                            : slug.choice_per_vote;

                          placeVote(
                            $("input[name=options]:checked", voteVal).val(),
                            amt,
                            slug
                          );
                        }}
                      >
                        Submit Vote <i className="uil uil-mailbox"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default MainElection;
