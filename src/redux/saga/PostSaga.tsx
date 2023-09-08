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
  SAVE_REPLY_SAGA,
  SAVE_COMMENT_POSTSHARE_SAGA,
  LIKE_POSTSHARE_SAGA,
  SAVE_REPLY_POSTSHARE_SAGA,
  GET_POST_BY_ID_SAGA,
  GET_POSTSHARE_BY_ID_SAGA,
  GET_ALL_POST_SAGA,
  INCREASE_VIEW_SAGA,
  INCREASE_VIEW_SHARE_SAGA,
  LIKE_COMMENT_POST_SAGA,
  DISLIKE_COMMENT_POST_SAGA,
} from '@/redux/ActionSaga/PostActionSaga';
import { setOwnerInfo, setPost, setPostArr, updatePosts } from '@/redux/Slice/PostSlice';
import { setUser } from '@/redux/Slice/UserSlice';
import { closeDrawer, setLoading } from '@/redux/Slice/DrawerHOCSlice';

import { postService } from '@/services/PostService';
import { STATUS_CODE } from '@/util/constants/SettingSystem';

// Get All Post By User ID Saga
export function* getAllPostByUserIDSaga({ payload }: any) {
  try {
    const id = payload.userId;
    const { data, status } = yield call(postService.getAllPostByUserID, id);
    if (status === STATUS_CODE.SUCCESS) {
      yield put(setPostArr(data.content));
      yield put(setOwnerInfo(data.content));
      yield put(setUser(data.content));
    }
  } catch (err: any) {
    console.log(err.response.data);
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
      // yield put(setAllPost(data.content));
      yield put(setPostArr(data.content));
      yield put(setUser(data.content));
    }
  } catch (err: any) {
    console.log(err.response.data);
  }
}

export function* theoDoiGetAllPostSaga() {
  yield takeLatest(GET_ALL_POST_SAGA, getAllPostSaga);
}

// Get Post By ID Saga
export function* getPostByIdSaga({ payload }: any) {
  try {
    const id = payload.id;
    const { data, status } = yield postService.getPostById(id);
    if (status === STATUS_CODE.SUCCESS) {
      yield put(setPost(data.content));
      yield put(updatePosts(data.content));
      yield put(setUser(data.content));
    }
  } catch (err: any) {
    console.log(err.response.data);
  }
}

export function* theoDoiGetPostByIdSaga() {
  yield takeLatest(GET_POST_BY_ID_SAGA, getPostByIdSaga);
}

// Get PostShare By ID Saga
export function* getPostShareByIdSaga({ payload }: any) {
  try {
    const id = payload.id;
    const { data, status } = yield postService.getPostShareById(id);
    if (status === STATUS_CODE.SUCCESS) {
      yield put(setPost(data.content));
      yield put(updatePosts(data.content));
      yield put(setUser(data.content));
    }
  } catch (err: any) {
    console.log(err.response.data);
  }
}

export function* theoDoiGetPostShareByIdSaga() {
  yield takeLatest(GET_POSTSHARE_BY_ID_SAGA, getPostShareByIdSaga);
}

// createPostSaga Saga
function* createPostSaga({ payload }: any) {
  try {
    const postCreate = {
      title: payload.postCreate.title,
      content: payload.postCreate.content,
      linkImage: payload.linkImage,
    };
    const { data, status } = yield postService.createPost(postCreate);
    if (status === STATUS_CODE.CREATED) {
      const isInProfile: boolean = yield select((state) => state.postReducer.isInProfile);
      if (isInProfile) {
        yield put(
          GET_ALL_POST_BY_USERID_SAGA({
            userId: 'me',
          }),
        );
      } else {
        yield put(GET_ALL_POST_SAGA());
      }
    }
  } catch (err: any) {
    console.log(err.response.data);
  }
}

export function* theoDoiCreatePostSaga() {
  yield takeLatest(CREATE_POST_SAGA, createPostSaga);
}

