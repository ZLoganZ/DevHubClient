import styled from "styled-components";
import { commonColor } from "@/utils/cssVariable";

const StyleTotal = styled.div`
  background-color: ${(props) => props.theme.colorBg1};
  color: ${(props) => props.theme.colorText1};
  min-height: calc(100vh - 5rem);

  .input {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
  .sendComment {
    position: relative;
    left: -5.5rem;
    z-index: 1;
  }
  .commentInput {
    input {
      box-shadow: none;
    }
  }
`;

export default StyleTotal;
