import { custom_scrollBar } from '@/util/cssVariable';
import styled from 'styled-components';

const StyleProvider = styled.div`
  background-color: ${(props) => props.theme.colorBg1};
  min-height: calc(100vh - 5rem);
  color: ${(props) => props.theme.colorText1};
  ${custom_scrollBar}

  .popular-post-body {
    .no-post {
      color: ${(props) => props.theme.colorText1};
      font-size: 1.5rem;
      font-weight: 600;
      margin-bottom: 1rem;
    }
    .popular-post-item {
      &:hover {
        background-color: ${(props) => props.theme.colorBg3};
        color: ${(props) => props.theme.colorText1};
        cursor: pointer;
        transition: all 0.5s;
      }
    }
  }
  .top-community-body {
    .top-community-item {
      border-radius: 5px;
      &:hover {
        background-color: ${(props) => props.theme.colorBg3};
        color: ${(props) => props.theme.colorText1};
        cursor: pointer;
        transition: all 0.5s;
      }
    }
  }
`;

export default StyleProvider;
