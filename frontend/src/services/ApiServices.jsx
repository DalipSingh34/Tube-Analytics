import axios from "axios";

const BASE_URL = "http://localhost:3002";

class ApiServices {

    login(data) {
        return axios.post(BASE_URL + "/api/auth/login", data)
    }

    register(data) {
        return axios.post(BASE_URL + "/api/auth/register", data)
    }

    searchSentiment(videoId, sortOrder = "relevance", token) {
        return axios.get(
            BASE_URL +
            `/api/sentiment?videoId=${videoId}&order=${sortOrder}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );
    }

    getHistory(token) {
        return axios.get(
            BASE_URL + "/api/history",
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );
    }

}

export default new ApiServices()