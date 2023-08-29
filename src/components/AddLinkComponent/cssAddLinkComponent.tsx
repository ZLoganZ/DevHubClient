import styled from "styled-components";
import { commonColor } from "@/utils/cssVariable";

const StyleTotal = styled.div`
  .itemAddLink {
    background-color: ${(props) => props.theme.colorBg1};
    font-size: 0.9rem;
    border-radius: 0.5rem;
    color: ${(props) => props.theme.colorText2};
    border-radius: 1.5rem;
    &.active {
      background-color: ${(props) => props.theme.colorBg4};
    }
    :hover {
      background-color: ${(props) => props.theme.colorBg4};
      cursor: pointer;
      transition: all 0.5s;
    }
  }
  .inputlink {
    box-shadow: none;
    :hover {
      border-color: ${commonColor.colorBlue1};
    }
  }
`;

export default StyleTotal;
