import styled from "styled-components";
import { commonColor } from "@/utils/cssVariable";

const StyleTotal = styled.div`
  min-height: 100vh;
  height: fit-content;
  background-color: ${(props) => props.theme.colorBg1};
`;

export default StyleTotal;
