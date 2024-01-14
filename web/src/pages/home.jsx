import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';

const Home = () => {
  const navigate = useNavigate();
  const [cookies] = useCookies(['access_token']);

  const handleButtonClick = () => {
    navigate('/auth');
  };

  return (
    <div className="HomeContainer">
      <div className="CenteredColumn">
        <div className="CenteredText">
          Capture ideas, organize thoughts, and never miss a moment with our intuitive notes app.
        </div>
        <div className="CenteredTextSmall">
          My Notes is an easy-to-use application for notetaking. 
          Made with node.JS, MongoDB, EJS, React, and MongoDB.
        </div>
      </div>
      {!cookies.access_token && (
        <button className="YellowButton" onClick={handleButtonClick}>
          Try MyNotes, It's FREE!
        </button>
      )}
    </div>
  );
}

export default Home;


