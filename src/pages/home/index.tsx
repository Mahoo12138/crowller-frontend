import { Button, Row, Col, message } from "antd";
import { Component } from "react";
import moment from "moment";
import { Navigate } from "react-router-dom";
import ReactECharts from "echarts-for-react";
import http from "../../common/request";
import "./style.css";

interface CourseItem {
  title: string;
  count: number;
}

interface State {
  inited: boolean;
  isLogin: boolean;
  data: {
    [key: string]: CourseItem[];
  };
}

class Home extends Component {
  state: State = {
    inited: false,
    isLogin: true,
    data: {},
  };
  componentDidMount() {
    http.get("/api/islogin").then(({ data }) => {
      if (!data.data) {
        // 没有登录
        this.setState({ isLogin: false });
      } else {
        this.setState({ inited: true });
      }
    });
    http.get("/api/show").then(({ data }) => {
      this.setState({
        data,
      });
    });
  }

  handleCrowller = () => {
    http.get("/api/data").then(({ data }) => {
      if (data.data) {
        message.success("爬取成功");
      }
    });
  };

  getOption() {
    const { data } = this.state;
    const courseNames: string[] = [];
    const times: string[] = [];
    const tempData: {
      [key: string]: number[];
    } = {};
    for (let i in data) {
      const item = data[i];
      times.push(moment(Number(i)).format("MM-DD HH:mm"));
      item.forEach((innerItem) => {
        const { title, count } = innerItem;
        if (courseNames.indexOf(title) === -1) {
          courseNames.push(title);
        }
        tempData[title]
          ? tempData[title].push(count)
          : (tempData[title] = [count]);
      });
    }
    const seriesData = [];
    for (let i in tempData) {
      seriesData.push({
        name: i,
        type: "line",
        data: tempData[i],
      });
    }
    return {
      title: {
        text: "学习人数",
      },
      tooltip: {
        trigger: "axis",
      },
      legend: {
        data: courseNames,
      },
      grid: {
        left: "3%",
        right: "4%",
        bottom: "3%",
        containLabel: true,
      },
      xAxis: {
        type: "category",
        boundaryGap: false,
        data: times,
      },
      yAxis: {
        type: "value",
      },
      series: seriesData,
    };
  }

  handleLogout = () => {
    http.get("/api/logout").then(({ data }) => {
      console.log(data);
      if (data.data) {
        this.setState({ isLogin: false });
      } else {
        message.error("退出失败");
      }
    });
  };

  render() {
    const { isLogin, inited } = this.state;
    if (isLogin) {
      if (inited) {
        return (
          <div className="home-page">
            <div className="button-list">
              <Row>
                <Col span={8}>
                  <Button
                    type="primary"
                    size="middle"
                    onClick={this.handleCrowller}
                  >
                    爬取
                  </Button>
                </Col>
                <Col span={8}>
                  <Button type="primary" size="middle">
                    展示
                  </Button>
                </Col>
                <Col span={8}>
                  <Button
                    type="primary"
                    size="middle"
                    onClick={this.handleLogout}
                  >
                    退出
                  </Button>
                </Col>
              </Row>
            </div>
            <ReactECharts option={this.getOption()} />
          </div>
        );
      } else {
        return null;
      }
    } else {
      return <Navigate to="/login" />;
    }
  }
}

export default Home;
