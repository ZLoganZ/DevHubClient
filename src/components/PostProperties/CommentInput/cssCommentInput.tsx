import styled from 'styled-components';

const StyleProvider = styled.div`
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
