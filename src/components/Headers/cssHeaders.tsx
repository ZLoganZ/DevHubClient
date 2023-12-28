import styled from 'styled-components';

const StyleProvider = styled.div`
  .messageButton,
  .notiButton,
  .avatarButton {
    background-color: ${(props) => props.theme.colorBg3};
    color: ${(props) => props.theme.colorText1};
    &:hover {
      background-color: ${(props) => props.theme.colorBg4};
      transition: background-color 0.3s ease;
    }
  }

  .animated-word {
    display: flex;
    align-items: center;
    justify-content: center;
    color: ${(props) => props.theme.colorText1};
  }

  .letter {
    transition: transform 0.4s ease;
    transform: translateX(0);
    color: ${(props) => props.theme.colorText1};
  }

  .letter:hover {
    transform: translateY(-1rem);
    background: -webkit-linear-gradient(120deg, hsl(19, 90%, 52%), hsl(56, 100%, 50%));
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .listSearch {
    background-color: ${(props) => props.theme.colorBg2};
    color: ${(props) => props.theme.colorText1};
    border: 1px solid ${(props) => props.theme.colorBg4};
    box-shadow: 0 2px 8px ${(props) => props.theme.colorBg4};

    .user {
      &:hover {
        background-color: ${(props) => props.theme.colorBg4};
        transition: background-color 0.3s ease;
      }
    }
  }
`;

export default StyleProvider;
