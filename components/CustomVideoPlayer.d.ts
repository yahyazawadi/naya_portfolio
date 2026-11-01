import { ComponentType } from 'react';

export interface CustomVideoPlayerProps {
  videoUrl?: string;
  src?: string;
  videoLoading?: boolean;
  lessonTitle?: string;
  title?: string;
  poster?: string;
  className?: string;
  autoPlay?: boolean;
  loop?: boolean;
  muted?: boolean;
  playsInline?: boolean;
  controlsAlwaysHidden?: boolean;
  objectFit?: 'contain' | 'cover';
  lang?: string;
  userId?: string | null;
  lessonId?: string | null;
  courseId?: string | null;
  tracks?: Array<{ id: string; label?: string; srclang?: string; src?: string; content?: string }>;
  onEnded?: () => void;
  onLoadedData?: () => void;
  onVideoCompleted?: () => void;
}

export declare const CustomVideoPlayer: ComponentType<CustomVideoPlayerProps>;
export default CustomVideoPlayer;
