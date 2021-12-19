import React from 'react';
import { Typography } from 'antd';
import { Link } from 'react-router-dom';

import { useAppDispatch } from '../../app/useAppDispatch';
import { useEffect } from 'react';
import { useGetCryptosQuery } from '../../services/cryptoApi';
import Cryptocurrencies from './Cryptocurrencies';
import News from './News';
import Loader from '../utils/Loader';

import { getUser } from '../../services/user/selector';
import { useSelector } from 'react-redux';
import { addUser } from '../../services/user/slice';

const { Title } = Typography;

const Homepage = () => {
  const { isFetching } = useGetCryptosQuery(10);

  const userInfo = useSelector(getUser);
  const dispatch = useAppDispatch();

  /*useEffect(() => {
    dispatch(
      addUser({
        id: '1',
        email: 'test',
        name: 'test',
        password: 'test',
        token: 'test',
        role: 'user',
      })
    );
  }, [dispatch]);*/

  if (isFetching) return <Loader />;

  return (
    <>
      <div className="home-heading-container">
        <Title level={2} className="home-title">
          Top 10 Cryptos In The World
        </Title>
        <Title level={3} className="show-more">
          <Link to="/cryptocurrencies">Show more</Link>
        </Title>
      </div>
      <Cryptocurrencies simplified />
      <div className="home-heading-container">
        <Title level={2} className="home-title">
          Latest Crypto News
        </Title>
        <Title level={3}>
          <Link to="/news">Show more</Link>
        </Title>
      </div>
      <News simplified />
    </>
  );
};

export default Homepage;
