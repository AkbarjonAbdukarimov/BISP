import axios, { AxiosResponse } from "axios";
import { useState } from "react";
type errors = null | Array<{ field: string, message: string }>
//@ts-ignore
const useRequest = ({ url, method, body, onSuccess }) => {
  const [errors, setErrors] = useState<errors>(null);

  const doRequest = async (props = {}) => {
    try {
      setErrors(null);
      let response: AxiosResponse;
      switch (method) {
        case 'get':
          response = await axios.get(url, { withCredentials: true });
          break;
        case 'post':
          response = await axios.post(url, body, { withCredentials: true });
          break;

      }
      console.log(response)


      if (onSuccess) {
        onSuccess(response.data);
      }

      return response.data;
    } catch (err) {
      setErrors(
        //@ts-ignore
        err.response.data.errors
      );
    }
  };

  return { doRequest, errors };
};
export default useRequest