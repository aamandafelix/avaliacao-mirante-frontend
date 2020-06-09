import React, { FormEvent, useState, ChangeEvent, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import swal from 'sweetalert';

import api from '../../../services/api';

import './styles.css';

interface Props {
  location: { state: { id: number} };
}

interface Perfil {
  nome: string;
}

const EditOperador = (props: Props) => {
  const history = useHistory();
  const jwt = localStorage.getItem('jwt');

  if (!props.location.state) {
    history.goBack();
  }

  const [perfis, setPerfis] = useState<Perfil[]>([]);

  const [name, setName] = useState('');
  const [login, setLogin] = useState('');
  const [perfil, setPerfil] = useState('');

  useEffect(() => {
    api.get('perfil', { headers: {'Authorization' : `Bearer ${jwt}`} }).then(
      response => {
        const perfilResponse: Perfil[] = response.data;
        const perfisFiltered = perfilResponse.filter(perfil => perfil.nome !== "Administrador");
        setPerfis(perfisFiltered);
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

  useEffect(() => {
    if (props.location.state.id) {
      api.get(`operador/${props.location.state.id}`, { headers: {'Authorization' : `Bearer ${jwt}`} }).then(
        response => {
          setName(response.data.nome);
          setLogin(response.data.username);
          setPerfil(response.data.perfil ? response.data.perfil[0] : '');
        },
        () => {
          swal({
            text: 'Não foi possível carregar os dados necessários para essa ação. Verifique sua conexão e tente novamente!',
            icon: 'error'
          });
          history.goBack();
        }
      );
    }
  }, [jwt, history, props.location.state.id]);

  function handleNameChange(event: ChangeEvent<HTMLInputElement>) {
    const { value } = event.target;
    setName(value);
  }

  function handlePerfilChange(event: ChangeEvent<HTMLSelectElement>) {
    const { value } = event.target;
    setPerfil(value);
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    const data = {
      id: props.location.state.id,
      nome: name,
      username: login,
      perfil: perfil
    }

    api.put('operador', data, { headers: {'Authorization' : `Bearer ${jwt}`} }).then(
      () => {
        swal({
          text: 'Operador atualizado com sucesso!',
          icon: 'success',
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
    <div id="page-edit-operador">  
      <div className="content">
        <header>
          <h1>Avaliacao Mirante</h1>

          <a onClick={history.goBack}>
            <FiArrowLeft />
            Voltar
          </a>
        </header>

        <form onSubmit={handleSubmit}>
          <h2>Editar Operador</h2>

          <fieldset>
            <div className="field">
              <label htmlFor="login">Nome</label>
              <input
                type="text"
                name="name"
                id="name"
                defaultValue={name}
                onChange={handleNameChange}
              />
            </div>

            {perfil !== 'Administrador' &&
              <div className="field">
                <label htmlFor="login">Perfil</label>
                <select 
                  required
                  value={perfil}
                  onChange={handlePerfilChange}
                  title="Selecione um perfil"
                >
                  {perfis.map(perfil => (
                    <option key={perfil.nome} value={perfil.nome}>{perfil.nome}</option>
                  ))}
                </select>
              </div>
            }
          </fieldset>

          <button type="submit">Salvar</button>
        </form>
      </div>
    </div>
  );
}

export default EditOperador;
