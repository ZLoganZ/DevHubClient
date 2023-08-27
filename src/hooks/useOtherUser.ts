import { useMemo } from 'react';
import { useSelector } from 'react-redux';

const useOtherUser = (conversation: any) => {
  const userInfo = useSelector((state: any) => state.userReducer.userInfo);

  const otherUser = useMemo(() => {
    const currentUser = userInfo?.id;

    const otherUser = conversation?.users?.filter((user: any) => user._id !== currentUser);

    const otherUserInfo = { ...otherUser[0], username: otherUser[0].lastname + ' ' + otherUser[0].firstname };

    return otherUserInfo;
  }, [userInfo, conversation.users]);

  return otherUser;
};

export default useOtherUser;
