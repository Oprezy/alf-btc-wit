<template>
    <section>

            <base-card>
            <center>
               <b> {{ address }} </b>- <a :href="'https://www.blockchain.com/explorer/addresses/btc/' + address" target="_blank">View on BC</a>
            </center>
            </base-card>

    </section>
    <section>
        <div v-if="outgoing">
            <base-card>
                <h3>Outgoing $Coins</h3>
                <div v-for="transaction in outgoing" :key="transaction.txn_unique">
                    <base-card>
                        <router-link :to="/hash/ + transaction.hash">{{ transaction.hash }}</router-link>
                        - ({{ transaction.txn_amount }}) - <b>{{ transaction.readableDate }}</b>
                    </base-card>
                </div>
            </base-card>
        </div>
    </section>

    <section>
        <div v-if="incoming">
            <base-card>
                <h3>Incoming $Coins</h3>
                <div v-for="transaction in incoming" :key="transaction.txn_unique">
                    <base-card>
                        <router-link :to="/hash/ + transaction.hash">{{ transaction.hash }}</router-link>
                        - ({{ transaction.txn_amount }}) - <b>{{ transaction.readableDate }}</b>
                    </base-card>
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
        this.address = this.$route.params.address;

        const payload1 = {
            "address": this.$route.params.address
        }

        await localApiClient.post('/txn/fetch-address-hash', payload1)
            .then(() => console.log('saving hashes for address...'))
            .catch((error) => console.log(error));

        await localApiClient.post('/txn/grouped-address-txns', payload1)
            .then((response) => {
                const incoming = response.data[0];
                const outgoing = response.data[1];

                this.incoming = incoming.map((item) => {
                    return {
                        ...item,
                        readableDate: new Date(item.latest_timestamp * 1000).toLocaleString()
                    }
                })
                console.log(this.incoming);
                this.outgoing = outgoing.map((item) => {
                    return {
                        ...item,
                        readableDate: new Date(item.latest_timestamp * 1000).toLocaleString()
                    }
                })
                console.log(this.incoming);
            })
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
  
  