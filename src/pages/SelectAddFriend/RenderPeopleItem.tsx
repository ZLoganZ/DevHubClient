import { useState } from 'react';
import { Divider, Space } from 'antd';
import { CheckCircleOutlined } from '@ant-design/icons';

import { ButtonActiveHover } from '@/components/MiniComponent';

import { commonColor } from '@/util/cssVariable';
import { getTheme } from '@/util/theme';
import { useAppSelector } from '@/hooks/special';
import { useAddFriendUser } from '@/hooks/mutation';

const RenderPeopleItem = ({ item }: any) => {
  // Lấy theme từ LocalStorage chuyển qua css
  useAppSelector((state) => state.theme.changed);
  const { themeColorSet } = getTheme();

  const { mutateAddFriendUser: mutateAddFriendUser } = useAddFriendUser();

  const [Friend, setFriend] = useState(false);

  return (
    <>
      <div className='peopleItem flex justify-between items-center mt-5 p-2'>
        <div
          className='peopleImage p-3'
          style={{
            width: '10%'
          }}>
          <img
            src={item.userImage}
            alt=''
            style={{
              borderRadius: '50%'
            }}
          />
        </div>
        <div
          className='peopleInfo'
          style={{
            width: '75%'
          }}>
          <Space className='top mb-2'>
            <span
              className='name'
              style={{
                color: themeColorSet.colorText1,
                fontSize: '1.1rem',
                fontWeight: '600'
              }}>
              {item.name}
            </span>
            <span
              className='icon'
              style={{
                color: themeColorSet.colorText3
              }}>
              {item.verified ? (
                <CheckCircleOutlined
                  style={{
                    color: commonColor.colorBlue1,
                    fontSize: '1rem'
                  }}
                />
              ) : (
                ''
              )}
            </span>
            <span
              className='alias'
              style={{
                color: themeColorSet.colorText3
              }}>
              {item.email.slice(0, item.email.indexOf('@'))}
            </span>
          </Space>
          <div
            className='bottom'
            style={{
              color: themeColorSet.colorText3,
              fontSize: '0.9rem'
            }}>
            {item?.experiences.length > 0
              ? item?.experiences.length > 1
                ? item?.experiences[0].position_name + ' & ' + item?.experiences[1].position_name
                : item?.experiences[0].position_name
              : ''}
          </div>
        </div>
        <div
          className='followBtn text-center'
          style={{
            width: '10%'
          }}>
          <ButtonActiveHover
            onClick={() => {
              mutateAddFriendUser(item._id, { onSuccess: () => setFriend(!Friend) });
            }}>
            &nbsp;
            {!Friend ? 'Unfriend' : 'Add friend'}
          </ButtonActiveHover>
        </div>
      </div>
      <Divider
        style={{
          height: '2px',
          backgroundColor: themeColorSet.colorBg2
        }}
      />
    </>
  );
};

export default RenderPeopleItem;
