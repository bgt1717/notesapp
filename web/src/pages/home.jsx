import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import t1 from '../assets/t1.svg';
import './home.css'

const Home = () => {
  const navigate = useNavigate();
  const [cookies] = useCookies(['access_token']);

  const handleButtonClick = () => {
    navigate('/auth');
  };

  const handleButtonClick2 = () => {
    navigate('/createnote');
  };

  return (
    <div className="HomeContainer">
      <div className="homeimage">
        <img src={t1} style={{width:"1500px"}} alt="" className="" />
      </div>
      {!cookies.access_token ? (
        <button className="navigatebutton" onClick={handleButtonClick}>
          Start Here
        </button>
      ) : (
        <button className="navigatebutton" onClick={handleButtonClick2}>
          Create a Note
        </button>
      )}
    </div>
  );
};

export default Home;



