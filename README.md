# Bitcoin Choices
Bitcoin Choices is a project built as part of the 2022 MIT Bitcoin Expo Hackathon 2022.

# Summary
Bitcoin Choices is a scalable voting solution for Bitcoin built by a team of developers from the Choice Coin DAO for the 2022 MIT Bitcoin Expo Hackathon.

# Problem
Bitcoin transactions have a high range and often cost hundreds or thousands of dollars to facilitate because of the high cost of energy required to validate blocks.  There exists a need for a way to securely vote with Bitcoin in a cost-efficient and timely manner to facilitate governance for the Bitcoin network. Defined, the Bitcoin governance problem is how can Bitcoin be used for fast, scalable, and secure voting with instantaneous results? 

# Solution
The solution is Bitcoin Choices, a scalable, secure, and systemic methodology for voting with collateralized Bitcoin on the Algorand blockchain. We launched a new [web application](https://bitcoin-choices.com) to facilitate a DAO vote. You can read more about the Issue and options for the vote in our blog here: https://medium.com/@ChoiceCoin/choice-coin-bitcoin-choices-6218ee5993d7

# How we built it

We built Bitcoin Choices using the Algorand blockchain as a scaling solution. The software also leverages AlgoMint, which is a software for creating collateralized Bitcoin on Algorand. By collateralizing Bitcoin on Algorand, BTC transactions become faster and less expensive. 

We then developed a voting infrastructure using React and the Algorand JavaScript-SDK to create a voting interface that allows users to connect their wallets and vote. The votes are then aggregated on the blockchain and recorded in real time. After the voting period concludes, we wrote a smart contract that reads all the voting data from the blockchain and returns any Bitcoin used for voting, plus a proportional reward from a pool.

# Challenges we faced

One of the main challenges we ran into was the mathematics for voting and ensuring the software could adequately handle unit measurements in Satoshis, the smallest BTC unit. For reference, one Bitcoin is equal to 100,000,000.00 Satoshis and one Satoshi is equal to 0.00000001 BTC. But, calculating such small numbers to allow for one Satoshi to equal one vote and to coordinate those calculations with the Algorand blockchain was our key challenge in both front-end and back-end development. 

# Decentralized Web Application

<img width="1434" alt="Screen Shot 2022-05-07 at 12 38 34 PM" src="https://user-images.githubusercontent.com/43055154/167269706-99a52c36-1dd2-4b37-a7ed-7e4460a1b067.png">

# Vote Results
<img width="1207" alt="Screen Shot 2022-05-07 at 3 37 20 PM" src="https://user-images.githubusercontent.com/87402354/167274046-e5d3c4ad-15ef-4a8a-bb20-1dc24414dd8d.png">

# Contrbutors
- [Brian Haney](https://devpost.com/Bhaney44/challenges)
- [Samuel Tosin](https://devpost.com/Samuellyworld/challenges)
- [David Kazeem](https://devpost.com/davonjagah/challenges)

# MIT License
Copyright Choice Coin 2022

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

