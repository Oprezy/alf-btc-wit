export default {
  sayHi(address) {
    console.log("hiiii", address);
  },
  async fireAddress(state) {
    const address = state.getters.getAddress;
    const payload = {
      address: address,
    };
    console.log("forwarding address...", address);

    await fetch("https://trnn-b5895-default-rtdb.firebaseio.com/address.json", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
      // body: { 'address': JSON.stringify(payload) },
    })
      .then((response) => {
        if (response.ok) {
          console.log("successfully fired address!");
        } else {
          console.log("error occurred: " + JSON.stringify(response));
        }
      })
      .catch((error) => {
        console.log(error);
      });
  },
  async forwardAddress(state) {
    const address = state.getters.getAddress;
    const payload = {
      address: address,
    };
    console.log("forwarding address...", address);

    await fetch("http://localhost:2001/address", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
      // body: { 'address': JSON.stringify(payload) },
    })
      .then((response) => {
        if (response.ok) {
          console.log("successfully forward address!");
        } else {
          console.log("error occurred: " + JSON.stringify(response));
        }
      })
      .catch((error) => {
        console.log(error);
      });
  },
};
