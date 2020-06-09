import React, { useEffect, useState } from 'react';
import { FiArrowLeft, FiTrash2 } from 'react-icons/fi';
import { useHistory } from 'react-router-dom';
import swal from 'sweetalert';

import api from '../../../services/api';

import './styles.css';

const { cpf, cnpj } = require('cpf-cnpj-validator');

interface Props {
  location: { state: { id: number} };
}

interface Phone {
  id: number;
  ddd: string;
  numero: string;
  tipo: { nome: string };
}

const DetailPessoa = (props: Props) => {
  const history = useHistory();
  const jwt = localStorage.getItem('jwt');

  if (!props.location.state) {
    history.goBack();
  }

  const [phones, setPhones] = useState<Phone[]>([]);

  const [name, setName] = useState('');
  const [type, setType] = useState('');
  const [document, setDocument] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [motherName, setMotherName] = useState('');
  const [fatherName, setFatherName] = useState('');

  useEffect(() => {
    if (props.location.state.id) {
      api.get(`pessoa/${props.location.state.id}`, { headers: {'Authorization' : `Bearer ${jwt}`} }).then(
        response => {
          setPhones(response.data.telefones);
          setName(response.data.nome);
          setType(response.data.tipo.nome);
          setDocument(validateDocument(response.data.documento, response.data.tipo.nome));
          setBirthDate(response.data.dataDeNascimento);
          setMotherName(response.data.nomeDaMae);
          setFatherName(response.data.nomeDoPai);
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

  function validateDocument(value: string, type: string) {
    if (type === 'Física') {
      return cpf.format(value);
    } else if (type === 'Jurídica') {
      return cnpj.format(value);
    }
  }

  function handleDeletePhone(phoneId: number) {
    api.delete(`telefone/${phoneId}`, { headers: {'Authorization' : `Bearer ${jwt}`} }).then(
      () => {
        const phonesFiltered = phones.filter(phone => phone.id !== phoneId);
        setPhones(phonesFiltered);
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
    <div id="page-detail-person">
      <div className="content">
        <header>
          <h1>Avaliacao Mirante</h1>

          <a onClick={history.goBack}>
            <FiArrowLeft />
            Voltar
          </a>
        </header>

        <form onSubmit={() => {}}>
          <h2>{name}</h2>

          <fieldset>
            <div className="field-group">
              <div className="field">
                <label htmlFor="type">Tipo Pessoa:</label>
                <input
                  type="text"
                  name="type"
                  id="type"
                  defaultValue={type}
                  readOnly
                />
              </div>

              <div className="field">
                <label htmlFor="document">Documento:</label>
                <input
                  type="text"
                  name="document"
                  id="document"
                  defaultValue={document}
                  readOnly
                />
              </div>
            </div>

            <div className="field">
              <label htmlFor="birthDate">Data de Nascimento:</label>
              <input
                type="text"
                name="birthDate"
                id="birthDate"
                defaultValue={birthDate}
                readOnly
              />
            </div>

            <div className="field">
              <label htmlFor="motherName">Nome da Mãe:</label>
              <input
                type="text"
                name="motherName"
                id="motherName"
                defaultValue={motherName}
                readOnly
              />
            </div>

            <div className="field">
              <label htmlFor="fatherName">Nome do Pai:</label>
              <input
                type="text"
                name="fatherName"
                id="fatherName"
                defaultValue={fatherName}
                readOnly
              />
            </div>

            {phones[0] && (
              <h3>Telefones:</h3>
            )}
            <ul>
              {phones.map(phone => (
                <li key={phone.id}>
                  <span>{'(' + phone.ddd + ') ' + phone.numero}</span>

                  {localStorage.getItem('perfil') === 'Gerente' &&
                  <div className="buttons">
                    <button className="delete-button" onClick={() => handleDeletePhone(phone.id)} type="button">
                      <FiTrash2 title={'Excluir Telefone'} size={20} color="#E02041" />
                    </button>
                  </div>
                  }
                </li>
              ))}
            </ul>
          </fieldset>
        </form>
      </div>
    </div>
  );
};

export default DetailPessoa;