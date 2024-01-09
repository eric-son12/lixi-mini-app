import { AccountDto, NotificationDto as Notification } from '@models/index';
import { NOTIFICATION_TYPES } from '@models/constants';
import { SessionAction, SessionActionEnum } from '@models/lib/sessionAction';
import { callConfig } from '@context/shareContext';
// import { PageMessageSession } from '@generated/types.generated';
import { getAccountById, getSelectedAccount } from '@local-store/account/selectors';
// import { setPageMessageSession } from '@store/page/action';
// import { setNewPostAvailable } from '@store/post/actions';
import { eventChannel } from 'redux-saga';
import { all, call, fork, put, put as putAction, race, select, take, takeLatest } from 'redux-saga/effects';
import { Socket } from 'socket.io-client';
// import { downloadExportedLixi, refreshLixiSilent } from '../lixi/actions';
// import { api as messageApi } from '../message/message.api';
// import { api as pageMessageApi } from '../message/pageMessageSession.api';
// import { receiveNotification } from '../notification/actions';
// import { upsertPageMessageSession } from '@store/message';
// import { showToast } from '../toast/actions';
import { connectToChannels } from './actions';

function createNotificationSocketChannel(socket: Socket) {
  return eventChannel(emit => {
    const handler = (data: Notification) => {
      emit(data);
    };
    socket.on('notification', handler);
    return () => {
      socket.off('notification', handler);
    };
  });
}

// WebSocket Saga
function* connectToChannelsSaga() {
  const socket = callConfig.call.socketContext;
  const notificationSocketChannel = yield call(createNotificationSocketChannel, socket);

  while (true) {
    const { notification } = yield race({
      notification: take(notificationSocketChannel)
    });

    if (notification) {
      yield receiveNewNotification(notification);
    }
  }
}

function* receiveNewNotification(payload: Notification) {
  try {
    const { message, notificationTypeId, additionalData } = payload;
    const { parentId, mnemonicHash, fileName, id } = additionalData as any;

    if (message) {
      // yield put(
      //   showToast('info', {
      //     message: 'Info',
      //     description: message,
      //     duration: 5
      //   })
      // );
      // yield put(receiveNotification(payload));
    }
  } catch (error) {
    console.log('error', error.message);
  }
}

function* watchConnectToChannels() {
  yield takeLatest(connectToChannels.type, connectToChannelsSaga);
}

export function* websocketSaga() {
  if (typeof window === 'undefined') {
    yield all([]);
  } else {
    yield all([fork(watchConnectToChannels)]);
  }
}
