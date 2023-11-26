<template>
  <section>
    <base-card>
      <h3>Recent!!</h3>
      <!-- {{ recentTxns }} -->
      <div v-for="txn in recentTxns" :key="txn.id">
        <base-card>
          <table>
            <tr>
              <td>
                <a :href="'http://www.blockchain.com/explorer/transactions/btc/' + txn.hash" target="_blank"><b>( {{
                  txn.amount }} ) </b></a>
              </td>
              <td class="right-item">{{ txn.time }}</td>
            </tr>
            <tr>
              <td>
                <p>
                  <a :href="'http://www.blockchain.com/explorer/transactions/btc/' + txn.hash" target="_blank"> </a>
                  <!-- {{ txn.hash }} -->
                  <router-link :to="'/hash/' + txn.hash"> {{ txn.hash }}</router-link>
                </p>
                <p><router-link :to="'/addres/' + txn.address"> {{ txn.exchangeName }}</router-link></p>
              </td>

              <td>

              </td>
            </tr>
          </table>
        </base-card>
      </div>
    </base-card>
  </section>
</template>


<script>
// import axios from "axios";
import localApiClient from "../../services/Api";
// import localApiClient from '../../services/Api';
export default {
  data() {
    return {
      recentTxns: null,
      newTxns: null
    };
  },
  async created() {
    localApiClient.get('/txn/get-recent-txns', { headers: { 'Authorization': localStorage.getItem('Authorization') } })
      .then(response => {
        const real = response.data;
        console.log(real);
        this.recentTxns = real.splice(0, 100);
        console.log(this.recentTxns);
      })
      .catch(error => {
        console.log("Error: ", error);
      });

    this.runAllJobs(); 
  },
  methods: {
    async runAllJobs() {
      localApiClient.get('/txn/run-all')
        .then(() => console.log('running all major jobs...'))
        .catch((error) => console.log(error));
    }
  }
};
</script>

<style scoped>
.right-item {
  float: right;
}
</style>