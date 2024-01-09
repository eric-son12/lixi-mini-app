import axiosClient, { axiosLocalClient } from '../../utils/axiosClient';
import { LocalUser } from './localUser';

const localAccountApi = {
  localLogin(localUser: LocalUser): Promise<any> {
    const url = '/_api/local-login';
    return axiosLocalClient
      .post(url, localUser)
      .then(res => {
        return res.data;
      })
      .catch(err => {
        const { response } = err;
        throw response?.data ?? err ?? 'Network Error';
      });
  }
};

export default localAccountApi;
