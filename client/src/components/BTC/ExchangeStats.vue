<template>
    <section>
        <base-card>
            <div v-if="stats">

                <h3>Exchange Stats</h3>
                <div v-for="exchange in stats" :key="exchange.name">
                    <base-card>
                        <h3>
                            Name: {{ exchange.exchangeName }} <br>
                        </h3>
                        <p>
                            <router-link :to="/addres/ + exchange.exchangeAddress">
                                {{ exchange.exchangeAddress }}
                            </router-link>
                        </p>
                        <p>
                            Url: {{ exchange.exchangeUrl }} <br>
                        </p>
                        <b> {{ exchange.totalInputAmount }} </b> in
                        <i> {{ exchange.txnCount }}</i> Transactions from about
                        {{ exchange.addressCount }} Customers!
                    </base-card>
                </div>
            </div>
        </base-card>
    </section>
</template>
  
  
<script>
import localApiClient from "../../services/Api";

export default {
    components: {
    },
    data() {
        return {
            stats: null
        };
    },
    async created() {
        console.log('getting exchange stats');
        await localApiClient.get('/txn/exchange-stats', { headers: { 'Authorization': localStorage.getItem('Authorization') } })
            .then((response) => {
                this.stats = response.data;
                console.log(response.data);
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
  
  