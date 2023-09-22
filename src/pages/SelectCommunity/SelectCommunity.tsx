import { faUserFriends } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ConfigProvider, Space } from 'antd';
import { NavLink } from 'react-router-dom';

import { ButtonActiveHover } from '@/components/MiniComponent';

import { commonColor } from '@/util/cssVariable';
import { getTheme } from '@/util/functions/ThemeFunction';
import { useAppSelector } from '@/hooks';
import StyleTotal from './cssSelectCommunity';

const SelectCommunity = () => {
  const communityArray = [
    {
      groupName: 'Blockchain',
      data: [
        {
          id: 1,
          name: 'Web3Dev',
          image:
            'https://images-platform.99static.com/m0AWL_NkWCDqUhV58lKUMLt1le4=/192x192:1728x1728/500x500/top/smart/99designs-contests-attachments/133/133347/attachment_133347677',
          members: 3508,
          description:
            'Blockchain is a decentralized, distributed, and public digital ledger that is used to record transactions across many computers so that the record cannot be altered retroactively without the alteration of all subsequent blocks and the collusion of the network.'
        },
        {
          id: 2,
          name: 'Web3 & Blockchains',
          image:
            'https://img.freepik.com/premium-vector/blockchain-line-icon-logo-concept-dark-background_516670-196.jpg',
          members: 3648,
          description:
            'Resource about Web3 and Blockchains development, design, and business.'
        }
      ]
    },
    {
      groupName: 'DevOps & Infrastructure',
      data: [
        {
          id: 1,
          name: 'Kubernetes Zome',
          image:
            'https://foghornconsulting.com/wp-content/uploads/2022/01/kubernetes-1.png',
          members: 9394,
          description:
            'Sharing kubernetes tips and tricks, and other infrastructure related topics.'
        },
        {
          id: 2,
          name: 'AWS',
          image:
            'https://ih1.redbubble.net/image.2107976074.2036/st,small,507x507-pad,600x600,f8f8f8.jpg',
          members: 3033,
          description:
            'A place to discuss all things AWS, including the AWS SDKs, AWS CLI, and more.'
        },
        {
          id: 3,
          name: 'DevOps',
          image:
            'https://cdn.dribbble.com/users/13574/screenshots/9711275/logo-devops.png',
          members: 3835,
          description: 'DevOps Community'
        }
      ]
    },
    {
      groupName: 'Front End',
      data: [
        {
          id: 1,
          name: 'React.JS',
          image:
            'https://w7.pngwing.com/pngs/403/269/png-transparent-react-react-native-logos-brands-in-colors-icon-thumbnail.png',
          members: 14203,
          description: 'A JavaScript library for building user interfaces'
        },
        {
          id: 2,
          name: 'Vue.JS',
          image:
            'https://upload.wikimedia.org/wikipedia/commons/thumb/9/95/Vue.js_Logo_2.svg/640px-Vue.js_Logo_2.svg.png',
          members: 5310,
          description: 'The Progressive JavaScript Framework'
        },
        {
          id: 3,
          name: 'Angular',
          image:
            'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cf/Angular_full_color_logo.svg/2048px-Angular_full_color_logo.svg.png',
          members: 1776,
          description:
            'Angular is a platform for building mobile and desktop web applications.'
        },
        {
          id: 4,
          name: 'HTML & CSS',
          image:
            'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQQ70hL-7iNj-Vju1OiqKFn898rvclzwPKsNA&usqp=CAU',
          members: 2947,
          description: 'HTML & CSS'
        }
      ]
    },
    {
      groupName: 'Back End',
      data: [
        {
          id: 1,
          name: 'Node.JS',
          image:
            'https://ih1.redbubble.net/image.1637717834.1604/pp,840x830-pad,1000x1000,f8f8f8.u1.jpg',
          members: 3508,
          description:
            'Node.js is an open-source, cross-platform, back-end JavaScript runtime environment that runs on the V8 engine and executes JavaScript code outside a web browser.'
        },
        {
          id: 2,
          name: 'GraphQL',
          image:
            'https://upload.wikimedia.org/wikipedia/commons/thumb/1/17/GraphQL_Logo.svg/768px-GraphQL_Logo.svg.png?20161105194737',
          members: 5310,
          description:
            'GraphQL is a query language for APIs and a runtime for fulfilling those queries with your existing data.'
        }
      ]
    }
  ];

  // Lấy theme từ LocalStorage chuyển qua css
  const { change } = useAppSelector((state) => state.themeReducer);
  const { themeColor } = getTheme();
  const { themeColorSet } = getTheme();
  return (
    <ConfigProvider
      theme={{
        token: themeColor
      }}>
      <StyleTotal theme={themeColorSet}>
        <div className="flex justify-center w-full h-full selectInterest">
          <div className="content w-1/2 pt-10 h-full relative">
            <div>
              <span
                className="mr-3"
                style={{ color: themeColorSet.colorText2 }}>
                Step 04:
              </span>
              <span style={{ color: themeColorSet.colorText3 }}>
                Select communities
              </span>
            </div>
            <div className="slide w-full flex justify-between mt-2">
              <span
                style={{
                  width: '19.4%',
                  height: '2px',
                  backgroundColor: commonColor.colorGreen1,
                  display: 'inline-block'
                }}></span>
              <span
                style={{
                  width: '19.4%',
                  height: '2px',
                  backgroundColor: commonColor.colorGreen1,
                  display: 'inline-block'
                }}></span>
              <span
                style={{
                  width: '19.4%',
                  height: '2px',
                  backgroundColor: commonColor.colorGreen1,
                  display: 'inline-block'
                }}></span>
              <span
                style={{
                  width: '19.4%',
                  height: '2px',
                  backgroundColor: commonColor.colorBlue1,
                  display: 'inline-block'
                }}></span>
              <span
                style={{
                  width: '19.4%',
                  height: '2px',
                  backgroundColor: commonColor.colorGreen1,
                  display: 'inline-block'
                }}></span>
            </div>
            <div
              className="textMax mt-4"
              style={{
                color: themeColorSet.colorText1,
                fontSize: '1.8rem',
                fontWeight: '600'
              }}>
              Here are some relevant communities for you
            </div>
            <div className="communities mt-10">
              {communityArray.map((item, index) => {
                return (
                  <div key={index} className="group mt-10">
                    <div
                      className="groupName font-semibold"
                      style={{
                        color: themeColorSet.colorText2,
                        fontSize: '1.3rem'
                      }}>
                      {item.groupName}
                    </div>
                    <div className="groupContent">
                      {item.data.map((item, index) => {
                        return (
                          <div
                            key={index}
                            className="groupItem flex justify-between items-center mt-5 px-4 "
                            style={{
                              backgroundColor: themeColorSet.colorBg2,
                              width: '100%',
                              height: '120px'
                            }}>
                            <div
                              className="groupImage text-center"
                              style={{
                                width: '10%',
                                backgroundColor: themeColorSet.colorText1
                              }}>
                              <img src={item.image} alt="" />
                            </div>
                            <div
                              className="groupInfo"
                              style={{
                                width: '75%'
                              }}>
                              <Space className="top mb-2">
                                <span
                                  className="name"
                                  style={{
                                    color: themeColorSet.colorText1,
                                    fontSize: '1.3rem',
                                    fontWeight: '600'
                                  }}>
                                  {item.name}
                                </span>
                                <span
                                  className="icon"
                                  style={{
                                    color: themeColorSet.colorText3
                                  }}>
                                  <FontAwesomeIcon
                                    icon={faUserFriends}
                                    size={'xs'}
                                  />
                                </span>
                                <span
                                  className="member"
                                  style={{
                                    color: themeColorSet.colorText3
                                  }}>
                                  {item.members}
                                </span>
                              </Space>
                              <div
                                className="bottom"
                                style={{
                                  color: themeColorSet.colorText3,
                                  fontSize: '0.9rem'
                                }}>
                                {item.description.length > 100
                                  ? item.description.slice(0, 100) + '...'
                                  : item.description}
                              </div>
                            </div>
                            <div
                              className="groupBtn text-center"
                              style={{
                                width: '10%'
                              }}>
                              <ButtonActiveHover rounded>
                                Join
                              </ButtonActiveHover>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="button mt-16 mr-4 mb-10 text-right">
              <NavLink to="/select-follow">
                <ButtonActiveHover rounded>Next</ButtonActiveHover>
              </NavLink>
            </div>
          </div>
        </div>
      </StyleTotal>
    </ConfigProvider>
  );
};

export default SelectCommunity;
