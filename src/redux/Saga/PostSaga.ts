import { call, put, select, takeLatest } from 'redux-saga/effects';

import {
  CREATE_POST_SAGA,
  DELETE_POST_SAGA,
  GET_ALL_POST_BY_USERID_SAGA,
  LIKE_POST_SAGA,
  SHARE_POST_SAGA,
  UPDATE_POST_SAGA,
  SAVE_POST_SAGA,
  SAVE_COMMENT_SAGA,
  GET_POST_BY_ID_SAGA,
  GET_ALL_POST_SAGA,
  INCREASE_VIEW_SAGA,
  LIKE_COMMENT_POST_SAGA,
  DISLIKE_COMMENT_POST_SAGA
} from '@/redux/ActionSaga/PostActionSaga';
import {
  setOwnerInfo,
  setPost,
  setPostArr,
  updatePosts
} from '@/redux/Slice/PostSlice';
import { closeDrawer, setLoading } from '@/redux/Slice/DrawerHOCSlice';

import { postService } from '@/services/PostService';
import { STATUS_CODE } from '@/util/constants/SettingSystem';

// Get All Post By User ID Saga
export function* getAllPostByUserIDSaga({ payload }: any) {
  try {
    const id = payload.userID;
    const { data, status } = yield call(postService.getAllPostByUserID, id);
    if (status === STATUS_CODE.SUCCESS) {
      yield put(setPostArr(data.metadata));
      yield put(setOwnerInfo(data.metadata));
    }
  } catch (err: any) {
    console.log(err);
  }
}

export function* theoDoiGetAllPostByUserIDSaga() {
  yield takeLatest(GET_ALL_POST_BY_USERID_SAGA, getAllPostByUserIDSaga);
}

// Get All Post Saga
export function* getAllPostSaga() {
  try {
    const { data, status } = yield call(postService.getAllPost);
    if (status === STATUS_CODE.SUCCESS) {
      // yield put(setAllPost(data.metadata));
      yield put(setPostArr(data.metadata));
    }
  } catch (err: any) {
    console.log(err);
  }
}

export function* theoDoiGetAllPostSaga() {
  yield takeLatest(GET_ALL_POST_SAGA, getAllPostSaga);
}

// Get Post By ID Saga
export function* getPostByIdSaga({ payload }: any) {
  try {
    const id = payload.id;
    const { data, status } = yield call(postService.getPostById, id);
    if (status === STATUS_CODE.SUCCESS) {
      yield put(setPost(data.metadata));
      yield put(updatePosts(data.metadata));
    }
  } catch (err: any) {
    console.log(err);
  }
}

export function* theoDoiGetPostByIdSaga() {
  yield takeLatest(GET_POST_BY_ID_SAGA, getPostByIdSaga);
}

// createPostSaga Saga
function* createPostSaga({ payload }: any) {
  try {
    const postCreate = {
      title: payload.postCreate.title,
      content: payload.postCreate.content,
      linkImage: payload.linkImage
    };
    const { status } = yield call(postService.createPost, postCreate);
    if (status === STATUS_CODE.CREATED) {
      const isInProfile: boolean = yield select(
        (state) => state.postReducer.isInProfile
      );
      if (isInProfile) {
        yield put(
          GET_ALL_POST_BY_USERID_SAGA({
            userID: 'me'
          })
        );
      } else {
        yield put(GET_ALL_POST_SAGA());
      }
    }
  } catch (err: any) {
    console.log(err);
  }
}

export function* theoDoiCreatePostSaga() {
  yield takeLatest(CREATE_POST_SAGA, createPostSaga);
}

// Update Post Saga
export function* updatePostSaga({ payload }: any) {
  try {
    const { status } = yield postService.updatePost(
      payload.id,
      payload.postUpdate
    );
    if (status === STATUS_CODE.SUCCESS) {
      yield put(
        GET_POST_BY_ID_SAGA({
          id: payload._id
        })
      );
      yield put(setLoading(false));
      yield put(closeDrawer({}));
    }
  } catch (err: any) {
    console.log(err);
  }
}

export function* theoDoiUpdatePostSaga() {
  yield takeLatest(UPDATE_POST_SAGA, updatePostSaga);
}