// Update Post Saga
export function* updatePostSaga({ payload }: any) {
  try {
    const { data, status } = yield postService.updatePost(payload.id, payload.postUpdate);
    if (status === STATUS_CODE.SUCCESS) {
      yield put(
        GET_POST_BY_ID_SAGA({
          id: payload.id,
        }),
      );
      yield put(setLoading(false));
      yield put(closeDrawer({}));
    }
  } catch (err: any) {
    console.log(err.response.data);
  }
}

export function* theoDoiUpdatePostSaga() {
  yield takeLatest(UPDATE_POST_SAGA, updatePostSaga);
}

// Save Comment Saga
export function* saveCommentSaga({ payload }: any) {
  try {
    const { data, status } = yield postService.saveComment(payload.id, payload.comment);
    if (status === STATUS_CODE.SUCCESS) {
      yield put(
        GET_POST_BY_ID_SAGA({
          id: payload.id,
        }),
      );
    }
  } catch (err: any) {
    console.log(err.response.data);
  }
}

export function* theoDoiSaveCommentSaga() {
  yield takeLatest(SAVE_COMMENT_SAGA, saveCommentSaga);
}

// Save Reply Saga
export function* saveReplySaga({ payload }: any) {
  try {
    const { data, status } = yield postService.saveReply(payload.id, payload.reply);
    if (status === STATUS_CODE.SUCCESS) {
      yield put(
        GET_POST_BY_ID_SAGA({
          id: payload.id,
        }),
      );
    }
  } catch (err: any) {
    console.log(err.response.data);
  }
}

export function* theoDoiSaveReplySaga() {
  yield takeLatest(SAVE_REPLY_SAGA, saveReplySaga);
}

// Delete Post Saga
export function* deletePostSaga({ payload }: any) {
  try {
    const { data, status } = yield postService.deletePost(payload);
    if (status === STATUS_CODE.SUCCESS) {
      yield put(
        GET_ALL_POST_BY_USERID_SAGA({
          userId: 'me',
        }),
      );
    }
  } catch (err: any) {
    console.log(err.response.data);
  }
}

export function* theoDoiDeletePostSaga() {
  yield takeLatest(DELETE_POST_SAGA, deletePostSaga);
}

// Save comment postshare Saga
export function* saveCommentPostShareSaga({ payload }: any) {
  try {
    const { data, status } = yield postService.saveCommentPostShare(payload.id, payload.comment);
    if (status === STATUS_CODE.SUCCESS) {
      yield put(
        GET_POSTSHARE_BY_ID_SAGA({
          id: payload.id,
        }),
      );
    }
  } catch (err: any) {
    console.log(err.response.data);
  }
}

export function* theoDoiSaveCommentPostShareSaga() {
  yield takeLatest(SAVE_COMMENT_POSTSHARE_SAGA, saveCommentPostShareSaga);
}

// Save Reply PostShare Saga
export function* saveReplyPostShareSaga({ payload }: any) {
  try {
    const { data, status } = yield postService.saveReplyPostShare(payload.id, payload.reply);
    if (status === STATUS_CODE.SUCCESS) {
      yield put(
        GET_POSTSHARE_BY_ID_SAGA({
          id: payload.id,
        }),
      );
    }
  } catch (err: any) {
    console.log(err.response.data);
  }
}

export function* theoDoiSaveReplyPostShareSaga() {
  yield takeLatest(SAVE_REPLY_POSTSHARE_SAGA, saveReplyPostShareSaga);
}

// Like Post Saga
export function* likePostSaga({ payload }: any) {
  try {
    const { data, status } = yield postService.likePost(payload.id);
    if (status === STATUS_CODE.SUCCESS) {
      yield put(
        GET_POST_BY_ID_SAGA({
          id: payload.id,
        }),
      );
    }
  } catch (err: any) {
    console.log(err.response.data);
  }
}

export function* theoDoiLikePostSaga() {
  yield takeLatest(LIKE_POST_SAGA, likePostSaga);
}

