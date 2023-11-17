import styled from 'styled-components';

const StyleProvider = styled.div`
  .commentDetail {
    a {
      color: ${(props) => props.theme.colorText1};
      &:hover {
        text-decoration: underline;
        transition: all 0.5s;
      }
    }
  }
`;

export default StyleProvider;
