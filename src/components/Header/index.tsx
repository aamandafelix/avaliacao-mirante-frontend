import React from 'react';
import { FiPower } from 'react-icons/fi';
import { useHistory } from 'react-router-dom';

interface Props {
  title: string;
}

const Header: React.FC<Props> = (props: {title: String}) => {
  const history = useHistory();

  function handleLogout() {
    localStorage.clear();
    history.push('/');
  }

  return (
    <div>
      <header>
        <h1>{props.title}</h1>
        <button title="Logout" onClick={handleLogout} type="button">
          <FiPower size={18} color="#E02041" />
        </button>
      </header>
    </div>
  );
};

export default Header;