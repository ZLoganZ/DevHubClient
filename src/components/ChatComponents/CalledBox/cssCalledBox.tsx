import styled from 'styled-components';

const StyleProvider = styled.div`
  .conversation-box:hover {
    background-color: ${(props) => props.theme.colorBg2}!important;
  }

  .call {
    border-radius: 50%;
    height: 20px;
    width: 20px;
    &:hover {
      transform: scale(1.3);
      transition: transform 0.3s ease;
    }
  }
`;

export default StyleProvider;