// Save Comment Saga
export function* saveCommentSaga({ payload }: any) {
  try {
    const { status } = yield postService.saveComment(payload);
    if (status === STATUS_CODE.SUCCESS) {
      yield put(
        GET_POST_BY_ID_SAGA({
          id: payload._id
        })
      );
    }
  } catch (err: any) {
    console.log(err);
  }
}

export function* theoDoiSaveCommentSaga() {
  yield takeLatest(SAVE_COMMENT_SAGA, saveCommentSaga);
}

// Delete Post Saga
export function* deletePostSaga({ payload }: any) {
  try {
    const { status } = yield postService.deletePost(payload);
    if (status === STATUS_CODE.SUCCESS) {
      yield put(
        GET_ALL_POST_BY_USERID_SAGA({
          userID: 'me'
        })
      );
    }
  } catch (err: any) {
    console.log(err);
  }
}

export function* theoDoiDeletePostSaga() {
  yield takeLatest(DELETE_POST_SAGA, deletePostSaga);
}

// Like Post Saga
export function* likePostSaga({ payload }: any) {
  try {
    const { status } = yield postService.likePost(payload.id);
    if (status === STATUS_CODE.SUCCESS) {
      yield put(
        GET_POST_BY_ID_SAGA({
          id: payload._id
        })
      );
    }
  } catch (err: any) {
    console.log(err);
  }
}

export function* theoDoiLikePostSaga() {
  yield takeLatest(LIKE_POST_SAGA, likePostSaga);
}

// Share Post Saga
export function* sharePostSaga({ payload }: any) {
  try {
    const { status } = yield postService.sharePost(payload);

    if (status === STATUS_CODE.SUCCESS) {
      const isInProfile: boolean = yield select(
        (state) => state.postReducer.isInProfile
      );
      if (isInProfile) {
        yield put(
          GET_ALL_POST_BY_USERID_SAGA({
            userID: 'me'
          })
        );
      }
    }
  } catch (err: any) {
    console.log(err);
  }
}

export function* theoDoiSharePostSaga() {
  yield takeLatest(SHARE_POST_SAGA, sharePostSaga);
}

// Save Post Saga
export function* savePostSaga({ payload }: any) {
  try {
    const { status } = yield postService.savePost(payload.id);
    if (status === STATUS_CODE.SUCCESS) {
      yield put(
        GET_POST_BY_ID_SAGA({
          id: payload._id
        })
      );
    }
  } catch (err: any) {
    console.log(err);
  }
}

export function* theoDoiSavePostSaga() {
  yield takeLatest(SAVE_POST_SAGA, savePostSaga);
}

// Increase View Post Saga
export function* increaseViewPostSaga({ payload }: any) {
  try {
    const { status } = yield postService.increaseViewPost(payload.id);
    if (status === STATUS_CODE.SUCCESS) {
      // yield put(
      //   GET_POST_BY_ID_SAGA({
      //     id: payload._id,
      //   }),
      // );
    }
  } catch (err: any) {
    console.log(err);
  }
}

export function* theoDoiIncreaseViewPostSaga() {
  yield takeLatest(INCREASE_VIEW_SAGA, increaseViewPostSaga);
}

// Like comment post Saga
export function* likeCommentPostSaga({ payload }: any) {
  try {
    const { status } = yield postService.likeCommentPost(
      payload.id,
      payload.comment
    );
    if (status === STATUS_CODE.SUCCESS) {
      // yield put(
      //   GET_POST_BY_ID_SAGA({
      //     id: payload.postID,
      //   }),
      // );
    }
  } catch (err: any) {
    console.log(err);
  }
}

export function* theoDoiLikeCommentPostSaga() {
  yield takeLatest(LIKE_COMMENT_POST_SAGA, likeCommentPostSaga);
}

// Dislike comment post Saga
export function* dislikeCommentPostSaga({ payload }: any) {
  try {
    const { status } = yield postService.dislikeCommentPost(
      payload.id,
      payload.comment
    );
    if (status === STATUS_CODE.SUCCESS) {
      // yield put(
      //   GET_POST_BY_ID_SAGA({
      //     id: payload.postID,
      //   }),
      // );
    }
  } catch (err: any) {
    console.log(err);
  }
}

export function* theoDoiDislikeCommentPostSaga() {
  yield takeLatest(DISLIKE_COMMENT_POST_SAGA, dislikeCommentPostSaga);
}
