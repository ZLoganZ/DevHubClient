import { custom_scrollBar } from '@/util/cssVariable';
import styled from 'styled-components';

const StyleProvider = styled.div`
  height: 100%;
  .shared {
    ${custom_scrollBar}
    .info,
    .fileShared,
    .conversation-setting {
      color: ${(props) => props.theme.colorText3};
    }
    .add-member,
    .options,
    .rename,
    .change-image {
      color: ${(props) => props.theme.colorText3};
      :hover {
        background-color: ${(props) => props.theme.colorBg3}!important;
        color: ${(props) => props.theme.colorText1};
        transition: all 0.5s;
      }
    }
    .leave-group {
      color: ${(props) => props.theme.colorText3};
      :hover {
        background-color: #f42f2f;
        color: ${(props) => props.theme.colorText1};
        transition: all 0.5s;
      }
    }
  }
`;

export default StyleProvider;
