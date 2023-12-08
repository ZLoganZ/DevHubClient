import styled from 'styled-components';

const StyleProvider = styled.div`
  background-color: ${(props) => props.theme.colorBg1};
  min-height: calc(100vh - 5rem);
  height: fit-content;
  color: ${(props) => props.theme.colorText1};
  .savedPosts {
  }
`;

export default StyleProvider;
