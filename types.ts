export type ThemeColor = 'rose' | 'violet' | 'teal' | 'amber' | 'emerald' | 'slate';

export interface Theme {
  id: ThemeColor;
  name: string;
  primary: string;
  secondary: string;
  accent: string;
  bg: string;
  text: string;
  card: string;
}

export type ContentType = 'welcome' | 'checklist' | 'guide' | 'kit';

export interface GeneratedResponse {
  content: string;
  moodColors: string[];
  moodName: string;
}

export interface GeneratedContent extends GeneratedResponse {
  id: string;
  type: ContentType;
  timestamp: number;
}

export interface Folder {
  id: string;
  name: string;
  count: number;
  color: string;
}

export type Platform = 'Slack' | 'Email' | 'Notion' | 'PDF';