import React, { FormEvent, useState, ChangeEvent, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import swal from 'sweetalert';

import api from '../../../services/api';

import './styles.css';

interface Props {
  location: { state: { id: number, nome: string } };
}

interface TipoTelefone {
  nome: string;
}

const CreateTelefone = (props: Props) => {
  const history = useHistory();
  const jwt = localStorage.getItem('jwt');

  if (jwt === null) {
    swal({
      text: 'Não foi possível carregar os dados necessários para essa ação. Verifique sua conexão e tente novamente!',
      icon: 'error'
    });
    history.push('/');
  }

  if (!props.location.state) {
    history.goBack();
  }

  const [phonesTypes, setPhonesTypes] = useState<TipoTelefone[]>([]);

  const [type, setType] = useState('');
  const [ddd, setDdd] = useState('');
  const [number, setNumber] = useState('');

  useEffect(() => {
    api.get('tipo-telefone', { headers: { 'Authorization': `Bearer ${jwt}` } }).then(
      response => {
        setPhonesTypes(response.data);
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

  function handleTypeChange(event: ChangeEvent<HTMLSelectElement>) {
    const { value } = event.target;
    setType(value);
  }

  function handleDDDChange(event: ChangeEvent<HTMLInputElement>) {
    const { value } = event.target;
    setDdd(value);
  }

  function handleNumberChange(event: ChangeEvent<HTMLInputElement>) {
    const { value } = event.target;
    setNumber(value);
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    if (props.location.state.id) {

      const data = {
        ddd: ddd,
        numero: number,
        tipo: type,
        pessoaId: props.location.state.id,
      };

      api.post('telefone', data, { headers: { 'Authorization': `Bearer ${jwt}` } }).then(
        () => {
          swal({
            text: 'Telefone cadastrado com sucesso!',
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
  }

  return (
    <div id="page-create-telefone">
      <div className="content">
        <header>
          <h1>Avaliacao Mirante</h1>

          <a onClick={history.goBack}>
            <FiArrowLeft />
            Voltar
          </a>
        </header>

        <form onSubmit={handleSubmit}>
        <h2>Cadastrar Telefone para {props.location.state.nome}</h2>

          <fieldset>
            <div className="field">
              <label htmlFor="login">Tipo Telefone</label>
              <select title="Selecione uma opção" required onChange={handleTypeChange}>
                <option></option>
                {phonesTypes.map(type => (
                  <option key={type.nome} value={type.nome}>{type.nome}</option>
                ))}
              </select>
            </div>

            <div className="field">
              <label htmlFor="ddd">DDD</label>
              <input
                type="number"
                name="ddd"
                id="ddd"
                title="Apenas números"
                required
                min="0"
                max="999"
                defaultValue={ddd}
                onChange={handleDDDChange}
              />
            </div>

            <div className="field">
              <label htmlFor="number">Número</label>
              <input
                type="number"
                name="number"
                id="number"
                title="Apenas números"
                min="00000000"
                max="9999999999"
                required
                defaultValue={number}
                onChange={handleNumberChange}
              />
            </div>
          </fieldset>

          <button type="submit">Salvar</button>
        </form>
      </div>
    </div>
  );
}

export default CreateTelefone;
