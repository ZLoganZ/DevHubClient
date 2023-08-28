import { Skeleton, Space } from "antd";

import { useTheme } from "@/components/ThemeProvider";

const LoadingChat = () => {
  const { getTheme } = useTheme();

  const { themeColorSet } = getTheme();

  return (
    <div className="chat flex">
      <div
        className="slider flex flex-col justify-between items-center h-screen py-3"
        style={{
          width: "5%",
          borderRight: "1px solid",
          borderColor: themeColorSet.colorBg4,
          position: "fixed",
          backgroundColor: themeColorSet.colorBg1,
        }}>
        <div className="logo">
          <Skeleton.Button active size="large" shape="circle" />
        </div>
        <div className="option">
          <Space size={30} direction="vertical">
            <Skeleton.Button active size="large" shape="circle" />
            <Skeleton.Button active size="large" shape="circle" />
            <Skeleton.Button active size="large" shape="circle" />
          </Space>
        </div>
        <div className="mode">
          <Skeleton.Button active size="large" shape="circle" />
        </div>
      </div>
      <div
        className="insteadComponent"
        style={{
          marginLeft: "5%",
          width: "23%",
          height: "100vh",
          position: "fixed",
          borderRight: "1px solid",
          borderColor: themeColorSet.colorBg4,
        }}>
        <div
          className="searchChat h-screen"
          style={{
            backgroundColor: themeColorSet.colorBg1,
          }}>
          <div
            className="flex items-center w-full px-3 py-4"
            style={{
              borderBottom: "1px solid",
              borderColor: themeColorSet.colorBg4,
              height: "12%",
            }}>
            <Skeleton avatar paragraph={{ rows: 0 }} active />
          </div>
          <div
            className="searchInput px-3 py-4 w-full flex justify-between items-center"
            style={{
              borderBottom: "1px solid",
              borderColor: themeColorSet.colorBg4,
              height: "11%",
            }}>
            <Skeleton.Button active size="large" block />
          </div>
          <div
            className="userActive px-3 py-4 w-full"
            style={{
              borderBottom: "1px solid",
              borderColor: themeColorSet.colorBg4,
              height: "20%",
            }}>
            <div className="listUser grid grid-cols-5 mt-5 ">
              <Skeleton.Button active size="large" shape="circle" />
              <Skeleton.Button active size="large" shape="circle" />
              <Skeleton.Button active size="large" shape="circle" />
              <Skeleton.Button active size="large" shape="circle" />
              <Skeleton.Button active size="large" shape="circle" />
            </div>
          </div>
          <div className="listUser px-3 py-4">
            <Skeleton className="mb-3" active avatar paragraph={{ rows: 1 }} />
            <Skeleton className="mb-3" active avatar paragraph={{ rows: 1 }} />
            <Skeleton className="mb-3" active avatar paragraph={{ rows: 1 }} />
            <Skeleton className="mb-3" active avatar paragraph={{ rows: 1 }} />
            <Skeleton className="mb-3" active avatar paragraph={{ rows: 1 }} />
          </div>
        </div>
      </div>
      <div
        className="chatBox flex flex-col items-center px-4 py-6"
        style={{
          width: "92%",
          marginLeft: "28%",
          height: "100vh",
          position: "fixed",
          backgroundColor: themeColorSet.colorBg1,
          borderRight: "1px solid",
          borderColor: themeColorSet.colorBg4,
        }}>
        <div
          style={{
            height: 500,
            width: "100%",
          }}>
          <Skeleton className="mt-8" active />
          <Skeleton className="mt-8" active />
          <Skeleton className="mt-8" active />
          <Skeleton className="mt-8" active />
        </div>
      </div>
    </div>
  );
};

export default LoadingChat;
