export default {
  saveAllAddresses(state, payload) {
    state.allAddressInfo = payload;
  },
};

// saveAddress(state, payload) {
//   state.address = payload;
//   console.log('address saved');
// },
// saveAddresses(state, payload) {
//   state.addresses = payload;
//   console.log('Bulk addresses saved');
// },
// saveData(state, payload) {
//   state.addressData = payload;
//   console.log('address data saved');
// },
