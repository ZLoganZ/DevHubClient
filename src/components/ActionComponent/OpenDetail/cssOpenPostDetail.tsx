import styled from 'styled-components';

const StyleProvider = styled.div`
  background-color: ${(props) => props.theme.colorBg1};
  color: ${(props) => props.theme.colorText1};
  min-height: calc(100vh - 5rem);

  .input {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }

  .commentInput {
    input {
      box-shadow: none;
    }
  }
`;

export default StyleProvider;
