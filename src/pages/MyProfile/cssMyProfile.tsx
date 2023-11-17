import styled from 'styled-components';
import { commonColor } from '@/util/cssVariable';

const StyleProvider = styled.div`
  background-color: ${(props) => props.theme.colorBg1};
  min-height: calc(100vh - 5rem);
  height: fit-content;
  color: ${(props) => props.theme.colorText1};

  .ql-editor {
    line-height: 2rem;
    border: none;
    font-size: 0.88rem;
  }

  .avatar_cover {
    .avatar {
      /* width: 170px; */
      /* height: 170px; */
      position: absolute;
      /* bottom: -6rem; */
      /* left: 15rem; */
      z-index: 1;
    }
  }
  .chat_Follow {
    .editProfile {
      .btnEditProfile {
        color: ${(props) => props.theme.colorText1};
        background-color: ${(props) => props.theme.colorBg2};
        &:hover {
          color: ${commonColor.colorBlue1};
          cursor: pointer;
          transition: all 0.5s;
        }
      }
    }
  }
  .id_address_join {
    color: ${(props) => props.theme.colorText3};
    .item {
      display: inline-block;
      &::after {
        content: '•';
        margin-left: 0.5rem;
      }
    }
  }
  .tags {
    .item {
      border: 2px solid ${(props) => props.theme.colorText3};
      border-radius: 0.8rem;
      font-size: 0.8rem;
      font-weight: 500;
      &:hover {
        cursor: pointer;
        transition: all 0.3s;
      }
    }
  }
  .follow {
    color: ${(props) => props.theme.colorText3};
    .item {
      display: inline-block;
      &::after {
        content: '•';
        margin-left: 0.5rem;
      }
    }
  }
  .experience {
    font-size: 0.9rem;
    .company {
      font-weight: 600;
    }
  }
  .contact {
    .item {
      background-color: ${(props) => props.theme.colorBg3};
      &:hover {
        background-color: ${(props) => props.theme.colorBg4};
        cursor: pointer;
        transition: all 0.3s;
      }
    }
  }
  .mainContain {
    .renderRepositoryIem {
      cursor: pointer;
      &:hover {
        .top {
          .name {
            text-decoration: underline;
          }
        }
      }
      .top {
        .iconRepos {
          filter: ${(props) => props.theme.colorSVG};
        }
      }
    }
  }
`;

export default StyleProvider;
