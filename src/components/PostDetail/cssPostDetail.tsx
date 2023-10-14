import styled from 'styled-components';
import { custom_scrollBar_modal } from '@/util/cssVariable';

const StyleProvider = styled.div`
  background-color: ${(props) => props.theme.colorBg2};
  color: ${(props) => props.theme.colorText1};
  /* min-height: calc(100vh - 5rem); */

  .postDetail {
    ${custom_scrollBar_modal}
  }

  .container {
    position: relative;
    width: 100%;
    padding: 0;
  }

  .overlay {
    border-radius: 1rem;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 10;
    width: 100%;
    height: 100%;
    opacity: 0.5; /* Adjust the opacity as needed */
    background-color: ${(props) => props.theme.colorBg4}; /* Adjust the background color as needed */
  }
`;

export default StyleProvider;
