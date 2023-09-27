import styled from 'styled-components';
import { commonColor } from '@/util/cssVariable';

const StyleProvider = styled.div`
  .titleContent {
    color: ${commonColor.colorWhile1};
    font-weight: 600;
    margin-bottom: 1rem;
  }
  .shared {
    .extension {
      .extensionItem {
        color: ${(props) => props.theme.colorText3};
        :hover {
          color: ${(props) => props.theme.colorText1};
          cursor: pointer;
          transition: all 0.5s;
        }
      }
    }
  }
`;

export default StyleProvider;
