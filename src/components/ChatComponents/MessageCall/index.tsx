import '@livekit/components-styles';
import { LiveKitRoom, useTracks, GridLayout, RoomAudioRenderer, ControlBar } from '@livekit/components-react';
import { Track } from 'livekit-client';
import { useLayoutEffect } from 'react';
import { useParams } from 'react-router-dom';

import { useMessageCall } from '@/hooks/fetch';
import { useAppSelector } from '@/hooks/special';
import { Socket } from '@/util/constants/SettingSystem';
import { ISocketCall } from '@/types';
import { ParticipantTile } from './ParticipantTile';

const serverUrl = import.meta.env.VITE_LK_SERVER_URL;

export const VideoCall = () => {
  const conversationID = useParams<{ conversationID: string }>().conversationID;

  const { dataMessageCall: dataVideo } = useMessageCall(conversationID, 'video');

  const { chatSocket } = useAppSelector((state) => state.socketIO);

  const onDisconnected = () => {
    chatSocket.emit(Socket.LEAVE_VIDEO_CALL, { ...dataVideo });
    window.close();
  };

  useLayoutEffect(() => {
    chatSocket.on(Socket.END_VIDEO_CALL, (data: ISocketCall) => {
      if (data.conversation_id === conversationID && !window.closed) {
        window.close();
      }
    });
  }, []);

  return (
    <LiveKitRoom
      connect
      audio
      video
      token={dataVideo?.token}
      serverUrl={serverUrl}
      data-lk-theme='default'
      onConnected={() => chatSocket.emit(Socket.VIDEO_CALL, { ...dataVideo })}
      onDisconnected={onDisconnected}
      options={{ adaptiveStream: true, disconnectOnPageLeave: true, dynacast: true }}
      style={{ height: '100vh' }}>
      <VideoConference />
      <RoomAudioRenderer />
      <ControlBar variation='minimal' />
    </LiveKitRoom>
  );
};

export const VoiceCall = () => {
  const conversationID = useParams<{ conversationID: string }>().conversationID;

  const { dataMessageCall: dataAudio } = useMessageCall(conversationID, 'audio');

  const { chatSocket } = useAppSelector((state) => state.socketIO);

  const onDisconnected = () => {
    chatSocket.emit(Socket.LEAVE_VOICE_CALL, { ...dataAudio });
    window.close();
  };

  useLayoutEffect(() => {
    chatSocket.on(Socket.END_VOICE_CALL, (data: ISocketCall) => {
      if (data.conversation_id === conversationID && !window.closed) {
        window.close();
      }
    });
  }, []);

  return (
    <LiveKitRoom
      connect
      audio
      token={dataAudio?.token}
      serverUrl={serverUrl}
      data-lk-theme='default'
      onConnected={() => chatSocket.emit(Socket.VOICE_CALL, { ...dataAudio })}
      onDisconnected={onDisconnected}
      options={{ adaptiveStream: true, disconnectOnPageLeave: true, dynacast: true }}
      style={{ height: '100vh' }}>
      <AudioConference />
      <RoomAudioRenderer />
      <ControlBar variation='minimal' controls={{ chat: false, camera: false, screenShare: false }} />
    </LiveKitRoom>
  );
};

const VideoConference = () => {
  const tracks = useTracks(
    [
      { source: Track.Source.Camera, withPlaceholder: true },
      { source: Track.Source.ScreenShare, withPlaceholder: false }
    ],
    { onlySubscribed: false }
  );

  return (
    <GridLayout tracks={tracks} style={{ height: 'calc(100vh - var(--lk-control-bar-height))' }}>
      <ParticipantTile />
    </GridLayout>
  );
};

const AudioConference = () => {
  const tracks = useTracks([{ source: Track.Source.Camera, withPlaceholder: true }], {
    onlySubscribed: false
  });

  return (
    <GridLayout tracks={tracks} style={{ height: 'calc(100vh - var(--lk-control-bar-height))' }}>
      <ParticipantTile />
    </GridLayout>
  );
};
