import '@livekit/components-styles';
import {
  LiveKitRoom,
  useTracks,
  GridLayout,
  ParticipantTile,
  RoomAudioRenderer,
  ControlBar
} from '@livekit/components-react';
import { Track } from 'livekit-client';
import { useParams } from 'react-router-dom';

import { useMessageCall } from '@/hooks/fetch';

const serverUrl = import.meta.env.VITE_LK_SERVER_URL;

const onDisconnected = () => {
  window.close();
};

export const VideoCall = () => {
  const conversationID = useParams<{ conversationID: string }>().conversationID;

  const { tokenMessageCall: tokenVideo } = useMessageCall(conversationID, 'video');

  return (
    <LiveKitRoom
      connect
      audio
      video
      token={tokenVideo}
      connectOptions={{ autoSubscribe: false }}
      serverUrl={serverUrl}
      data-lk-theme='default'
      onDisconnected={onDisconnected}
      options={{ adaptiveStream: true, disconnectOnPageLeave: true }}
      style={{ height: '100vh' }}>
      <VideoConference />
      <RoomAudioRenderer />
      <ControlBar variation='minimal' />
    </LiveKitRoom>
  );
};

export const AudioCall = () => {
  const conversationID = useParams<{ conversationID: string }>().conversationID;

  const { tokenMessageCall: tokenAudio } = useMessageCall(conversationID, 'audio');

  return (
    <LiveKitRoom
      connect
      audio
      video={false}
      token={tokenAudio}
      connectOptions={{ autoSubscribe: false }}
      serverUrl={serverUrl}
      data-lk-theme='default'
      onDisconnected={onDisconnected}
      options={{ adaptiveStream: true, disconnectOnPageLeave: true }}
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
    onlySubscribed: true
  });

  return (
    <GridLayout tracks={tracks} style={{ height: 'calc(100vh - var(--lk-control-bar-height))' }}>
      <ParticipantTile />
    </GridLayout>
  );
};
