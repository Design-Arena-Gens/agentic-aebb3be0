export type VideoStyle = 'educational' | 'storytelling' | 'cinematic' | 'listicle' | 'tutorial' | 'news';
export type AudienceLevel = 'beginner' | 'intermediate' | 'advanced';
export type Tone = 'friendly' | 'authoritative' | 'humorous' | 'inspiring' | 'casual' | 'formal';

export interface GenerateInput {
  topic: string;
  durationMinutes: number; // target duration in minutes
  style: VideoStyle;
  audience: AudienceLevel;
  tone: Tone;
  language?: string; // BCP-47 like 'en'
}

export interface Idea {
  title: string;
  hook: string;
  angle: string;
  valueProps: string[];
}

export interface OutlineSection {
  id: string;
  title: string;
  bullets: string[];
}

export type SegmentType = 'intro' | 'section' | 'outro';

export interface ScriptSegment {
  id: string;
  type: SegmentType;
  sectionIndex: number; // -1 for intro, N for sections, 999 for outro
  start: string; // HH:MM:SS.mmm
  end: string;   // HH:MM:SS.mmm
  onScreenText: string;
  voiceover: string;
  brollSuggestions: string[];
  soundDesign: string[];
}

export interface Script {
  segments: ScriptSegment[];
  duration: string; // HH:MM:SS.mmm
}

export interface ImagePrompt {
  id: string;
  purpose: 'thumbnail' | 'scene' | 'broll' | 'background';
  prompt: string;
  alt: string;
  suggestedSource?: string; // Unsplash query URL
}

export interface Images {
  thumbnail: ImagePrompt;
  gallery: ImagePrompt[]; // includes scenes and b-roll prompts
}

export interface Voiceover {
  language: string;
  plain: string; // plain text
  ssml: string;  // SSML version
}

export interface TimelineEvent {
  segmentId: string;
  start: string;
  end: string;
  video: {
    action: 'cut' | 'broll' | 'hold' | 'zoom' | 'pan' | 'overlay';
    notes: string;
  }[];
  audio: {
    action: 'vo' | 'sfx' | 'music';
    notes: string;
  }[];
}

export interface EditingInstructions {
  fps: number;
  aspectRatio: '16:9' | '9:16' | '1:1';
  captions: { enabled: boolean; position: 'bottom' | 'center' | 'top'; style: 'boxed' | 'highlight' | 'karaoke' };
  music: { mood: string; volumeDb: number };
  timeline: TimelineEvent[];
}

export interface Chapter {
  time: string; // 0:00 format
  title: string;
}

export interface Metadata {
  title: string;
  description: string;
  tags: string[];
  keywords: string[];
  chapters: Chapter[];
  thumbnailText: string;
  thumbnailPrompt: string;
  uploadChecklist: string[];
}

export interface GenerationResult {
  input: GenerateInput;
  idea: Idea;
  outline: OutlineSection[];
  script: Script;
  images: Images;
  voiceover: Voiceover;
  editing: EditingInstructions;
  metadata: Metadata;
}
