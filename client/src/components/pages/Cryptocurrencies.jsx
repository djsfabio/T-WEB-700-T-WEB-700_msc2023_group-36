import React, { useEffect, useState } from 'react';
import millify from 'millify';
import { Link } from 'react-router-dom';
import { Card, Row, Col, Input } from 'antd';

import { useGetCryptosQuery } from '../../services/cryptoApi';
import Loader from '../utils/Loader';
import axiosInstance from "../../services/axios";

const Cryptocurrencies = ({ simplified }) => {
  const count = simplified ? 10 : 100;
  const { data: cryptosList, isFetching } = useGetCryptosQuery(count);
  const [cryptos, setCryptos] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    setCryptos(cryptosList?.data?.coins);
  
    const filteredData = cryptosList?.data?.coins.filter(item =>
      item.name.toLowerCase().includes(searchTerm)
    );
  
    setCryptos(filteredData);
  }, [cryptosList, searchTerm]);

  // useEffect(async () => {
  //   try {
  //     const response= await axiosInstance.get('/cryptos');
  //     console.log(response);
  //     setCryptos(response.data.data);
  //   } catch (error) {
  //     //DO nothing
  //     console.error("CRYPTO ERROR", error);
  //   }
  // }, [cryptosList]);

  if (isFetching) return <Loader />;

  return (
    <>
      {!simplified && (
        <div className="search-crypto">
          <Input
            placeholder="Search Cryptocurrency"
            onChange={e => setSearchTerm(e.target.value.toLowerCase())}
          style={{ borderRadius: 50, boxShadow: '1px 1px 10px rgba(0, 0, 0, 0.1)' }}
          />
        </div>
      )}
      <Row gutter={[32, 32]} className="crypto-card-container">
        {cryptos && cryptos.length > 0 && cryptos?.map(currency => (
          <Col xs={24} sm={12} lg={6} className="crypto-card" key={currency.id}>
            <Link key={currency.id} to={`/crypto/${currency.id}`}>
              <Card
                title={`${currency.rank}. ${currency.name}`}
                extra={
                  <img className="crypto-image" src={currency.iconUrl} alt="" />
                }
                hoverable>
                <p>Price: {millify(currency.price)}</p>
                <p>Market Cap: {millify(currency.marketCap)}</p>
                <p>Daily Change: {currency.change}%</p>
              </Card>
            </Link>
          </Col>
        ))}
      </Row>
    </>
  );
};

export default Cryptocurrencies;
