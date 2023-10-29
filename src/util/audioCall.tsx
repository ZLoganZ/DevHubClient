export default function audioCall(conversationID: string) {
  const width = window.screen.width / 2; // Width of the pop-up window
  const height = window.screen.height / 2; // Height of the pop-up window
  const left = window.screen.width / 2 - width / 2;
  const top = window.screen.height / 2 - height / 2;
  window.open(
    `/call/${conversationID}/voice`,
    'audioCall',
    `width=${width},height=${height},top=${top},left=${left}`
  );
}
