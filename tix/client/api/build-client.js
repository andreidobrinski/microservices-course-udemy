import axios from 'axios';

export default ({ req }) => {
  if (typeof window === 'undefined') {
    // request to namespace when executed from node
    return axios.create({
      baseURL: 'http://ingress-nginx.ingress-nginx.svc.cluster.local',
      headers: req.headers
    })
  } else {
    // request from browser
    return axios.create({
      baseURL: '/'
    });
  }
};