import styled from "styled-components";
import { commonColor } from "@/utils/cssVariable";

const StyleTotal = styled.div`
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