// Share Post Saga
export function* sharePostSaga({ payload }: any) {
  try {
    const { data, status } = yield postService.sharePost(payload.id);

    if (status === STATUS_CODE.SUCCESS) {
      const isInProfile: boolean = yield select((state) => state.postReducer.isInProfile);
      if (isInProfile) {
        yield put(
          GET_ALL_POST_BY_USERID_SAGA({
            userId: 'me',
          }),
        );
      }
    }
  } catch (err: any) {
    console.log(err.response.data);
  }
}

export function* theoDoiSharePostSaga() {
  yield takeLatest(SHARE_POST_SAGA, sharePostSaga);
}

// Like post share Saga
export function* likePostShareSaga({ payload }: any) {
  try {
    const { data, status } = yield postService.likePostShare(payload.id);
    if (status === STATUS_CODE.SUCCESS) {
      yield put(
        GET_POSTSHARE_BY_ID_SAGA({
          id: payload.id,
        }),
      );
    }
  } catch (err: any) {
    console.log(err.response.data);
  }
}

export function* theoDoiLikePostShareSaga() {
  yield takeLatest(LIKE_POSTSHARE_SAGA, likePostShareSaga);
}

// Save Post Saga
export function* savePostSaga({ payload }: any) {
  try {
    const { data, status } = yield postService.savePost(payload.id);
    if (status === STATUS_CODE.SUCCESS) {
      yield put(
        GET_POST_BY_ID_SAGA({
          id: payload.id,
        }),
      );
    }
  } catch (err: any) {
    console.log(err.response.data);
  }
}

export function* theoDoiSavePostSaga() {
  yield takeLatest(SAVE_POST_SAGA, savePostSaga);
}

// Increase View Post Saga
export function* increaseViewPostSaga({ payload }: any) {
  try {
    const { data, status } = yield postService.increaseViewPost(payload.id);
    if (status === STATUS_CODE.SUCCESS) {
      // yield put(
      //   GET_POST_BY_ID_SAGA({
      //     id: payload.id,
      //   }),
      // );
    }
  } catch (err: any) {
    console.log(err.response.data);
  }
}

export function* theoDoiIncreaseViewPostSaga() {
  yield takeLatest(INCREASE_VIEW_SAGA, increaseViewPostSaga);
}

// Increase View PostShare Saga
export function* increaseViewPostShareSaga({ payload }: any) {
  try {
    const { data, status } = yield postService.increaseViewPostShare(payload.id);
    if (status === STATUS_CODE.SUCCESS) {
      // yield put(
      //   GET_POSTSHARE_BY_ID_SAGA({
      //     id: payload.id,
      //   }),
      // );
    }
  } catch (err: any) {
    console.log(err.response.data);
  }
}

export function* theoDoiIncreaseViewPostShareSaga() {
  yield takeLatest(INCREASE_VIEW_SHARE_SAGA, increaseViewPostShareSaga);
}

// Like comment post Saga
export function* likeCommentPostSaga({ payload }: any) {
  try {
    const { data, status } = yield postService.likeCommentPost(payload.idComment);
    if (status === STATUS_CODE.SUCCESS) {
      // yield put(
      //   GET_POST_BY_ID_SAGA({
      //     id: payload.postID,
      //   }),
      // );
    }
  } catch (err: any) {
    console.log(err.response.data);
  }
}

export function* theoDoiLikeCommentPostSaga() {
  yield takeLatest(LIKE_COMMENT_POST_SAGA, likeCommentPostSaga);
}

// Dislike comment post Saga
export function* dislikeCommentPostSaga({ payload }: any) {
  try {
    const { data, status } = yield postService.dislikeCommentPost(payload.idComment);
    if (status === STATUS_CODE.SUCCESS) {
      // yield put(
      //   GET_POST_BY_ID_SAGA({
      //     id: payload.postID,
      //   }),
      // );
    }
  } catch (err: any) {
    console.log(err.response.data);
  }
}

export function* theoDoiDislikeCommentPostSaga() {
  yield takeLatest(DISLIKE_COMMENT_POST_SAGA, dislikeCommentPostSaga);
}
