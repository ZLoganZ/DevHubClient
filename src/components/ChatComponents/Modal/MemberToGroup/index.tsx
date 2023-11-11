import { Checkbox, Col, ConfigProvider, Input, Row } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

import { useAppSelector } from '@/hooks/special';
import { getTheme } from '@/util/theme';
import StyleProvider from './cssMemberToGroup';
import { IUserInfo } from '@/types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import AvatarMessage from '../../Avatar/AvatarMessage';
import { handleFirstName } from '@/util/convertText';
import { useEffect, useState } from 'react';

interface IMemberToGroup {
  users: IUserInfo[];
  setUsers: React.Dispatch<React.SetStateAction<IUserInfo[]>>;
}

const MemberToGroup: React.FC<IMemberToGroup> = ({ users, setUsers }) => {
  useAppSelector((state) => state.theme.changed);
  const { themeColorSet } = getTheme();

  const [checkList, setCheckList] = useState<Record<string, boolean>>({});
  const [checkedUsers, setCheckedUsers] = useState<IUserInfo[]>([]);
  const HandleOnClick = (userID: string) => {
    setCheckList({ ...checkList, [userID]: !checkList[userID] });
    if (checkList[userID]) {
      setCheckedUsers(checkedUsers.filter((user) => user._id !== userID));
    } else {
      setCheckedUsers([...checkedUsers, users.find((user) => user._id === userID)!]);
    }
  };

  useEffect(() => {
    setUsers(checkedUsers);
  }, [checkedUsers]);

  const handleUncheck = (userID: string) => {
    setCheckList({ ...checkList, [userID]: false });
    setCheckedUsers(checkedUsers.filter((user) => user._id !== userID));
  };

  return (
    <ConfigProvider theme={{ token: { controlHeight: 40, colorBorder: themeColorSet.colorBg4 } }}>
      <StyleProvider>
        <Col>
          <Row>
            <Input
              allowClear
              placeholder='Search'
              className='rounded-full'
              prefix={<SearchOutlined className='text-xl' />}
              // onChange={(e) => setSearch(e.target.value)}
            />
          </Row>
          <Row className='h-28 w-full'>
            {checkedUsers.length == 0 && (
              <div className='w-full h-full flex items-center justify-center'>
                <div className='font-bold text-sm'>You have not selected any members yet</div>
              </div>
            )}
            <div className='list-users-checked w-full flex overflow-x-auto px-3'>
              {checkedUsers.map((user) => (
                <div className='flex items-center justify-between gap-8 mt-4'>
                  <div className='flex flex-col items-center'>
                    <div className='avatar relative'>
                      <AvatarMessage key={user._id} user={user} size={52} />
                      <FontAwesomeIcon
                        className='absolute block rounded-full -top-0.5 -left-1 w-4 h-4 cursor-pointer'
                        style={{ backgroundColor: themeColorSet.colorBg4 }}
                        icon={faXmark}
                        color={themeColorSet.colorText1}
                        onClick={() => handleUncheck(user._id)}
                      />
                    </div>
                    <div className='name_career'>
                      <div className='name mb-1'> {handleFirstName(user.name)}</div>
                    </div>
                  </div>
                  <div className='flex items-center'></div>
                </div>
              ))}
            </div>
          </Row>
          <Row className=' w-full'>
            <div className='font-bold text-lg'> List Followers </div>
            <div className='list-users flex flex-col w-full max-h-80 overflow-auto'>
              {users.map((user) => (
                <div
                  className='user flex items-center justify-between cursor-pointer mt-5'
                  key={user._id}
                  onClick={() => HandleOnClick(user._id)}>
                  <div className='info flex items-center'>
                    <div className='avatar relative'>
                      <AvatarMessage key={user._id} user={user} />
                    </div>
                    <div
                      className='name text-center ml-2'
                      style={{
                        fontSize: '0.9rem',
                        color: themeColorSet.colorText1
                      }}>
                      {user.name}
                    </div>
                  </div>
                  <Checkbox className='items-end' checked={checkList[user._id]} />
                </div>
              ))}
            </div>
          </Row>
        </Col>
      </StyleProvider>
    </ConfigProvider>
  );
};

export default MemberToGroup;
