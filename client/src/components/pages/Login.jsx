import {useState} from 'react';
import { useEffect } from 'react';
import Loader from '../utils/Loader';
import { useAppDispatch } from '../../app/useAppDispatch';
import { getUser } from '../../services/user/selector';
import { useSelector } from 'react-redux';
import {Form, Input, Button, Checkbox, Card, Alert} from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import axiosInstance from '../../services/axios';
import { addUser } from '../../services/user/slice';
import { useHistory } from 'react-router-dom';

const Login = () => {
  const userInfo = useSelector(getUser);
  const dispatch = useAppDispatch();
  const history = useHistory();
  const [alert, setAlert] = useState({
    type: '',
    message: '',
  });
  const onFinish = async values => {
    const url = 'users/login';
    try {
      const response = await  axiosInstance.post(url, {
        email: values.username,
        password: values.password,
      });
      if (response.status === 200) {
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
      });
    }
  };

  useEffect(async () => {
    const url = 'users/profile';
    try {
      const response = await  axiosInstance.get(url);
      console.log(response)
      if (response.status === 200) {
          //TODO - to delete, user in Redux
          // User is logged in
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
        console.log("USER : ", e)
    }
  }, []);

  return (
    <div className="loader">
      <div className="login">
          {(alert.type.length > 0) && <Alert message={alert.message} type={alert.type} showIcon />}
          <Card title="Login" bordered={false} style={{ width: 300, borderRadius: 5 }}>
              <Form
                  name="normal_login"
                  className="login-form"
                  initialValues={{ remember: true }}
                  onFinish={onFinish}>
                  <Form.Item
                      name="username"
                      rules={[{ required: true, message: 'Please input your Username!' }]}>
                      <Input
                          prefix={<UserOutlined className="site-form-item-icon" />}
                          placeholder="Username"
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
                          Log in
                      </Button>
                  </Form.Item>
                  <Form.Item>
                      Dont have an account ? Try to
                      <Link to="/register"> register now!</Link>
                  </Form.Item>
              </Form>
          </Card>
      </div>
    </div>
  );
};

export default Login;
