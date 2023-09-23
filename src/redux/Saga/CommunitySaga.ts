import { put, takeLatest } from 'redux-saga/effects';

import { GET_COMMUNITY_BY_ID_SAGA } from '@/redux/ActionSaga/CommunityActionSaga';
import { setCommunity } from '@/redux/Slice/CommunitySlide';

import { STATUS_CODE } from '@/util/constants/SettingSystem';
import { communityService } from '@/services/CommunityService';

// Get Community By ID Saga
function* getCommunityByIDSaga({ payload }: any) {
  yield communityService.getCommunityByID(payload);
  try {
    const { data, status } = yield communityService.getCommunityByID(payload);
    if (status === STATUS_CODE.SUCCESS) {
      yield put(setCommunity(data.metadata));
      // yield put(setUser(data.metadata));
    }
  } catch (err: any) {
    console.log(err);
  }
}

export function* theoDoiGetCommunityByIDSaga() {
  yield takeLatest(GET_COMMUNITY_BY_ID_SAGA, getCommunityByIDSaga);
}
