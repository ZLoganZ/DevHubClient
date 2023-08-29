import styled from "styled-components";
import { commonColor } from "@/utils/cssVariable";

const StyleTotal = styled.div`
  .header {
    .displayShare {
      color: ${(props) => props.theme.colorText3};
      :hover {
        color: ${(props) => props.theme.colorText1};
        transition: all 0.5s;
      }
    }
  }
`;

export default StyleTotal;
