import styled from 'styled-components';

const StyleProvider = styled.div`
  height: 100vh;
  background-color: ${(props) => props.theme.colorBg1};

  .btnNext {
    bottom: 10%;
    right: 0%;
    border-radius: 1.5rem;
  }
`;

export default StyleProvider;
