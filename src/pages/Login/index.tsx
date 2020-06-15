import React, { FormEvent, useState, ChangeEvent } from 'react';
import { useHistory } from 'react-router-dom';
import swal from 'sweetalert';

import api from '../../services/api';

import './styles.css';

import Footer from '../../components/Footer';

const Login = () => {
  const history = useHistory();
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  function handleUsernameChange(event: ChangeEvent<HTMLInputElement>) {
    const { value } = event.target;
    setUsername(value);
  }

  function handlePasswordChange(event: ChangeEvent<HTMLInputElement>) {
    const { value } = event.target;
    setPassword(value);
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    const data = {
      username: username,
      password: password
    }

    try {
      const response = await api.post('authenticate', data);
     
      localStorage.setItem('jwt', response.data.jwt);
      localStorage.setItem('perfil', response.data.perfil);

      const routeRedirect = String(response.data.perfil).toLowerCase();
      history.push(`/${routeRedirect}`);
    } catch (err) {
      swal({
        text: 'Não foi possível logar. Tente novamente.',
        icon: 'error'
      });
    }
  }

  return (
    <div id="page-home">
      <div className="content">
        <header>
          <h1>Avaliação Mirante</h1>
        </header>

        <form onSubmit={handleSubmit}>
          <h2>Fazer login</h2>
          <fieldset>
            <div className="field">
              <label htmlFor="username">
                Usuário
              </label>
              <input
                type="text"
                name="username"
                id="username"
                onChange={handleUsernameChange}
                maxLength={50}
              />
            </div>

            <div className="field">
              <label htmlFor="password">
                Senha
              </label>
              <input
                type="password"
                name="password"
                id="password"
                onChange={handlePasswordChange}
              />
            </div>
          </fieldset>

          <button type="submit">Entrar</button>
        </form>
      </div>

      <Footer />
    </div>
  );
}
  
export default Login;
