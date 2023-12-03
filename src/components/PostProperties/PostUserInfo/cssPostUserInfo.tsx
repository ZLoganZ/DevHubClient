import styled from 'styled-components';

const StyleProvider = styled.div`
  .name_avatar {
    .name__top {
      a {
        color: ${(props) => props.theme.colorText1};
        &:hover {
          text-decoration: underline;
          transition: text-decoration 0.5s;
        }
      }
    }
  }
`;

export default StyleProvider;
