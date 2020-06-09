import React, { FormEvent, useState, ChangeEvent, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import swal from 'sweetalert';

import api from '../../../services/api';

import './styles.css';

interface Perfil {
  nome: string;
}

const CreateOperador = () => {
  const history = useHistory();
  const jwt = localStorage.getItem('jwt');
  const currentPerfil = localStorage.getItem('perfil') || '/';

  const [perfis, setPerfis] = useState<Perfil[]>([]);

  const [name, setName] = useState('');
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [perfil, setPerfil] = useState('');

  useEffect(() => {
    api.get('perfil', { headers: {'Authorization' : `Bearer ${jwt}`} }).then(
      response => {
        const perfilResponse: Perfil[] = response.data;
        const perfisFiltered = perfilResponse.filter(perfil => perfil.nome !== "Administrador");
        
        if (!perfisFiltered[0]) {
          swal({
            text: 'Não foi possível carregar os dados necessários para essa ação. Verifique sua conexão e tente novamente!',
            icon: 'error'
          });
          history.goBack();
        } else {
          setPerfil(perfisFiltered[0].nome);
          setPerfis(perfisFiltered);
        }
      },
      () => {
        swal({
          text: 'Não foi possível carregar os dados necessários para essa ação. Verifique sua conexão e tente novamente!',
          icon: 'error'
        });
        history.goBack();
      }
    );
  }, [jwt, history]);

  function handleNameChange(event: ChangeEvent<HTMLInputElement>) {
    const { value } = event.target;
    setName(value);
  }

  function handleLoginChange(event: ChangeEvent<HTMLInputElement>) {
    const { value } = event.target;
    setLogin(value);
  }

  function handlePasswordChange(event: ChangeEvent<HTMLInputElement>) {
    const { value } = event.target;
    setPassword(value);
  }

  function handlePerfilChange(event: ChangeEvent<HTMLSelectElement>) {
    const { value } = event.target;
    setPerfil(value);
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
   
    const data = {
      nome: name,
      username: login,
      password: password,
      perfil: perfil
    };

    api.post('operador', data, { headers: {'Authorization' : `Bearer ${jwt}`} }).then(
      () => {
        swal({
          text: 'Operador cadastrado com sucesso!',
          icon: 'success'
        });
        history.goBack();
      },
      () => {
        swal({
          text: 'Não foi possível completar essa ação.',
          icon: 'error'
        });
        history.goBack();
      }
    );
  }

  return (
    <div id="page-create-operador">
      <div className="content">
        <header>
          <h1>Avaliacao Mirante</h1>

          <Link to={currentPerfil}>
            <FiArrowLeft />
            Voltar
          </Link>
        </header>

        <form onSubmit={handleSubmit}>
          <h2>Cadastrar Operador</h2>
          <fieldset>
            <div className="field">
              <label htmlFor="name">Nome</label>
              <input
                type="text"
                name="name"
                id="name"
                onChange={handleNameChange}
                required
                maxLength={100}
                // pattern="[A-z]"
                title="Entre 1 e 100 caracteres não numéricos"
              />
            </div>

            <div className="field">
              <label htmlFor="login">Login</label>
              <input
                type="text"
                name="login"
                id="login"
                onChange={handleLoginChange}
                required
                maxLength={15}
                pattern="[A-z_-]+"
                title="Login deve ter entre 1 e 15 caracteres"
              />
            </div>

            <div className="field">
              <label htmlFor="password">Senha</label>
              <input
                type="text"
                name="password"
                id="password"
                onChange={handlePasswordChange}
                required
                minLength={6}
                maxLength={15}
                title="Entre 6 e 15 caracteres, sem espaços"
              />
            </div>

            <div className="field">
              <label htmlFor="login">Perfil</label>
              <select 
                required
                onChange={handlePerfilChange}
                title="Selecione um perfil"
              >
                <option></option>
                {perfis.map(perfil => (
                  <option key={perfil.nome} value={perfil.nome}>{perfil.nome}</option>
                ))}
              </select>
            </div>
          </fieldset>

          <button type="submit">Cadastrar</button>
        </form>
      </div>
    </div>
  );
}

export default CreateOperador;
