import { call, put, takeLatest } from "redux-saga/effects";
import { getStartedService } from "../../services/GetStartedService";
import STATUS_CODE from "@/utils/constants/statusCodes";
import {
  CHOOSE_GET_INTEREST_SAGA,
  CHOOSE_GET_STARTED_SAGA,
  CHOOSE_SHOULD_FOLLOW_SAGA,
  GET_SHOULD_FOLLOWERS_SAGA,
} from "../actionSaga/GetStartedActionSaga";
import { setShouldFollowers } from "../Slice/GetStartedSlice";

// Choose Get Started Saga
export function* chooseGetStartedSaga({ payload }: any) {
  try {
    yield call(getStartedService.chooseGetStarted, payload);
  } catch (err: any) {
    console.log(err);
  }
}

export function* theoDoiChooseGetStartedSaga() {
  yield takeLatest(CHOOSE_GET_STARTED_SAGA, chooseGetStartedSaga);
}

// Choose Get Interest Saga
export function* chooseGetInterestSaga({ payload }: any) {
  try {
    yield call(getStartedService.chooseInterest, payload);
  } catch (err: any) {
    console.log(err);
  }
}

export function* theoDoiChooseGetInterestSaga() {
  yield takeLatest(CHOOSE_GET_INTEREST_SAGA, chooseGetInterestSaga);
}

// Choose Should Followers Saga
function* chooseShouldFollowerSaga({ payload }: any) {
  try {
    const { data, status } = yield getStartedService.chooseShouldFollowPeople(
      payload
    );
  } catch (err: any) {
    console.log(err.response.data);
  }
}

export function* theoDoichooseShouldFollowerSaga() {
  yield takeLatest(CHOOSE_SHOULD_FOLLOW_SAGA, chooseShouldFollowerSaga);
}

// Get Should Follow Saga
function* getShouldFollowSaga() {
  try {
    const { data, status } = yield getStartedService.getShouldFollower();
    if (status === STATUS_CODE.OK) {
      yield put(setShouldFollowers(data.content));
    }
  } catch (err: any) {
    console.log(err);
  }
}

export function* theoDoigetShouldFollowSaga() {
  yield takeLatest(GET_SHOULD_FOLLOWERS_SAGA, getShouldFollowSaga);
}
