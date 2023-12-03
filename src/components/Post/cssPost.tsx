import styled from 'styled-components';
const StyleProvider = styled.div`
  background-color: ${(props) => props.theme.colorBg2};
  .space-align-block {
    flex: none;
    margin: 16px 8px;
    padding: 20px;
    border: 1px solid ${(props) => props.theme.colorBg4};
    border-radius: 20px;
  }

  .disableElement {
    pointer-events: none;
    opacity: 0.7;
  }

  .post {
    .postHeader {
      .postHeader__left {
      }
      .postHeader__right {
        .icon {
          &:hover {
            cursor: pointer;
            color: ${(props) => props.theme.colorText2};
            transition: color 0.5s;
          }
        }
      }
    }
    .postBody {
    }
    .postFooter {
    }
  }
`;

export default StyleProvider;
