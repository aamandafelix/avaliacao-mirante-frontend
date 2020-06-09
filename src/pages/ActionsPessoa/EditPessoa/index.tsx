import React, { FormEvent, useState, ChangeEvent, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import swal from 'sweetalert';
import DatePicker, { registerLocale } from 'react-datepicker';
import ptBr from 'date-fns/locale/pt-BR';

import api from '../../../services/api';

import './styles.css';

registerLocale('pt-Br', ptBr);

interface Props {
  location: { state: { id: number} };
}

const EditPessoa = (props: Props) => {
  const history = useHistory();
  const jwt = localStorage.getItem('jwt');

  if (!props.location.state) {
    history.goBack();
  }

  const [name, setName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [motherName, setMotherName] = useState('');
  const [fatherName, setFatherName] = useState('');

  useEffect(() => {
    if (props.location.state.id) {
      api.get(`pessoa/${props.location.state.id}`, { headers: {'Authorization' : `Bearer ${jwt}`} }).then(
        response => {
          setName(response.data.nome);
          setBirthDate(response.data.dataDeNascimento);
          setMotherName(response.data.nomeDaMae);
          setFatherName(response.data.nomeDoPai);
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
  }, [jwt, history, props.location.state.id]);

  function handleNameChange(event: ChangeEvent<HTMLInputElement>) {
    const { value } = event.target;
    setName(value);
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

    const data = {
      id: props.location.state.id,
      nome: name,
      dataDeNascimento: birthDate,
      nomeDaMae: motherName, 
      nomeDoPai: fatherName
    };

    api.put('pessoa', data, { headers: {'Authorization' : `Bearer ${jwt}`} }).then(
      () => {
        swal({
          text: 'Pessoa atualizada com sucesso!',
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
    <div id="page-edit-person">
      <div className="content">
        <header>
          <h1>Avaliacao Mirante</h1>

          <a onClick={history.goBack}>
            <FiArrowLeft />
            Voltar
          </a>
        </header>

        <form onSubmit={handleSubmit}>
          <h2>Editar Pessoa</h2>
          <fieldset>
            <div className="field">
              <label htmlFor="name">Nome</label>
              <input
                type="text"
                name="name"
                id="name"
                defaultValue={name}
                onChange={handleNameChange}
              />
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
                defaultValue={motherName}
                onChange={handleMotherNameChange}
              />
            </div>

            <div className="field">
              <label htmlFor="fatherName">Nome do Pai - Opcional</label>
              <input
                type="text"
                name="fatherName"
                id="fatherName"
                defaultValue={fatherName}
                onChange={handleFatherNameChange}
              />
            </div>
          </fieldset>

          <button className="submitButton" type="submit">Salvar</button>
        </form>
      </div>
    </div>
  );
}

export default EditPessoa;
