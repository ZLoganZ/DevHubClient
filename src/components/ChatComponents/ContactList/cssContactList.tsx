import styled from 'styled-components';
import { custom_scrollBar_modal } from '@/util/cssVariable';

const StyleProvider = styled.div`
  background-color: ${(props) => props.theme.colorBg1};
  ${custom_scrollBar_modal}

  .user {
    &:hover {
      background-color: ${(props) => props.theme.colorBg2};
      cursor: pointer;
      transition: background-color 0.3s ease;
    }
  }
`;

export default StyleProvider;
