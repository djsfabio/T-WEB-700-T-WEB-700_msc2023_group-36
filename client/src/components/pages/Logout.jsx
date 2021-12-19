import React from 'react';
import { useEffect } from 'react';
import { useHistory } from 'react-router-dom';

import { addUser } from '../../services/user/slice';
import Loader from '../utils/Loader';
import { useAppDispatch } from '../../app/useAppDispatch';
import { getUser } from '../../services/user/selector';
import { useSelector } from 'react-redux';
import { Form, Input, Button, Checkbox, Card } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import axiosInstance from '../../services/axios';

const Login = () => {
  const history = useHistory();
  const dispatch = useAppDispatch();
  useEffect(async () => {
      const url = 'users/logout';
      try {
          const response = await axiosInstance.post(url);
          if (response.status === 201) {
              dispatch(
                  addUser({
                      id: undefined,
                      email: undefined,
                      name: undefined,
                      password: undefined,
                      token: undefined,
                      role: undefined,
                  })
              );
          }
      } catch (error) {
          //Do nothing
      }
      history.push('/');
  }, [dispatch, history]);

  return <div className="loader"></div>;
};

export default Login;
