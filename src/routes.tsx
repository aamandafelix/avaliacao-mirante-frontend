import React from 'react';
import { Route, BrowserRouter } from 'react-router-dom';

import Login from './pages/Login';
import Administrador from './pages/Administrador';
import Gerente from './pages/Gerente';
import Analista from './pages/Analista';

import CreateOperador from './pages/ActionsOperador/CreateOperador';
import EditOperador from './pages/ActionsOperador/EditOperador';

import CreatePessoa from './pages/ActionsPessoa/CreatePessoa';
import EditPessoa from './pages/ActionsPessoa/EditPessoa';
import DetailPessoa from './pages/ActionsPessoa/DetailPessoa';
import CreateTelefone from './pages/ActionsPessoa/CreateTelefone';


const Routes = () => {
  return (
    <BrowserRouter>
      <Route component={Login} path='/' exact />
      <Route component={Administrador} path='/administrador' />
      <Route component={Gerente} path='/gerente' />
      <Route component={Analista} path='/analista' />
      <Route component={CreateOperador} path='/cadastrar-operador' />
      <Route component={EditOperador} path='/editar-operador' />
      <Route component={CreatePessoa} path='/cadastrar-pessoa' />
      <Route component={EditPessoa} path='/editar-pessoa' />
      <Route component={DetailPessoa} path='/visualizar-pessoa' />
      <Route component={CreateTelefone} path='/cadastrar-telefone' />
    </BrowserRouter>
  );
}

export default Routes;