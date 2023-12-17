import styled from 'styled-components';

const StyleProvider = styled.div`
  min-height: 100vh;
  height: fit-content;
  background-color: ${(props) => props.theme.colorBg1};
`;

export default StyleProvider;
