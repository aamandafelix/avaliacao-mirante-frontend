import React, { FormEvent, useState, ChangeEvent, useEffect } from 'react';
import { useHistory, Link } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import DatePicker, { registerLocale } from 'react-datepicker';
import ptBr from 'date-fns/locale/pt-BR';
import swal from 'sweetalert';

import api from '../../../services/api';

import "react-datepicker/dist/react-datepicker.css";
import './styles.css';

const { cpf, cnpj } = require('cpf-cnpj-validator');

registerLocale('pt-Br', ptBr);

interface TipoPessoa {
  nome: string;
}

const CreatePessoa = () => {
  const history = useHistory();
  const jwt = localStorage.getItem('jwt');
  const currentPerfil = localStorage.getItem('perfil') || '/';

  const [tiposPessoa, setTiposPessoas] = useState<TipoPessoa[]>([]);

  const [name, setName] = useState('');
  const [type, setType] = useState('');
  const [document, setDocument] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [motherName, setMotherName] = useState('');
  const [fatherName, setFatherName] = useState('');

  useEffect(() => {
    api.get('tipo-pessoa', { headers: {'Authorization' : `Bearer ${jwt}`} }).then(
      response => {
        setTiposPessoas(response.data);
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

  function handleTypeChange(event: ChangeEvent<HTMLSelectElement>) {
    const { value } = event.target;
    setType(value);
  }

  function handleDocumentChange(event: ChangeEvent<HTMLInputElement>) {
    const { value } = event.target;
    
    if (validateDocument(value)) {
      setDocument(value);
    }
  }

  function validateDocument(value: string) {
    if (type === 'Física') {
      return cpf.isValid(value);
    } else if (type === 'Jurídica') {
      return cnpj.isValid(value);
    }
  }

  function handleBirthDateChange(value: Date) {
    setBirthDate(value.toLocaleDateString('pt-Br'));
  }

  function handleMotherNameChange(event: ChangeEvent<HTMLInputElement>) {
    const { value } = event.target;
    setMotherName(value);
  }

  function handleFatherNameChange(event: ChangeEvent<HTMLInputElement>) {
    const { value } = event.target;
    setFatherName(value);
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    if (!document) {
      swal({
        text: "Número de documento inválido. Verifique os dados e tente novamente.",
        icon: "error"
      });
      return;
    }

    const data = {
      nome: name,
      documento: document,
      dataDeNascimento: birthDate,
      nomeDaMae: motherName, 
      nomeDoPai: fatherName,
      tipoPessoa: type
    };

    api.post('pessoa', data, { headers: {'Authorization' : `Bearer ${jwt}`} }).then(
      () => {
        swal({
          text: 'Pessoa cadastrada com sucesso!',
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
    <div id="page-create-person">
      <div className="content">
        <header>
          <h1>Avaliacao Mirante</h1>

          <Link to={currentPerfil}>
            <FiArrowLeft />
            Voltar
          </Link>
        </header>

        <form onSubmit={handleSubmit}>
          <h2>Cadastrar Pessoa</h2>

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
              />
            </div>

            <div className="field-group">
              <div className="field">
                <label htmlFor="login">Tipo Pessoa</label>
                <select required onChange={handleTypeChange}>
                  <option></option>
                  {tiposPessoa.map(tipo => (
                    <option key={tipo.nome} value={tipo.nome}>{tipo.nome}</option>
                  ))}
                </select>
              </div>

              <div className="field">
                <label htmlFor="document">Documento</label>
                <input
                  type="number"
                  name="document"
                  id="document"
                  max="99999999999999"
                  onChange={handleDocumentChange}
                  required
                />
              </div>
            </div>

            <div className="field">
              <label htmlFor="birthDate">Data de Nascimento</label>
              <DatePicker 
                locale="pt-Br"
                id="birthDate"
                name="birthDate"
                value={birthDate}
                onChange={handleBirthDateChange}
                placeholderText="Selecionar..."
                maxDate={new Date()}
                showMonthDropdown
                showYearDropdown
                required
              />
            </div>

            <div className="field">
              <label htmlFor="motherName">Nome da Mãe - Opcional</label>
              <input
                type="text"
                name="motherName"
                id="motherName"
                onChange={handleMotherNameChange}
                maxLength={100}
              />
            </div>

            <div className="field">
              <label htmlFor="fatherName">Nome do Pai - Opcional</label>
              <input
                type="text"
                name="fatherName"
                id="fatherName"
                onChange={handleFatherNameChange}
                maxLength={100}
              />
            </div>
          </fieldset>

          <button className="submitButton" type="submit">Cadastrar</button>
        </form>
      </div>
    </div>
  );
}

export default CreatePessoa;
