import axios from 'axios';

const localApiClient = axios.create({
    baseURL: 'http://x.preziy.com.ng:2011/'
})

export default localApiClient;

// http://localhost:2011/
// http://x.preziy.com.ng:2011/