import getters from "./getters.js";
import mutations from "./mutations.js";
import actions from "./actions.js";

export default {
  namespaced: true,
  state() {
    return {
      allAddressInfo : null,
    };
  },
  getters,
  mutations,
  actions,
};

// address: 'address',
// koko: 'koka',
// addressData: 'kolalla',
// addresses: null,
// newData: null,
