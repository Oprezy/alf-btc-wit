<template>
  <section>
    <div v-if="localAddress">
      <base-card>
        <div>
          <h3>Top Vendors!</h3>
        </div>
        <vendor-view v-for="customer in vendors" :key="customer.txn_receiver" :address="customer.txn_receiver"
          :amount="customer.amount" :alias="customer.txn_receiverAlias" :count="customer.count" :owner="address"
          :totalOut="totalOut">
        </vendor-view>
      </base-card>
    </div>
  </section>
</template>
  
  
  
<script>
import axios from "axios";
import VendorView from "../tronOrg/VendorView.vue";

export default {
  components: {
    VendorView
  },
  props: ["address", "totalOut"],
  data() {
    return {
      vendors: null,
      localAddress: this.address
    };
  },
  methods() { },
  async created() {
    
  },
  watch: {
  async address(newVal) {
    this.localAddress = newVal;
    const response = await axios.post("http://localhost:1007/txns/vip", { "address": this.address });
    const responseData = response.data;
    this.vendors = responseData;
  }
}

};
</script>