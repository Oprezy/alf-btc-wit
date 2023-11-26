<template>
    <!-- <router-view></router-view> -->
    <section>
        <div>
        </div>

        <form @submit.prevent="registerAddress">
            <div class="form-control">
                <label for="address">Exchange Name</label>
                <input type="text" name="address" v-model="exchangeName" />
                <label for="address">Address</label>
                <input type="text" name="address" v-model="address" />
                <label for="address">Link</label>
                <input type="text" name="owner" v-model="url" />
            </div>
            <br />


            <div>
                <button>Save address</button>
            </div>
        </form>
        <div>
            <!-- <button @click="check">check</button> -->
            {{ address }}
            {{ name }}
        </div>
    </section>
</template>
  
  
<script>
// import AuthenticationService from "../../services/AuthenticationService";
import localApiClient from "../../services/Api";

export default {
    data() {
        return {
            exchangeName: "",
            address: "",
            url: ""
        };
    },
    methods: {
        async registerAddress() {
            if (this.isChecked) {
                this.editAddress();
            } else {
                const payload = {
                    "name": this.exchangeName,
                    "url": this.url,
                    "address": this.address
                };
                console.log(payload);
                await localApiClient.post("http://localhost:2011/exchange/", payload);
                this.$router.push(`/exchange`);
            }
        },
    },
    watch: {
        //   selectedOption() {
        //     console.log(this.selectedOption);
        //   },
    },
    async created() {
        //   const allCategories = await axios.get("http://localhost:1007/category/");
        //   console.log(allCategories.data);
        //   const rawData = allCategories.data;

        //   const getOptions = rawData.map((item) => {
        //     return { "label": item.name, "value": item.id }
        //   })
        //   this.selectedOption = getOptions[0].value;
        //   this.options = getOptions;
    }
};
</script>
  
  
  
<style scoped>
form {
    margin: 1rem;
    border: 1px solid #ccc;
    border-radius: 12px;
    padding: 1rem;
}

.form-control {
    margin: 0.5rem 0;
}

label {
    font-weight: bold;
    margin-bottom: 0.5rem;
    display: block;
}

input,
textarea {
    display: block;
    width: 100%;
    font: inherit;
    border: 1px solid #ccc;
    padding: 0.15rem;
}

input:focus,
textarea:focus {
    border-color: #3d008d;
    background-color: #faf6ff;
    outline: none;
}

.errors {
    font-weight: bold;
    color: red;
}

.actions {
    text-align: center;
}
</style>
  
  
  // this.$store.commit("fire/saveAddress", this.address);
  // this.$store.dispatch("fire/fireAddress");
  // // this.$store.dispatch('forwardAddress');