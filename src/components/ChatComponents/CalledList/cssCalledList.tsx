import styled from 'styled-components';
import { custom_scrollBar_modal } from '@/util/cssVariable';

const StyleProvider = styled.div`
  background-color: ${(props) => props.theme.colorBg1};
  .searchChat {
    .userChat {
      .userItem {
        :hover {
          background-color: ${(props) => props.theme.colorBg2};
          cursor: pointer;
          transition: all 0.5s;
        }
      }
    }
  }
  .userChat {
    ${custom_scrollBar_modal}
  }
`;

export default StyleProvider;
