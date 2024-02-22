import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import { AuthContext } from "context/AuthContext";

const BASE_API_URL = 'https://qr-code-checkin.vercel.app/api/admin';

export const useFetch = async ({apiUrl='', option={}}) => {
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    
    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                setError(null);
        
                const response = option.method === 'post'
                ? await axios.post(apiUrl, option.data, option.config)
                : await axios.get(apiUrl, option.config);
        
                setData(response.data);
            } 
            catch (error) {
                setError(error.message);
            } finally {
                setIsLoading(false);
            }
        };
    
        fetchData();
    }, [apiUrl, option.method, option.data, option.config]);

    return { data, isLoading, error };
}

// export const PostAdminLogin = async (data) => {
//     const apiUrl = BASE_API_URL + '/loginAdmin';
//     const navigate = useNavigate();
//     const responseData = null;

//     const { loading, error, dispatch } = useContext(AuthContext);

//     dispatch({ type: "LOGIN_START" });
//     try {
//         responseData = await useFetch({
//             apiUrl: apiUrl, 
//             option: 'post',
//             data: data,
//         });
//         console.log(responseData);
//         if (responseData?.data?.details?.username) {
//             dispatch({ type: "LOGIN_SUCCESS", payload: responseData.data.details });
//             // navigate("/");
//         }
//     } catch (error) {
//         console.log(error);
//         dispatch({ type: "LOGIN_FAILURE", payload: "errr" });
//     }

// }

