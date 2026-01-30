export enum ViewState {
  LANDING = 'LANDING',
  EDITOR = 'EDITOR'
}

export interface CompilerResult {
  jsCode: string;
  logs: string[];
  error?: string;
}

export interface ExampleCode {
  name: string;
  code: string;
}

export interface NanoToken {
  type: 'KEYWORD' | 'STRING' | 'NUMBER' | 'IDENTIFIER' | 'OPERATOR' | 'UNKNOWN';
  value: string;
}

export type Language = 'en' | 'ja';

export interface UserProfile {
  username: string;
  email: string;
}

export interface NanoFile {
  id: string;
  name: string;
  content: string;
}

export interface TutorialStep {
  target: string; // CSS selector
  title: string;
  content: string;
  position: 'top' | 'bottom' | 'left' | 'right';
}