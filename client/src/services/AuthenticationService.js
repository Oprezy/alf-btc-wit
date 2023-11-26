import Api from './Api';

export default {
    saveAddr(credentials) {
        return Api().post('saveAddress', credentials)
    },
    fetchAllAddresses() {
        return Api().get('addresses')
    },
    setOwner(address, owner) {
        return Api().put('setowner', address, owner)
    },
    getAddressOwner(credentials) {
        console.log("credentials", credentials);
        return Api().post('getaddress', credentials)
    },
    getVipCustomers(credentials) {
        return Api().post('vip-customers', credentials)
    },
    getVendors(supplierAddress) {
        return Api().post('get-vendors', supplierAddress)
    },
    getRecentTransactions() {
        return  Api().get('recent-txns');
    },
    registerTxns() {
        return Api().get('register-transactions');
    },
    getWatchedAddresses() {
        return Api().get('watched');
    }
}