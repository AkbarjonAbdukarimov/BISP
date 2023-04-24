import axios from "axios";
import { useState } from "react";
type errors = null | Array<{ field: string, message: string }>
//@ts-ignore
const useRequest = ({ url, method, body, onSuccess }) => {
  const [errors, setErrors] = useState<errors>(null);

  const doRequest = async (props = {}) => {
    try {
      setErrors(null);
      //@ts-ignore
      const response = await axios[method](url, { ...body, ...props });

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