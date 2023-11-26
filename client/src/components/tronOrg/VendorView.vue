<template>
    <section>
      <base-card>
        <p v-if="!alias">
          <router-link :to="'/register/'+address">{{ address }}</router-link> or <router-link :to="'/all/'+address">Visit</router-link>
            - <b>{{ amount.toLocaleString() }}</b> -
          <i>{{ Math.floor((amount / totalOut) * 100) }}%</i>
        </p>
        <p v-else>
          <router-link :to="'/all/'+address"> {{ alias }}</router-link> - <b>{{ amount.toLocaleString() }}</b> -
          <i>{{ Math.floor((amount / totalOut) * 100) }}%</i>
        </p>
      </base-card>
    </section>
  </template>
  
  
  <script>
  export default {
    data() {
      return {
        theOwner: null,
      };
    },
    props: ["address", "amount", "alias", "owner", "count", "totalOut"],
    async created() {},
  };
  </script>