import React, { useState, useEffect } from 'react';
import { Button, Menu, Typography, Avatar } from 'antd';
import { Link } from 'react-router-dom';
import {
  HomeOutlined,
  BulbOutlined,
  FundOutlined,
  MenuOutlined,
  UserOutlined,
  LockOutlined,
  LogoutOutlined,
} from '@ant-design/icons';

import logo from '../../images/logo.png';
// import icon from '../../images/logo2.png';
import { getUser } from '../../services/user/selector';
import { useSelector } from 'react-redux';

const Navbar = () => {
  const [activeMenu, setActiveMenu] = useState(true);
  const [screenSize, setScreenSize] = useState(undefined);
  const userInfo = useSelector(getUser);

  useEffect(() => {
    const handleResize = () => setScreenSize(window.innerWidth);
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (screenSize <= 800) {
      setActiveMenu(false);
    } else {
      setActiveMenu(true);
    }
  }, [screenSize]);

  return (
    <div className="nav-container">
      <div className="logo-container">
        <Link to="/">
          <img src={logo} alt="logo" height="40"/>
        </Link>
        <Button
          className="menu-control-container"
          onClick={() => setActiveMenu(!activeMenu)}>
          <MenuOutlined />
        </Button>
      </div>
      {activeMenu && (
        <Menu theme="dark">
          {userInfo.name === 'admin' && (
            <Menu.Item icon={<LockOutlined />}>
              <Link to="/admin">Admin</Link>
            </Menu.Item>
          )}
          {userInfo.id && (
            <Menu.Item icon={<UserOutlined />}>
              <Link to="/profile">Profile</Link>
            </Menu.Item>
          )}
          <Menu.Item icon={<HomeOutlined />}>
            <Link to="/">Home</Link>
          </Menu.Item>
          <Menu.Item icon={<FundOutlined />}>
            <Link to="/cryptocurrencies">Cryptocurrencies</Link>
          </Menu.Item>
          <Menu.Item icon={<BulbOutlined />}>
            <Link to="/news">News</Link>
          </Menu.Item>
          {!userInfo.id && (
            <Menu.Item icon={<UserOutlined />}>
              <Link to="/login">Log in / Sign Up</Link>
            </Menu.Item>
          )}
          {userInfo.id && (
            <Menu.Item icon={<LogoutOutlined />}>
              <Link to="/logout">Log out</Link>
            </Menu.Item>
          )}
        </Menu>
      )}
    </div>
  );
};

export default Navbar;
