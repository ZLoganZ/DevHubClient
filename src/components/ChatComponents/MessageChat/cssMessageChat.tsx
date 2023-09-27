import styled from 'styled-components';

const StyleProvider = styled.div`
  .header {
    .displayShare {
      color: ${(props) => props.theme.colorText3};
      :hover {
        color: ${(props) => props.theme.colorText1};
        transition: all 0.5s;
      }
    }
  }
`;

export default StyleProvider;
