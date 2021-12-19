import React from 'react';
import { Switch, Route, Link } from 'react-router-dom';
import { Layout, Typography, Space } from 'antd';

import {
  Profile,
  Admin,
  Homepage,
  News,
  Login,
  Cryptocurrencies,
  CryptoDetails,
  Navbar,
  Register,
  Logout,
} from './components';

import './App.css';

const App = () => (
  <div className="app">
    <div className="navbar">
      <Navbar />
    </div>
    <div className="main">
      <Layout>
        <div className="routes">
          <Switch>
            <Route exact path="/">
              <Homepage />
            </Route>
            <Route exact path="/profile">
              <Profile />
            </Route>
            <Route exact path="/admin">
              <Admin />
            </Route>
            <Route exact path="/cryptocurrencies">
              <Cryptocurrencies />
            </Route>
            <Route exact path="/crypto/:coinId">
              <CryptoDetails />
            </Route>
            <Route exact path="/news">
              <News />
            </Route>
            <Route exact path="/login">
              <Login />
            </Route>
            <Route exact path="/register">
              <Register />
            </Route>
            <Route exact path="/logout">
              <Logout />
            </Route>
          </Switch>
        </div>
      </Layout>
      <div className="footer">
        <Typography.Title level={5} style={{ color: 'white', textAlign: 'center' }}>
          Copyright © 2021
          <Link to="/"> The Count of Money</Link> <br />
          All Rights Reserved.
        </Typography.Title>
      </div>
    </div>
  </div>
);

export default App;
