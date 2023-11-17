import styled from 'styled-components';

const StyleProvider = styled.div`
  .header {
    .display-share,
    .audio-call,
    .video-call {
      padding: 0.5rem;
      border-radius: 50%;
      height: 20px;
      width: 20px;
      &:hover {
        background-color: ${(props) => props.theme.colorBg3};
        transform: scale(1.1);
        transition: 0.3s;
      }
    }
  }

  .typing-indicator {
    display: inline-block;
    position: absolute;
    width: 52px;
    height: 30px;
    top: 9px;
  }
  .typing-indicator div {
    position: absolute;
    top: 12px;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: ${(props) => props.theme.colorText3};
    animation: typing-indicator-animate 0.8s infinite linear;
  }
  .typing-indicator div:nth-child(1) {
    left: 10px;
    animation-delay: 0.1s;
  }
  .typing-indicator div:nth-child(2) {
    left: 22px;
    animation-delay: 0.2s;
  }
  .typing-indicator div:nth-child(3) {
    left: 34px;
    animation-delay: 0.3s;
  }
  @keyframes typing-indicator-animate {
    0%,
    100% {
      transform: translateY(-10px);
    }
    25%,
    50%,
    75% {
      transform: translateY(0);
    }
  }
`;

export default StyleProvider;
