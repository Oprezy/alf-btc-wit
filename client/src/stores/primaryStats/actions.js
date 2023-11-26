import AuthenticationService from "../../services/AuthenticationService";

export default {
  saveAllAddresses(context, payload) {
    console.log(payload.ok, "showing ok");

    context.commit("saveAllAddresses", payload.ok);
  },
  async analyzeAddress(state, address) {
    const response = await fetch(
      `https://api.trongrid.io/v1/accounts/${address}/transactions/trc20?limit=200&contract_address=TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t`
    );
    const result = await response.json();
    const allData = result["data"];

    const toIncoming = [];
    const fromOutgoing = [];
    for (let i = 0; i < allData.length; i++) {
      const allAddressInfo = allData[i];
      const hash_id = allAddressInfo.transaction_id;
      const rawTime = new Date(allAddressInfo.block_timestamp);
      const time = rawTime.toLocaleString();
      const value = allAddressInfo.value * 0.000001;
      const from = allAddressInfo.from;
      const to = allAddressInfo.to;

      const addressInfo = {
        hash: hash_id,
        time: time,
        amount: Math.floor(value), //.toLocaleString(),
        from: from,
        to: to,
      };

      const response = await AuthenticationService.fetchAllAddresses();
      const allAddresses = response["data"]["addresses"];
      if (allAddresses == null) {
        return;
      }
      for (let i = 0; i < allAddresses.length; i++) {
        const single = allAddresses[i].single;
        const owner = allAddresses[i].owner;

        if (from == single) {
          addressInfo.fromAlias = owner;
        } else if (to == single) {
          addressInfo.toAlias = owner;
        }
      }

      if (value < 10) {
        continue;
      } else if (address === to) {
        toIncoming.push(addressInfo);
      } else {
        fromOutgoing.push(addressInfo);
      }
    }
    const data = [toIncoming, fromOutgoing];
    return data;
  },
};

// const payload = {
//   address: to
// };
// console.log(to, payload);

// const toName = await AuthenticationService.getAddressOwner(payload);
// console.log(toName);
// saveAddress(context, payload) {
//   context.commit("saveAddress", payload);
// },
// saveAddresses(context, payload) {
//   context.commit("saveAddresses", payload);
// },
// async getStats(state) {
//   const current = new Date().getTime();
//   const aDay = 24 * 60 * 60 * 1000;
//   const endTime = current - aDay * 30 * 2;
//   const aMonth = aDay * 30 * 6;

//   // old data - start_timestamp=1680043160&end_timestamp=1688643217

//   const address = state.getters["getAddress"];
//   const link = `https://apilist.tronscanapi.com/api/transfer/trc20?address=${address}&trc20Id=TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t&start=0&limit=50&direction=0&reverse=true&db_version=1&start_timestamp=${aMonth}&end_timestamp=${endTime}`;
//   const response = await (await fetch(link)).json();
//   const transactions = response["data"];
//   const refinedTranactions = [];
//   const outgoing = [];

//   for (let i = 0; i < transactions.length; i++) {
//     const hash = transactions[i].hash;
//     const to = transactions[i].to;
//     const from = transactions[i].from;
//     const amount = transactions[i].amount * 0.000001;
//     const rawTime = new Date(transactions[i].block_timestamp);
//     const time = rawTime.toLocaleString();

//     if (amount < 10) {
//       console.log("small one");
//     } else if (from === address) {
//       const transaction = {
//         from: from,
//         to: to,
//         amount: amount,
//         time: time,
//         hash: hash,
//       };
//       outgoing.push(transaction);
//     } else {
//       const transaction = {
//         from: from,
//         to: to,
//         amount: amount,
//         time: time,
//         hash: hash,
//       };
//       refinedTranactions.push(transaction);
//     }
//   }
//   console.log(refinedTranactions);
//   console.log(outgoing);

//   const incomingOutgoing = [refinedTranactions, outgoing];

//   return incomingOutgoing;
//   // context.commit("saveData", refinedTranactions);
//   // console.log(context.commit);
// },

// TYWyTnSG7fVQtxL1NDyiLTeUpPUzhMWFfA

// const sdk = require('api')('@tron/v4.7.2#17d20r2ql9cidams');

// sdk.getTransactionInfoByAccountAddress({address: 'TXXp6EZsnQMBxfCaRkv9HgNEmX56UU6WKD'})
// .then(({ data }) => console.log(data))
// .catch(err => console.error(err));

//
// console.log(address);

// const axios = require("axios");

// const data = [];

// axios
//   .get(
//     `https://api.trongrid.io/v1/accounts/${address}/transactions/trc20?limit=200&contract_address=TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t`
//   )
//   .then((response) => {
//     const toIncoming = [];
//     const fromOutgoing = [];
//     const info = response.data.data;
//     for (let i = 0; i < info.length; i++) {
//       const allAddressInfo = info[i];
//       const hash_id = allAddressInfo.transaction_id;
//       const time = allAddressInfo.block_timestamp;
//       const value = allAddressInfo.value;
//       const from = allAddressInfo.from;
//       const to = allAddressInfo.to;

//       const addressInfo = {
//         hash: hash_id,
//         time: time,
//         value: value,
//         from: from,
//         to: to,
//       };
//       // data.push(addressInfo);
//       // console.log(addressInfo);

//       if(address === to) {
//         toIncoming.push(addressInfo);
//       } else {
//         fromOutgoing.push(addressInfo);
//       }
//     }
//     // console.log(toIncoming);
//     // console.log(state.commit);
//     context.commit('saveNewData', toIncoming);
//     // data.push(toIncoming);
//     // data.push(fromOutgoing);
//   })
//   .catch((error) => {
//     console.error(error);
//   });

//   return data;
