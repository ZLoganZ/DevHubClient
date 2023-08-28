import { Col, Row, Skeleton, Space } from 'antd';

const LoadingNewsFeed = () => {
  return (
    <div className="loadingNewFeed">
      <Row>
      <Col offset={3} span={18}>
          <div className="new-feed flex justify-between mt-10">
            <div className="new-feed-left w-8/12">
              <div className="">
                <Skeleton className="pt-4" active paragraph={{ rows: 5 }} />
              </div>
              <Space className="mt-10" size={30}>
                <Skeleton.Button active />
                <Skeleton.Button active />
                <Skeleton.Button active />
                <Skeleton.Button active />
                <Skeleton.Button active />
              </Space>
              <div className="post mt-10">
                <Skeleton active avatar paragraph={{ rows: 5 }} />
                <Skeleton active avatar paragraph={{ rows: 5 }} />
                <Skeleton active avatar paragraph={{ rows: 5 }} />
                <Skeleton active avatar paragraph={{ rows: 5 }} />
              </div>
            </div>
            <div className="new-feed-right w-4/12 pl-3">
              <Skeleton active avatar paragraph={{ rows: 3 }} />
              <Skeleton active avatar paragraph={{ rows: 3 }} />
              <Skeleton active avatar paragraph={{ rows: 3 }} />
              <Skeleton active avatar paragraph={{ rows: 3 }} />
              <Skeleton active avatar paragraph={{ rows: 3 }} />
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default LoadingNewsFeed;
