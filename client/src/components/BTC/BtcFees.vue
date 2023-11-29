<template>
    <section>


            <div class="table-container">

                <table class="table">
                    <thead>
                        <tr>
                            <th>When?</th>
                            <th>Slow</th>
                            <th>Normal</th>
                            <th>Fast</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="txn in fees" :key="txn.fee_id">
                            <td>{{ txn.fee_timestamp }}</td>
                            <td> <b>{{ txn.fee_slow }}</b></td>
                            <td>{{ txn.fee_normal }}</td>
                            <td>{{ txn.fee_fast }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>


    </section>
</template>

<script>
import localApiClient from "../../services/Api";

export default {
    data() {
        return {
            fees: null
        }
    },
    created() {
        localApiClient.get('/fee/all-fees').then((response) => {
            console.log(response.data);
            this.fees = response.data;
        }).catch((error) => console.log(error));
    }
}
</script>
