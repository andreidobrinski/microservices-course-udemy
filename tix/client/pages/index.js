import axios from 'axios';

const LandingPage = ({ currentUser }) => {
  return <h1>landing page</h1>
};

LandingPage.getInitialProps = () => {
  const response = await axios.get('/api/users/currentuser');

  return response.data;
};

export default LandingPage;