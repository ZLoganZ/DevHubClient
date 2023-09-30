import styled from 'styled-components';

const StyleProvider = styled.div`
  .input {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }

  .sendComment {
    position: relative;
    left: -5.5rem;
    z-index: 1;
  }

  .commentInput {
    input {
      box-shadow: none;
    }
  }
`;

export default StyleProvider;
