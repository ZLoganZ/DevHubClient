import styled from 'styled-components';

const StyleProvider = styled.div`
  background-color: ${(props) => props.theme.colorBg1};
  min-height: calc(100vh - 5rem);
  height: fit-content;
  color: ${(props) => props.theme.colorText1};

  .communityPage {
    .avatar_cover {
      .avatar {
        width: 170px;
        height: 170px;
        position: absolute;
        bottom: -7rem;
        left: 15rem;
        z-index: 1;
      }
    }
    .mainContain {
    }
    .infoCommunity {
      .admin,
      .member,
      .recentlyJoin {
        .content {
          .item {
            border-radius: 6px;
            &:hover {
              background-color: ${(props) => props.theme.colorBg1};
              cursor: pointer;
              transition: background-color 0.3s ease;
            }
          }
        }
      }
      .tags {
        .tagItem {
          background-color: ${(props) => props.theme.colorBg1};
          &:hover {
            background-color: ${(props) => props.theme.colorBg4};
            cursor: pointer;
            transition: background-color 0.3s ease;
          }
        }
      }
    }
  }
`;

export default StyleProvider;
