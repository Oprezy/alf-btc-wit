<template>
  <section>
    <base-card>
      <form @submit.prevent="loginAdmin">
        <div class="form-control">
          <label for="email">email</label>
          <input type="text" name="email" v-model="email" />
          <label for="password">Password</label>
          <input type="password" name="password" v-model="password" />
        </div>
        <br />
        <div>
          <button>Login</button>
        </div>
      </form>
    </base-card>
  </section>
</template>


<script>
import localApiClient from "../../services/Api";

export default {
  data() {
    return {
      email: '',
      password: ''
    }
  },
  methods: {
    async loginAdmin() {
      await localApiClient.post("/user/login", {
        email: this.email,
        password: this.password
      }).then(response => {
        console.log(response.data);
        localStorage.setItem('Authorization', response.data.token);
        this.$router.push('/');
      }).catch(error => {
        const errorMessage = error.response.data.message;
        this.error = errorMessage;
        console.log(errorMessage);
      });
    }
  },
  created() {
    if (localStorage.getItem('Authorization')) {
      this.$router.push('/');
    }
  }
}
</script>