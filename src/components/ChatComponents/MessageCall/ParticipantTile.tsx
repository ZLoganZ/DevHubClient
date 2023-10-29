import * as React from 'react';
import type { Participant, TrackPublication } from 'livekit-client';
import { Track } from 'livekit-client';
import type { ParticipantClickEvent, TrackReferenceOrPlaceholder } from '@livekit/components-core';
import { isTrackReference, isTrackReferencePinned } from '@livekit/components-core';
import {
  AudioTrack,
  ConnectionQualityIndicator,
  FocusToggle,
  ParticipantContext,
  ParticipantName,
  TrackMutedIndicator,
  TrackRefContext,
  VideoTrack,
  useEnsureParticipant,
  useFeatureContext,
  useMaybeLayoutContext,
  useMaybeParticipantContext,
  useMaybeTrackRefContext,
  useParticipantTile
} from '@livekit/components-react';
import SvgScreenShareIcon from '@/util/Descriptions/ScreenShareIcon';
import getImageURL from '@/util/getImageURL';

export function ParticipantContextIfNeeded(
  props: React.PropsWithChildren<{
    participant?: Participant;
  }>
) {
  const hasContext = !!useMaybeParticipantContext();
  return props.participant && !hasContext ? (
    <ParticipantContext.Provider value={props.participant}>{props.children}</ParticipantContext.Provider>
  ) : (
    <>{props.children}</>
  );
}

function TrackRefContextIfNeeded(
  props: React.PropsWithChildren<{
    trackRef?: TrackReferenceOrPlaceholder;
  }>
) {
  const hasContext = !!useMaybeTrackRefContext();
  return props.trackRef && !hasContext ? (
    <TrackRefContext.Provider value={props.trackRef}>{props.children}</TrackRefContext.Provider>
  ) : (
    <>{props.children}</>
  );
}

export interface ParticipantTileProps extends React.HTMLAttributes<HTMLDivElement> {
  /** The track reference to display. */
  trackRef?: TrackReferenceOrPlaceholder;
  disableSpeakingIndicator?: boolean;
  /** @deprecated This parameter will be removed in a future version use `trackRef` instead. */
  participant?: Participant;
  /** @deprecated This parameter will be removed in a future version use `trackRef` instead. */
  source?: Track.Source;
  /** @deprecated This parameter will be removed in a future version use `trackRef` instead. */
  publication?: TrackPublication;
  onParticipantClick?: (event: ParticipantClickEvent) => void;
}

export function ParticipantTile({
  trackRef,
  participant,
  children,
  source = Track.Source.Camera,
  onParticipantClick,
  publication,
  disableSpeakingIndicator,
  ...htmlProps
}: ParticipantTileProps) {
  const maybeTrackRef = useMaybeTrackRefContext();
  const p = useEnsureParticipant(participant);
  const trackReference: TrackReferenceOrPlaceholder = React.useMemo(() => {
    return {
      participant: trackRef?.participant ?? maybeTrackRef?.participant ?? p,
      source: trackRef?.source ?? maybeTrackRef?.source ?? source,
      publication: trackRef?.publication ?? maybeTrackRef?.publication ?? publication
    };
  }, [maybeTrackRef, p, publication, source, trackRef]);

  const { elementProps } = useParticipantTile<HTMLDivElement>({
    participant: trackReference.participant,
    htmlProps,
    source: trackReference.source,
    publication: trackReference.publication,
    disableSpeakingIndicator,
    onParticipantClick
  });

  const layoutContext = useMaybeLayoutContext();

  const autoManageSubscription = useFeatureContext()?.autoSubscription;

  const handleSubscribe = React.useCallback(
    (subscribed: boolean) => {
      if (
        trackReference.source &&
        !subscribed &&
        layoutContext &&
        layoutContext.pin.dispatch &&
        isTrackReferencePinned(trackReference, layoutContext.pin.state)
      ) {
        layoutContext.pin.dispatch({ msg: 'clear_pin' });
      }
    },
    [trackReference, layoutContext]
  );

  return (
    <div style={{ position: 'relative' }} {...elementProps}>
      <TrackRefContextIfNeeded trackRef={trackReference}>
        <ParticipantContextIfNeeded participant={trackReference.participant}>
          {children ?? (
            <>
              {isTrackReference(trackReference) &&
              (trackReference.publication?.kind === 'video' ||
                trackReference.source === Track.Source.Camera ||
                trackReference.source === Track.Source.ScreenShare) ? (
                <VideoTrack
                  trackRef={trackReference}
                  onSubscriptionStatusChanged={handleSubscribe}
                  manageSubscription={autoManageSubscription}
                />
              ) : (
                isTrackReference(trackReference) && (
                  <AudioTrack trackRef={trackReference} onSubscriptionStatusChanged={handleSubscribe} />
                )
              )}
              <div className='lk-participant-placeholder'>
                <img
                  src={getImageURL(trackReference.participant.metadata!)}
                  alt='avatar'
                  style={{
                    width: '320px',
                    height: '320px',
                    overflow: 'hidden',
                    objectFit: 'cover',
                    borderRadius: '9999px'
                  }}
                />
              </div>
              <div className='lk-participant-metadata'>
                <div className='lk-participant-metadata-item'>
                  {trackReference.source === Track.Source.Camera ? (
                    <>
                      <TrackMutedIndicator
                        source={Track.Source.Microphone}
                        show={'muted'}></TrackMutedIndicator>
                      <ParticipantName />
                    </>
                  ) : (
                    <>
                      <SvgScreenShareIcon style={{ marginRight: '0.25rem' }} />
                      <ParticipantName>&apos;s screen</ParticipantName>
                    </>
                  )}
                </div>
                <ConnectionQualityIndicator className='lk-participant-metadata-item' />
              </div>
            </>
          )}
          <FocusToggle trackRef={trackReference} />
        </ParticipantContextIfNeeded>
      </TrackRefContextIfNeeded>
    </div>
  );
}
