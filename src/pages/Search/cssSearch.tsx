import { custom_scrollBar } from '@/util/cssVariable';
import styled from 'styled-components';

const StyleProvider = styled.div`
  background-color: ${(props) => props.theme.colorBg1};
  min-height: calc(100vh - 5rem);
  color: ${(props) => props.theme.colorText1};
  ${custom_scrollBar}

`;

export default StyleProvider;
