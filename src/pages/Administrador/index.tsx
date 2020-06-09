import React, { useState, useEffect } from 'react';
import { FiPower, FiEdit, FiTrash2 } from 'react-icons/fi';
import { useHistory } from 'react-router-dom';
import swal from 'sweetalert';

import api from '../../services/api';

import './styles.css';

interface Operador {
  id: number;
  nome: string;
  perfil: string[];
}

const Administrador = () => {
  const history = useHistory();
  const jwt = localStorage.getItem('jwt');

  if (jwt === null) {
    swal({
      text: 'Não foi possível carregar os dados necessários para essa ação. Verifique sua conexão e tente novamente!',
      icon: 'error'
    });
    history.push('/');
  }

  const [operadores, setOperadores] = useState<Operador[]>([]);

  useEffect(() => {
    api.get('operador', { headers: {'Authorization' : `Bearer ${jwt}`} }).then(
      response => {
        setOperadores(response.data);
      },
      () => {
        swal({
          text: 'Não foi possível carregar os dados necessários para essa ação. Verifique sua conexão e tente novamente!',
          icon: 'error'
        });
        handleLogout();
      }
    );
  }, [jwt, handleLogout]);

  function navigateToEditOperador(operadorId: number) {
    history.push('/editar-operador', { id: operadorId });
  }

  function handleDeleteOperador(operadorId: number) {
    api.delete(`operador/${operadorId}`, { headers: {'Authorization' : `Bearer ${jwt}`} }).then(
      () => {
        const operadoresFiltered = operadores.filter(operador => operador.id !== operadorId);
        setOperadores(operadoresFiltered);
      },
      () => {
        swal({
          text: 'Não foi possível completar essa ação.',
          icon: 'error'
        });
      }
    );
  }

  function handleNavigateToCreateOperador() {
    history.push('/cadastrar-operador')
  }

  function handleLogout() {
    localStorage.clear();
    history.push('/');
  }

  return (
    <div id="page-admin">
      <div className="content">
        <header>
          <h1>Bem vindo, Administrador!</h1>

          <button title="Logout" onClick={handleLogout} type="button">
            <FiPower size={18} color="#E02041" />
          </button>
        </header>
       
        <div className="createButton">
          <h2>Operadores</h2>
          <button type="submit" onClick={handleNavigateToCreateOperador}>Cadastrar novo Operador</button>
        </div>

        <ul>
          {operadores.map(operador => (
            <li
              key={operador.id}
              onClick={() => {}}
            >
              <span>{operador.nome}</span>

              <div className="buttons">
                <button
                  title="Editar Operador"
                  className="edit-button"
                  onClick={() => navigateToEditOperador(operador.id)}
                  type="button"
                >
                  <FiEdit size={20} color="#41414D" />
                </button>

                {operador.perfil[0] !== 'Administrador' 
                && <button
                    title="Excluir Operador"
                    className="delete-button"
                    onClick={() => handleDeleteOperador(operador.id)}
                    type="button"
                  >
                  <FiTrash2 size={20} color="#E02041" />
                </button>}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Administrador;
