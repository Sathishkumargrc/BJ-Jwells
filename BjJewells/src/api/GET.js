import axios from 'axios';

export const GET_API = async (endpoint) => {
  var config = {
    method: 'get',
    url: endpoint,
  };

  return await axios(config);
};