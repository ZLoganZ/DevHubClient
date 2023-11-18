import { custom_scrollBar, commonColor } from '@/util/cssVariable';
import styled from 'styled-components';

const StyleProvider = styled.div`
  height: 100%;
  .shared {
    ${custom_scrollBar}
    .info,
    .fileShared,
    .conversation-setting {
      color: ${(props) => props.theme.colorText2};
      .add-member,
      .options,
      .rename,
      .change-image {
        &:hover {
          background-color: ${commonColor.colorBlue1};
          color: ${commonColor.colorWhite1};
          transition: background-color 0.3s ease, color 0.3s ease;
        }
      }
    }
    .leave-group {
      color: ${(props) => props.theme.colorText2};
      &:hover {
        color: ${(props) => props.theme.colorTextReverse1};
        background-color: #f42f2f;
        transition: background-color 0.3s ease, color 0.3s ease;
      }
    }
  }
  .name {
    color: ${(props) => props.theme.colorText1};
  }
`;

export default StyleProvider;
