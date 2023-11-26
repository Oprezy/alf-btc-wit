<template>
  <section>
    <base-card>
      <div><h3>List of VIP Customers!</h3></div>
      <vip-view
        v-for="customer in vipCustomers"
        :key="customer.address"
        :address="customer.txn_sender"
        :amount="customer.amount"
        :alias="customer.txn_senderAlias"
        :count="customer.count"
        :owner="txn_sender"
        :totalIn="totalIn"
      >
      </vip-view>
    </base-card>
  </section>
</template>



<script>
import axios from "axios";
import VipView from "../tronOrg/VipView.vue";

export default {
    components: {
        VipView
    },
  props: ["address", "totalIn"],
  data() {
    return {
      vipCustomers: null,
      localAddress: this.address
    };
  },
  methods() {},
  async created() {
  },
  watch: {
  async address(newVal) {
    this.localAddress = newVal;
    const response = await axios.post("http://localhost:1007/txns/vip-cst", { "address": this.address });
    const responseData = response.data;
    this.vipCustomers = responseData;
  }
}
};
</script>