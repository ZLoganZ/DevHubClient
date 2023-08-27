import { put, takeLatest } from "redux-saga/effects";
import { setCommunity } from "../Slice/CommunitySlide";
import STATUS_CODE from "@/utils/constants/statusCodes";
import { communityService } from "../../services/CommunityService";
import { GET_COMMUNITY_BY_ID_SAGA } from "../actionSaga/CommunityActionSaga";
import { setUser } from "../Slice/UserSlice";

// Get Community By ID Saga
function* getCommunityByIDSaga({ payload }: any) {
  yield communityService.getCommunityByID(payload);
  try {
    const { data, status } = yield communityService.getCommunityByID(payload);
    if (status === STATUS_CODE.OK) {
      yield put(setCommunity(data.content));
      yield put(setUser(data.content));
    }
  } catch (err: any) {
    console.log(err.response.data);
  }
}

export function* theoDoiGetCommunityByIDSaga() {
  yield takeLatest(GET_COMMUNITY_BY_ID_SAGA, getCommunityByIDSaga);
}
