<template>
    <!-- <section>
      <base-card>
        <h3>Stats</h3>
        <p><b>In/Out:</b> {{ dataAmount.toLocaleString() }} / {{ outgoingAmount.toLocaleString() }}</p>
      </base-card>
  
      <top-vendors :address="address" :totalOut="outgoingAmount"></top-vendors>
      <vip-customers :address="address" :totalIn="dataAmount"></vip-customers>
    </section> -->

    <section>
        <div v-if="outgoing">
            <base-card>
                <h3>Outgoing $Coins</h3>

                <div v-for="output in outgoing" :key="output.unique">
                    <router-link :to="/addres/ + output.txn_address">
                        {{ output.txn_address }}
                    </router-link>
                    {{ output.alias }} - {{ output.txn_amount }}
                </div>
            </base-card>
        </div>
    </section>

    <section>
        <div v-if="incoming">
            <base-card>
                <h3>Incoming $Coins</h3>

                <div v-for="input in incoming" :key="input.unique">
                    <router-link :to="/addres/ + input.txn_address">
                        {{ input.txn_address }}
                    </router-link>

                    - {{ input.alias }} - {{ input.txn_amount }}
                </div>
            </base-card>
        </div>
    </section>

    <section />
</template>
  
  
<script>

import localApiClient from "../../services/Api";

export default {
    components: {
    },
    data() {
        return {
            address: "",
            addressAlias: "",
            incoming: null,
            outgoing: "",
            dataAmount: 0,
            outgoingAmount: 0,
        };
    },
    async created() {
        // this.address = this.$route.params.addr;
        console.log(this.$route.params.hash);
        const payload1 = {
            "hash": this.$route.params.hash
        }
        await localApiClient.post('/txn/get-txn', payload1, { headers: { 'Authorization': localStorage.getItem('Authorization') } } )
            .then((response) => {
                this.incoming = response.data[0];
                this.outgoing = response.data[1];
                console.log(response);
            })
            .catch((error) => { console.log(error); });
    }
};
</script>
  
  
  
<style scoped>
h3 {
    width: 100%;
    height: 3rem;
    background-color: #3d008d;
    display: flex;
    justify-content: center;
    align-items: center;
    color: rgb(227, 215, 215);
}
</style>
  
  
  