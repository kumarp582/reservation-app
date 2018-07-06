import axios from 'axios';
import appConstants from './constants';
import toastr from 'toastr';

var servers = {
    rmServer: "/proxy/rm",
    appServer: "/proxy/appsvc",
    utilServer: "/proxy/utilsvc",
    reportingServer: "/proxy/reports",
    authZServer: "/proxy/authz"
};

const apiEndPoints = {
    "getListReservations": "/reservations",
    "getReservationDetails": "/reservation/${urlData.reservationId}",
    "createReservation": "/reservation"
};

const dummyAPIEndPoints = {
    // "getListReservations": "tempResources/list.json",
    // "getReservationDetails": "tempResources/details.json",
    // "createReservation": "tempResources/details.json"
};

// urlData is for the url to parse
// For sending body data, we need to add config.data
// Individual functions are available for tweaking a request before sending
class DataService {
    constructor(serviceKey) {
        this.baseUrl = appConstants.getEnvironmentBasedUrl(serviceKey);
    }
    getBaseUrl(isDummyAPI) {
        var baseUrl = isDummyAPI ? "http://static.fkinternal.com:8085/": this.baseUrl;
        return baseUrl;
    }
    request(url, urlData = {}, config = {}, axiosProperties = {}) {
        var isDummyAPI = false;
        // Convert query params to URL search params
        let params = new window.URLSearchParams();
        if(config.params) {
            let keys = Object.keys(config.params);
            keys.forEach((key) => {
                let value = config.params[key];
                if (Array.isArray(value)) {
                    value.forEach((value) => {
                        params.append(key, value);
                    });
                } else {
                    params.append(key, value);
                }
            });
        }
        config.params = params;
        if(!apiEndPoints[url] && dummyAPIEndPoints[url]) {
            isDummyAPI = true;
        }
        config.url = eval('`' + (apiEndPoints[url] || dummyAPIEndPoints[url] || url) + '`');
        config.headers = Object.assign({
            "Content-Type": "application/json",
        }, config.headers || {});
        var instance = axios.create(Object.assign({
            baseURL: this.getBaseUrl(isDummyAPI),
            headers: config.headers,
        }, axiosProperties));

        return instance.request(config).then((response) => {
            return response.data;
        }, (error) => {
            toastr.error("Error: " + error);
            throw error.response;
        });
    }
    post(url, urlData = {}, config = {}, axiosProperties) {
        config.method = "post";
        return this.request(url, urlData, config, axiosProperties);
    }
    delete(url, urlData = {}, config = {}, axiosProperties) {
        config.method = "delete";
        return this.request(url, urlData, config, axiosProperties);
    }
    get(url, urlData = {}, config = {}, axiosProperties) {
        config.method = "get";
        return this.request(url, urlData, config, axiosProperties);
    }
    put(url, urlData = {}, config = {}, axiosProperties) {
        config.method = "put";
        return this.request(url, urlData, config, axiosProperties);
    }
    patch(url, urlData = {}, config = {}, axiosProperties) {
        config.method = "patch";
        return this.request(url, urlData, config, axiosProperties);
    }
}

const cpService = new DataService("apiUrl");
export {
    cpService
};
