import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setUser } from "../redux/features/userSlice";

const useLoadingWithRefresh = () => {
  const [loading, setLoading] = useState(true);

  const dispatch = useDispatch();

  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.get(
          `${process.env.REACT_APP_DEV_API_URL}/api/user/refresh`,
          {
            withCredentials: true,
          }
        );

        dispatch(setUser(data));
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    })();
  }, [dispatch]);

  return loading;
};

export default useLoadingWithRefresh;
