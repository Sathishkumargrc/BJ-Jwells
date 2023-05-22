import axios from 'axios';

export const POST_API = async (endpoint, data) => {
  var config = {
    method: 'post',
    url: endpoint,
    data: data,
  };

  return await axios(config);
};
