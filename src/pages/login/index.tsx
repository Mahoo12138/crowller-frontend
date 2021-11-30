import { Form, Input, Button, message } from "antd";
import qs from "qs";
import { LockOutlined } from "@ant-design/icons";
import "./style.css";
import axios from "axios";
import { Component } from "react";
import { Navigate } from "react-router-dom";

class Login extends Component {
  state = {
    isLogin: false,
  };

  onFinish = (values: { password: string }) => {
    axios
      .post(
        "/api/login",
        qs.stringify({
          password: values.password,
        }),
        {
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
        }
      )
      .then(({ data }) => {
        console.log(data);
        if (data.data) {
          this.setState({
            isLogin: true,
          });
          message.success("登录成功", 1);
        } else {
          message.error("密码错误");
        }
      });
  };

  render() {
    const { isLogin } = this.state;
    return isLogin ? (
      <Navigate to="/" />
    ) : (
      <div className="login-page">
        <Form
          initialValues={{
            remember: true,
          }}
          onFinish={this.onFinish}
        >
          <Form.Item
            name="password"
            rules={[
              {
                required: true,
                message: "请输入密码！",
              },
            ]}
          >
            <Input
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              placeholder="Password"
            />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              登录
            </Button>
          </Form.Item>
        </Form>
      </div>
    );
  }
}

export default Login;
