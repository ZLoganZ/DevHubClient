import styled from 'styled-components';

const StyleProvider = styled.div`
  /* .time-message {
    opacity: 0;
    transition: opacity 0.4s;
    position: absolute;
    top: 2.3rem;
  }

  .body-message {
    transition: 0.4s;
    transform: translateX(0);
    &:hover {
      transform: translateY(-1rem);
      -webkit-background-clip: text;
      background-clip: text;
      .time-message {
        opacity: 1;
        -webkit-background-clip: text;
        background-clip: text;
      }
    }
  } */

  .seen-message {
    position: relative;
    top: 0.5rem;
  }
`;

export default StyleProvider;
