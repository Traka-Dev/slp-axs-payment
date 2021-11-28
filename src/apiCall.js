import axios from "axios";

const apiCall = async(url, params = []) => {
    const response = {};
    try {
        const r = await axios(url);
        response.code = 1;
        response.data = r.data;
        return response;
    } catch (error) {
        response.code = 0;
        response.data = error.message;
        return response;
    }

}

export default apiCall;