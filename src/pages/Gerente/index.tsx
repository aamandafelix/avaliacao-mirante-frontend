import React, { useState, useEffect } from 'react';
import { FiEdit, FiTrash2, FiArrowRightCircle, FiPhone } from 'react-icons/fi';
import { useHistory } from 'react-router-dom';
import swal from 'sweetalert';

import api from '../../services/api';

import './styles.css';

import Header from '../../components/Header';
import Footer from '../../components/Footer';

interface Pessoa {
  id: number;
  nome: string;
}

const Gerente = () => {
  const history = useHistory();
  const jwt = localStorage.getItem('jwt');
  
  if (jwt === null) {
    swal({
      text: 'Não foi possível carregar os dados necessários para essa ação. Verifique sua conexão e tente novamente!',
      icon: 'error'
    });
    history.push('/');
  }

  const [pessoas, setPessoas] = useState<Pessoa[]>([]);

  useEffect(() => {
    api.get('pessoa', { headers: { 'Authorization': `Bearer ${jwt}` } }).then(
      response => {
        setPessoas(response.data);
      },
      () => {
        swal({
          text: 'Não foi possível carregar os dados necessários para essa ação. Verifique sua conexão e tente novamente!',
          icon: 'error'
        });
        handleLogout();
      }
    );
  }, []);

  function handleLogout() {
    localStorage.clear();
    history.push('/');
  }

  function handleNavigateToCreatePerson() {
    history.push('/cadastrar-pessoa')
  }

  function handleNavigateToCreateTelefone(pessoaId: number, pessoaNome: string) {
    history.push('/cadastrar-telefone', { id: pessoaId, nome: pessoaNome });
  }

  function handleNavigateToDetailPessoa(pessoaId: number) {
    history.push('/visualizar-pessoa', { id: pessoaId });
  }

  function navigateToEditPessoa(operadorId: number) {
    history.push('/editar-pessoa', { id: operadorId });
  }

  function handleDeletePessoa(pessoaId: number) {
    api.delete(`pessoa/${pessoaId}`, { headers: {'Authorization' : `Bearer ${jwt}`} }).then(
      () => {
        const pessoasFiltered = pessoas.filter(pessoa => pessoa.id !== pessoaId);
        setPessoas(pessoasFiltered);
      },
      () => {
        swal({
          text: 'Não foi possível completar essa ação.',
          icon: 'error'
        });
      }
    );
  }

  return (
    <div id="page-gerente">
      <div className="content">
        <Header title={'Bem vindo, Gerente!'}/>

        <main>
          <div className="createButton">
            <h2>Pessoas</h2>
            <button type="submit" onClick={handleNavigateToCreatePerson}>Cadastrar nova Pessoa</button>
          </div>

          <ul>
            {!pessoas[0] && (
              <h3>Ainda não há pessoas cadastradas!</h3>
            )}
            {pessoas.map(pessoa => (
              <li key={pessoa.id}>
                <span>{pessoa.nome}</span>

                <div className="buttons">
                  <button 
                    title="Cadastrar Telefone"
                    className="enter-button"
                    onClick={() => handleNavigateToCreateTelefone(pessoa.id, pessoa.nome)}
                    type="button"
                  >
                    <FiPhone size={20} color="#322153" />
                  </button>

                  <button 
                    title="Visualizar Pessoa"
                    className="enter-button"
                    onClick={() => handleNavigateToDetailPessoa(pessoa.id)}
                    type="button"
                  >
                    <FiArrowRightCircle size={20} color="#34CB79" />
                  </button>

                  <button
                    title="Editar Pessoa"
                    className="edit-button"
                    onClick={() => navigateToEditPessoa(pessoa.id)}
                    type="button"
                  >
                    <FiEdit size={20} color="#41414D" />
                  </button>

                  <button
                    title="Excluir Pessoa"
                    className="delete-button"
                    onClick={() => handleDeletePessoa(pessoa.id)}
                    type="button"
                  >
                    <FiTrash2 size={20} color="#E02041" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </main>
      </div>

      <Footer />
    </div>
  );
}

export default Gerente;
