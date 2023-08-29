import styled, { css } from "styled-components";
import { commonColor, custom_scrollBar } from "@/utils/cssVariable";

const StyleTotal = styled.div`
  background-color: ${(props) => props.theme.colorBg2};

  .postDetail {
    .commentTotal {
      ${custom_scrollBar}
    }
  }
`;

export default StyleTotal;
