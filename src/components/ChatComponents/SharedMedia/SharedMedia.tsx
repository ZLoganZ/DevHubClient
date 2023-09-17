import { useEffect, useMemo, useState } from 'react';
import {
  BellOutlined,
  ExclamationCircleOutlined,
  LogoutOutlined,
  SettingOutlined
} from '@ant-design/icons';
import { faDownload } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { format, isThisWeek, isThisYear, isToday } from 'date-fns';
import { useSelector } from 'react-redux';
import { Image, Space, Empty, Skeleton } from 'antd';

import StyleTotal from './cssSharedMedia';
import { useCurrentConversationData } from '@/hooks';
import { getTheme } from '@/util/functions/ThemeFunction';
import { pusherClient } from '@/util/functions/Pusher';
import { RootState } from '@/redux/configStore';

interface SharedMediaProps {
  conversationId: any;
}

const SharedMedia = (Props: SharedMediaProps) => {
  const { change } = useSelector((state: RootState) => state.themeReducer);
  const { themeColorSet } = getTheme();

  const { isLoadingConversation, currentConversation } =
    useCurrentConversationData(Props.conversationId);

  const userInfo = useSelector(
    (state: RootState) => state.userReducer.userInfo
  );

  const pusherKey = useMemo(() => {
    return userInfo?.id;
  }, [userInfo]);

  const [items, setItems] = useState<any>([]);

  useEffect(() => {
    if (isLoadingConversation) return;

    setItems(currentConversation.image);
  }, [isLoadingConversation, currentConversation]);

  useEffect(() => {
    if (isLoadingConversation) return;

    pusherClient.subscribe(pusherKey);

    const updateHandler = (conversation: any) => {
      setItems((current: any) => {
        return [...current, conversation.image];
      });
    };

    pusherClient.bind('conversation-update-media', updateHandler);
  }, [Props.conversationId, isLoadingConversation]);

  const formatDateTime = (date: any) => {
    if (isToday(date)) {
      return format(date, 'p'); // Display only time for today
    } else if (isThisWeek(date, { weekStartsOn: 1 })) {
      return format(date, 'iiii, p'); // Display full day of the week and time for this week
    } else if (isThisYear(date)) {
      return format(date, 'eeee, MMMM d • p'); // Display full day of the week, date, and time for this year
    } else {
      return format(date, 'eeee, MMMM d, yyyy • p'); // Display full day of the week, date, year, and time for other cases
    }
  };

  const downloadImage = async (url: any) => {
    const originalImage = url;
    const image = await fetch(originalImage);

    //Split image name
    const nameSplit = originalImage.split('/');
    const duplicateName = nameSplit.pop();
    const name = duplicateName.substring(0, duplicateName.lastIndexOf('_'));

    const imageBlog = await image.blob();
    const imageURL = URL.createObjectURL(imageBlog);
    const link = document.createElement('a');
    link.href = imageURL;
    link.download = '' + name + '';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <StyleTotal>
      {isLoadingConversation ? (
        <>
          <div
            className="shared"
            style={{
              width: '23%',
              height: '100vh',
              marginLeft: '77%',
              position: 'fixed',
              backgroundColor: themeColorSet.colorBg1
            }}>
            <div
              className="extension px-3 flex items-center"
              style={{
                height: '12%',
                borderBottom: '1px solid',
                borderColor: themeColorSet.colorBg4
              }}>
              <div className="flex justify-center items-center w-full">
                <div
                  className="setting text-center"
                  style={{
                    width: '25%'
                  }}>
                  <Skeleton.Button active size="large" shape="circle" />
                </div>
                <div
                  className="notification text-center"
                  style={{
                    width: '25%'
                  }}>
                  <Skeleton.Button active size="large" shape="circle" />
                </div>
                <div
                  className="warning text-center"
                  style={{
                    width: '25%'
                  }}>
                  <Skeleton.Button active size="large" shape="circle" />
                </div>
                <div
                  className="logout text-center"
                  style={{
                    width: '25%'
                  }}>
                  <Skeleton.Button active size="large" shape="circle" />
                </div>
              </div>
            </div>
            <div className="fileShare px-3 py-4">
              <div className="sharedMedia">
                <Space className="content" size={20}>
                  <Skeleton.Image active />
                  <Skeleton.Image active />
                  <Skeleton.Image active />
                </Space>
              </div>
              <div className="sharedFile mt-5">
                <div className="flex justify-between items-center mb-3"></div>
                <div className="content">
                  <Skeleton
                    className="mb-3"
                    active
                    avatar
                    paragraph={{ rows: 1 }}
                  />
                  <Skeleton
                    className="mb-3"
                    active
                    avatar
                    paragraph={{ rows: 1 }}
                  />
                  <Skeleton
                    className="mb-3"
                    active
                    avatar
                    paragraph={{ rows: 1 }}
                  />
                  <Skeleton
                    className="mb-3"
                    active
                    avatar
                    paragraph={{ rows: 1 }}
                  />
                  <Skeleton
                    className="mb-3"
                    active
                    avatar
                    paragraph={{ rows: 1 }}
                  />
                  <Skeleton
                    className="mb-3"
                    active
                    avatar
                    paragraph={{ rows: 1 }}
                  />
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          <div
            className="shared"
            style={{
              width: '23%',
              height: '100vh',
              marginLeft: '77%',
              position: 'fixed',
              backgroundColor: themeColorSet.colorBg1
            }}>
            <div
              className="extension px-3 flex items-center"
              style={{
                height: '12%',
                borderBottom: '1px solid',
                borderColor: themeColorSet.colorBg4
              }}>
              <div
                className="flex justify-center items-center w-full"
                style={{
                  color: themeColorSet.colorText3
                }}>
                <div
                  className="setting text-center"
                  style={{
                    width: '25%'
                  }}>
                  <SettingOutlined
                    className="extensionItem"
                    style={{
                      fontSize: '1.5rem'
                    }}
                  />
                </div>
                <div
                  className="notification text-center"
                  style={{
                    width: '25%'
                  }}>
                  <BellOutlined
                    className="extensionItem"
                    style={{
                      fontSize: '1.5rem'
                    }}
                  />
                </div>
                <div
                  className="warning text-center"
                  style={{
                    width: '25%'
                  }}>
                  <ExclamationCircleOutlined
                    className="extensionItem"
                    style={{
                      fontSize: '1.5rem'
                    }}
                  />
                </div>
                <div
                  className="logout text-center"
                  style={{
                    width: '25%'
                  }}>
                  <LogoutOutlined
                    className="extensionItem"
                    style={{
                      fontSize: '1.5rem'
                    }}
                  />
                </div>
              </div>
            </div>
            <div className="fileShare px-3 py-4">
              <div className="sharedFile mt-5">
                <div className="flex justify-between items-center mb-3">
                  <div
                    className="titleContent font-bold"
                    style={{
                      color: themeColorSet.colorText1
                    }}>
                    Images
                  </div>
                </div>
                <div className="content">
                  {items.length === 0 ? (
                    <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                  ) : (
                    <>
                      {items?.map((item: any, index: any) => {
                        if (index > 3) return;
                        return (
                          <div className="fileContent flex justify-between items-center mb-2">
                            <div className="left flex justify-between items-center">
                              <div className="image mr-2">
                                <Image
                                  key={item._id}
                                  src={item.image}
                                  alt="image"
                                  style={{
                                    height: '3.5rem',
                                    borderRadius: '10px',
                                    width: '3.5rem',
                                    objectFit: 'cover'
                                  }}
                                />
                              </div>
                              <Space className="info" direction="vertical">
                                <div
                                  className="name"
                                  style={{
                                    color: themeColorSet.colorText1,
                                    fontWeight: '600'
                                  }}>
                                  {item.sender.username}
                                </div>
                                <Space
                                  style={{
                                    color: themeColorSet.colorText3
                                  }}>
                                  <div className="date">
                                    {formatDateTime(new Date(item.createdAt))}
                                  </div>
                                </Space>
                              </Space>
                            </div>
                            <div
                              className="right cursor-pointer"
                              onClick={() => {
                                downloadImage(item.image);
                              }}>
                              <FontAwesomeIcon icon={faDownload} />
                            </div>
                          </div>
                        );
                      })}
                      <div
                        className="seeAll flex items-end justify-end"
                        style={{
                          color: themeColorSet.colorText2,
                          fontSize: '0.8rem',
                          textDecoration: 'underline'
                        }}>
                        <p className="cursor-pointer">See all</p>
                      </div>
                    </>
                  )}
                </div>
              </div>
              {/* <div className="sharedLink mt-5">
            <div className="flex justify-between items-center mb-2">
              <div className="titleContent font-bold">Shared Links</div>
              <div
                className="seeAll"
                style={{
                  color: themeColorSet.colorText3,
                  fontSize: '0.8rem',
                  textDecoration: 'underline',
                }}
              >
                See All
              </div>
            </div>
            <div className="content">
              {sharedLinkArr.map((item: any, index: any) => {
                return (
                  <div className="fileContent flex items-center mb-2 cursor-pointer">
                    <div
                      className="image mr-2"
                      style={{
                        width: '3.5rem',
                      }}
                    >
                      <img
                        src={item.image}
                        alt="link"
                        style={{
                          height: '3.5rem',
                          borderRadius: '10px',
                        }}
                      />
                    </div>
                    <Space className="link" direction="vertical">
                      <div
                        className="name"
                        style={{
                          color: themeColorSet.colorText1,
                          fontWeight: '600',
                        }}
                      >
                        {item.name}
                      </div>
                      <div
                        className="linkContent"
                        style={{
                          color: themeColorSet.colorText3,
                          fontSize: '0.9rem',
                        }}
                      >
                        {item.link?.length > 35 ? item.link?.slice(0, 35) + '...' : item.link}
                      </div>
                    </Space>
                  </div>
                );
              })}
            </div> 
          </div>*/}
            </div>
          </div>
        </>
      )}
    </StyleTotal>
  );
};

export default SharedMedia;
