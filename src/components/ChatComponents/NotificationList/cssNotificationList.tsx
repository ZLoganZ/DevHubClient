import styled from 'styled-components';

const StyleProvider = styled.div`
  .notification-list {
    .notification-item {
      background-color: ${(props) => props.theme.colorBg2};
      border-radius: 5px;
      padding: 0.5rem;
      margin-bottom: 0.5rem;
      &:hover {
        background-color: ${(props) => props.theme.colorBg3};
        transition: all 0.5s;
      }
    }
  }
`;

export default StyleProvider;
