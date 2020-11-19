import axios from 'axios';

const LandingPage = ({ currentUser }) => {
  return <h1>landing page</h1>
};

LandingPage.getInitialProps = async ({ req }) => {
  if (typeof window === 'undefined') {
    // request to namespace when executed from node
    const { data } = await axios.get(
      'http://ingress-nginx.ingress-nginx.svc.cluster.local/api/users/currentuser',
      {
        headers: req.headers
      }
    );

    return data;
  } else {
    const { data } = await axios.get('/api/users/currentuser');

    return data;
  }

};

export default LandingPage;