import axios from "axios";

export const fetchAllUsers = async () => {
  try {
    const res = await axios({
      method: "get",
      url: `api/users`,
    });

    return res;
  } catch (error) {
    return error;
  }
};
