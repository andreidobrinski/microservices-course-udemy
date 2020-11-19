import axios from 'axios';

const LandingPage = ({ currentUser }) => {
  return <h1>landing page</h1>
};

LandingPage.getInitialProps = async () => {
  if (typeof window === 'undefined') {
    // request to namespace when executed from node
    const { data } = await axios.get(
      'http://ingress-nginx.ingress-nginx.svc.cluster.local/api/users/currentuser',
      {
        headers: {
          Host: 'ticketing.dev'
        }
      }
    );

    return data;
  } else {
    const { data } = await axios.get('/api/users/currentuser');

    return data;
  }

};

export default LandingPage;