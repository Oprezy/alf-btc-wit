<template>
  <base-card>
    <div>
      (<b>{{ amount.toLocaleString() }}</b
      >)  <router-link :to="'/address/'+from"> {{ fromAlias }}</router-link> ----- <router-link :to="'/all/'+to"> {{ toAlias }}</router-link>  _____________________
      <small>
        
        <b v-if="time<60"> {{ time }} minutes ago</b>
        <b v-else> {{ Math.floor(time/60) }} hours ago</b>
        </small
      >
    </div>
    <div v-if="!fromAlias"><br>From: <router-link :to="'/address/'+from"> {{ from }}</router-link> <router-link :to="'/register/'+from">[Save]</router-link></div>
    <div v-if="!toAlias"><br>To: <router-link :to="'/address/'+to"> {{ to }}</router-link> <router-link :to="'/register/'+to">[Save]</router-link></div>
  </base-card>
</template>



<script>
export default {
  props: ["from", "to", "amount", "hash", "time", "fromAlias", "toAlias"],
  data() {
    return {};
  },
};
</script>


<style scoped>
small {
  text-align: right;
}
</style>