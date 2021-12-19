import { useEffect, useState } from 'react';
import { useAppDispatch } from '../../app/useAppDispatch';
import {Form, Input, Button, Checkbox, Card, Alert} from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { Link, useHistory } from 'react-router-dom';
import { addUser } from '../../services/user/slice';
import axiosInstance from '../../services/axios';
const Register = () => {
  const dispatch = useAppDispatch();
  const history = useHistory();
  const [providerGoogle, setProviderGoogle] = useState('');
  const [alert, setAlert] = useState({
    type: '',
    message: '',
  })
  const onFinish = async (values) => {
    const url = 'users/register';
    try {
      const response = await axiosInstance.post(url, {
        username: values.name,
        email: values.email,
        password: values.password,
      });
      if (response.status === 201) {
        //Useless code - because on profile will get user from Back-end
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
        history.push('/profile');
      }
    } catch (error) {
      setAlert({
        type: 'error',
        message: error.response.data.message,
      })
    }
  };

  const onFinishGoogle = async () => {
    window.location.replace(providerGoogle);
  };

  // TODO - to create a little component, will check if user is already logged in
  useEffect(async () => {
    let url = 'users/profile';
    try {
      const response = await axiosInstance.get(url);
      if (response.status === 200) {
        //Useless code - because on profile will get user from Back-end
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
        history.push('/profile');
      }
    } catch (e) {
      //DO nothing
      console.log("User not found : ", e.response.data.message);
    }

    //Getting Google Url redirect
    try {
      url = 'users/auth/google';
      const response = await axiosInstance.get(url);
      if (response.status === 200) {
        setProviderGoogle(response.data.message);
      }
    } catch (error) {
      //DO nothing
      console.error('ERROR : ', error.response);
    }

  }, []);

  return (
    <div className="loader">
      <div className="register">
        {(alert.type.length > 0) && <Alert message={alert.message} type={alert.type} showIcon />}
        <Card title="Register" bordered={false} style={{ width: '300', borderRadius: 5 }}>
          <Form
            name="form_register"
            className="login-form"
            initialValues={{ remember: true }}
            onFinish={onFinish}
            accessKey="registerForm">
            <Form.Item
              name="name"
              rules={[{ required: true, message: 'Please input your name!' }]}>
              <Input
                prefix={<UserOutlined className="site-form-item-icon" />}
                placeholder="Name"
              />
            </Form.Item>

            <Form.Item
              name="email"
              rules={[{ required: true, message: 'Please input your Email!' }]}>
              <Input
                prefix={<UserOutlined className="site-form-item-icon" />}
                placeholder="Email"
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[{ required: true, message: 'Please input your Password!' }]}>
              <Input
                prefix={<LockOutlined className="site-form-item-icon" />}
                type="password"
                placeholder="Password"
              />
            </Form.Item>
            <Form.Item>
              <Form.Item name="remember" valuePropName="checked" noStyle>
                <Checkbox>Remember me</Checkbox>
              </Form.Item>
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" className="login-form-button" style={{ borderRadius: 5 }}>
                Sign up
              </Button>
            </Form.Item>
            <Form.Item>
              Already have an account ? Try to
              <Link to="/login"> log in now!</Link>
            </Form.Item>
          </Form>

          <Form
            name="oauth_register"
            className="login-form"
            onFinish={onFinishGoogle}
            accessKey="registerProvider">
            <Form.Item>
              <Button type="danger" htmlType="submit" className="login-form-button" style={{ borderRadius: 5 }}>
                Sign up by Google
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>
    </div>
  );
};

export default Register;
