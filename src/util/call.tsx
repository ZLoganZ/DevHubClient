export const audioCall = (conversationID: string) => {
  const width = window.screen.width / 2; // Width of the pop-up window
  const height = window.screen.height / 2; // Height of the pop-up window
  const left = window.screen.width / 2 - width / 2;
  const top = window.screen.height / 2 - height / 2;
  const audioCall = window.open(
    `/call/${conversationID}/voice`,
    'audioCall',
    `width=${width},height=${height},top=${top},left=${left}`
  );

  return audioCall;
};

export const videoChat = (conversationID: string) => {
  const width = window.screen.width / 2; // Width of the pop-up window
  const height = window.screen.height / 2; // Height of the pop-up window
  const left = window.screen.width / 2 - width / 2;
  const top = window.screen.height / 2 - height / 2;
  const videoChat = window.open(
    `/call/${conversationID}/video`,
    'videoCall',
    `width=${width},height=${height},top=${top},left=${left}`
  );

  return videoChat;
};
