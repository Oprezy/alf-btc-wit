<template>
  <section>
    <base-card>
      <div><h3>List of All addresses!</h3></div>
      <p v-for="address in allAddresses" :key="address.address">
        <base-card>
          <router-link :to="'/all/' + address['address']">
            <p v-if="address['owner']">
              <b>{{ address["owner"] }}</b>
            </p>
            <p v-else>
              {{ address["single"] }}
            </p>
          </router-link>
          <router-link :address="address" :to="'/setowner/' + address.single">
            . (S.O)</router-link
          >
        </base-card>
      </p>
    </base-card>
  </section>
</template>


<script>
import axios from "axios";
// import AuthenticationService from "../../services/AuthenticationService";


export default {
  data() {
    return {
      allAddresses: null,
    };
  },
  computed: {
    build() {
      return "https://tronscan.org/#/address/transfers";
    },
  },
  async created() {
    const resp = await axios.get("http://localhost:1007/address", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `${localStorage.getItem("Authorization")}`
      }
    });
    const respData = resp.data;
    this.allAddresses = respData

    await this.$store.dispatch("stats/saveAllAddresses", {
      ok: this.allAddresses,
    });
  },
};
</script>


<style>
h3 {
  width: 100%;
  height: 3rem;
  background-color: #3d008d;
  display: flex;
  justify-content: center;
  align-items: center;
  color: rgb(229, 223, 223);
}
</style>
