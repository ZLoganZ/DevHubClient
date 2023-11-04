import '@livekit/components-styles';
import { LiveKitRoom, useTracks, GridLayout, RoomAudioRenderer, ControlBar } from '@livekit/components-react';
import { Track } from 'livekit-client';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { useMessageCall } from '@/hooks/fetch';
import { useAppSelector } from '@/hooks/special';
import { LEAVE_VIDEO_CALL, LEAVE_VOICE_CALL, VIDEO_CALL, VOICE_CALL } from '@/util/constants/SettingSystem';
import { ParticipantTile } from './ParticipantTile';

const serverUrl = import.meta.env.VITE_LK_SERVER_URL;

export const VideoCall = () => {
  const conversationID = useParams<{ conversationID: string }>().conversationID;

  const { dataMessageCall: dataVideo, isLoadingMessageCall } = useMessageCall(conversationID, 'video');

  const { chatSocket } = useAppSelector((state) => state.socketIO);

  useEffect(() => {
    if (isLoadingMessageCall || !dataVideo) return;

    chatSocket.emit(VIDEO_CALL, { ...dataVideo, conversation_id: conversationID });
  }, [dataVideo, isLoadingMessageCall]);

  const onDisconnected = () => {
    chatSocket.emit(LEAVE_VIDEO_CALL, { ...dataVideo, conversation_id: conversationID });

    window.close();
  };

  return (
    <LiveKitRoom
      connect
      audio
      video
      token={dataVideo?.token}
      serverUrl={serverUrl}
      data-lk-theme='default'
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

  const { dataMessageCall: dataAudio, isLoadingMessageCall } = useMessageCall(conversationID, 'audio');

  const { chatSocket } = useAppSelector((state) => state.socketIO);

  useEffect(() => {
    if (isLoadingMessageCall || !dataAudio) return;

    chatSocket.emit(VOICE_CALL, { ...dataAudio, conversation_id: conversationID });
  }, [dataAudio, isLoadingMessageCall]);

  const onDisconnected = () => {
    chatSocket.emit(LEAVE_VOICE_CALL, { ...dataAudio, conversation_id: conversationID });
    window.close();
  };

  document.addEventListener('close', () => {
    chatSocket.emit(LEAVE_VOICE_CALL, { ...dataAudio, conversation_id: conversationID });
  });

  return (
    <LiveKitRoom
      connect
      audio
      token={dataAudio?.token}
      serverUrl={serverUrl}
      data-lk-theme='default'
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
