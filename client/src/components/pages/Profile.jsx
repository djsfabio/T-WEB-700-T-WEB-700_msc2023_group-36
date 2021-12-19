import React, {useEffect, useState} from 'react';
import Loader from '../utils/Loader';
import { Form, Input, Button, Checkbox, Card, Select, Alert  } from 'antd';
import { Typography } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import axiosInstance from "../../services/axios";
import {addUser} from "../../services/user/slice";
import { useAppDispatch } from '../../app/useAppDispatch';
import {useHistory} from "react-router-dom";

const { Title } = Typography;
const { Option } = Select;

const cryptos = ["BTC","ETH", "BNB"];
const children = [];
for (let i = 0; i < cryptos.length; i++) {
  children.push(<Option key={cryptos[i]}>{cryptos[i]}</Option>);
}

const articleKeywords = ["crypto","money", "crypto-currency"];
const keywords = [];
for (let i = 0; i < cryptos.length; i++) {
  keywords.push(<Option key={articleKeywords[i]}>{articleKeywords[i]}</Option>);
}

const currency = ["EUR","USD", "GBP"];
const money = [];
for (let i = 0; i < currency.length; i++) {
  money.push(<Option key={currency[i]}>{currency[i]}</Option>);
}


// TODO - example of how to use axios to make a request to the server
const Profile = () => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const [user, setUser] = useState(null);
    const [loding, setLoding] = useState(true);
    const dispatch = useAppDispatch();
    const history = useHistory();

    const onFinish = async values => {
        console.log("Submited")
        const url = 'users/' + user._id;
        console.log(user._id);
        try {
          const response = await  axiosInstance.put(url, {
            username: values.username,
          });
          if (response.status === 201) {
            dispatch(
              addUser({
                id: response.data.data._id,
                email: response.data.data.email,
                name: response.data.data.username,
                token: "No token is sent to client. Think about security",
                role: response.data.data.role,
                password: 'User password is not sent to client. Think about security',
              })
            );
            history.push('/login');
            history.push('/profile');
          }
        } catch (error) {
          console.log(error.message);
        }
    }
  
    useEffect(async () => {
        try {
            const response = await axiosInstance.get('/users/profile');
            if (response.status === 200) {
                setUser(response.data.data);
                console.log(response.data.data)
                setLoding(false);
            }
        } catch (e) {
            console.log("User not found : ", e.response);
            //TODO - redirect to login
            history.push('/login');
        }
    }, []);

  return (
      <>
          { loding && <Loader /> }
          {!loding && <div className="loader">
              <div className="profile">
                  <Card bordered={false} style={{ width: 300 }}>
                      <div className="admin-title">
                          <Title level={2} style={{ margin: 0 }}>
                              {user.username}
                          </Title>
                      </div>
                      <div className="admin-title" >
                          <Title level={5}>
                              {user.role}
                          </Title>
                      </div>
                      <div className="admin-title" style={{ marginBottom: 20 }}>
                          <Title level={5}>
                              {user.email}
                          </Title>
                      </div>

                      <div>
                          <Form
                              name="edit_profile"
                              className="login-form"
                              onFinish={onFinish}>
                                  <p>Change nickname</p>
                              <Form.Item
                                  name="username"
                                  >
                                  <Input
                                      prefix={<UserOutlined className="site-form-item-icon" />}
                                      placeholder= {user.username}                                      
                                  />
                              </Form.Item>
                              <Form.Item
                                name="currency"
                                >
                                <p>Currency</p>
                                <Select defaultValue="EUR">
                                    {money}
                                </Select>
                              </Form.Item>

                              <Form.Item
                                name="Crypto-currency"
                                >
                                <p>Crypto currency</p>
                                <Select
                                    mode="multiple"
                                    allowClear
                                    placeholder="Please select"
                                    defaultValue={['BTC', 'ETH']}
                                >
                                    {children}
                                </Select>
                              </Form.Item>

                              <Form.Item
                                name="Crypto-currency"
                                >
                                <p>Article Keywords</p>
                                <Select
                                    mode="multiple"
                                    allowClear
                                    placeholder="Select articles kewords"
                                    defaultValue={['crypto', 'money']}
                                >
                                    {keywords}
                                </Select>
                              </Form.Item>
                              <div style={{ display : 'flex' , justifyContent : 'center'}}>
                                <Form.Item >
                                    <Button type="primary" htmlType="submit" className="login-form-button" >
                                        Edit
                                    </Button>
                                </Form.Item>
                              </div> 
                          </Form>
                      </div>
                  </Card>
              </div>
            </div>}
      </>
  );
};

export default Profile;
