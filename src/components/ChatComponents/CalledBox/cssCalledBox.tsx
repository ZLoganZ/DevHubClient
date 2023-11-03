import styled from 'styled-components';

const StyleProvider = styled.div`
  .conversation-box:hover {
    background-color: ${(props) => props.theme.colorBg2}!important;
  }
`;

export default StyleProvider;
