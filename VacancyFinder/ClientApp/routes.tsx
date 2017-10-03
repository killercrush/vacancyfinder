import * as React from 'react';
import { Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import Home from './components/Home';
import FetchVacancies from './components/FetchVacancies';

export const routes = <Layout>
    <Route exact path='/' component={ Home } />
    <Route path='/fetchvacancies/:startPage?' component={FetchVacancies} />
</Layout>;
