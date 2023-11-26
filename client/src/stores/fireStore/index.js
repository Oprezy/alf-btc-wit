
// import fireAction from "./stores/fireStore/actions";
// import fireGetters from "./stores/fireStore/getters";
// import fireMutations from "./stores/fireStore/mutations";

import getters from "./getters.js";
import mutations from "./mutations.js";
import actions from "./actions.js";


export default {
    namespaced: true,
    state() {
        return {
          id: "an address",
          address: "0090",
        };
      },
    getters,
    mutations,
    actions,
};