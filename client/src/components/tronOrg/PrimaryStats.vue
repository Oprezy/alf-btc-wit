<template>
  <router-view></router-view>
  <section>
    <base-card>
      <h1>Stats about an address...</h1>
      <form @submit.prevent="submitForm">
        <div class="form-control">
          <label for="address"></label>
          <input type="text" name="address" id="" v-model="address" />
        </div>
        <div>
          <!-- <button>Spooool</button> -->
          <base-button>Spool</base-button>
        </div>
      </form>
    </base-card>
  </section>

  <section>
    <div v-if="data">
      <base-card>
        <transaction-list
          v-for="transaction in data"
          :key="transaction.hash"
          :from="transaction.from"
          :to="transaction.to"
          :amount="transaction.amount"
          :hash="transaction.hash"
          :time="transaction.time"
        ></transaction-list>
      </base-card>
    </div>
  </section>
</template>

<!-- TYWyTnSG7fVQtxL1NDyiLTeUpPUzhMWFfA -->

<script>
import TransactionList from "./TransactionList.vue";

export default {
  components: {
    TransactionList,
  },
  data() {
    return {
      address: "",
      data: null,
    };
  },
  methods: {
    async submitForm() {
      this.$store.dispatch("stats/saveAddress", this.address);
      const temp = await this.$store.dispatch("stats/getStats");
      this.$store.commit("stats/saveData", temp);
      console.log("ok");
      this.data = this.$store.getters["stats/getAddressData"];
    },
  },
};
</script>




<style>
.form-control {
  margin: 0.5rem 0;
}

label {
  font-weight: bold;
  display: block;
  margin-bottom: 0.5rem;
}

input[type="checkbox"] + label {
  font-weight: normal;
  display: inline;
  margin: 0 0 0 0.5rem;
}

input,
textarea {
  display: block;
  width: 100%;
  border: 1px solid #ccc;
  font: inherit;
}

input:focus,
textarea:focus {
  background-color: #f0e6fd;
  outline: none;
  border-color: #3d008d;
}

input[type="checkbox"] {
  display: inline;
  width: auto;
  border: none;
}

input[type="checkbox"]:focus {
  outline: #3d008d solid 1px;
}

h3 {
  margin: 0.5rem 0;
  font-size: 1rem;
}

.invalid label {
  color: red;
}

.invalid input,
.invalid textarea {
  border: 1px solid red;
}
</style>