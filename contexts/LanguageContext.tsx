import React, { createContext, useContext, useState } from 'react';
import { Language } from '../types';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    heroTag: "The World's Simplest Coding Language",
    heroTitle: "Coding made",
    heroTitleAccent: "Super Simple",
    heroDesc: "NanoLang is designed for absolute beginners. Write English-like commands, see them turn into real JavaScript, and run them instantly.",
    startBtn: "Start Coding Now",
    githubBtn: "View on GitHub",
    featExecTitle: "Instant Execution",
    featExecDesc: "No installing compilers. Write code in your browser and see results immediately.",
    featTranspileTitle: "Transpiles to JS",
    featTranspileDesc: "See how your simple Nano code translates into actual JavaScript code in real-time.",
    featAiTitle: "AI Assistant",
    featAiDesc: "Stuck? Ask the built-in AI to write code for you or explain what's happening.",
    editorTitle: "Nano IDE",
    loadExample: "Examples",
    askAiPlaceholder: "Ask AI...",
    runCode: "Run",
    running: "Running...",
    inputLabel: "Active File",
    explainCode: "Explain",
    generatedJs: "Transpiled JS",
    terminal: "Terminal",
    downloadJs: "Export JS",
    downloadNano: "Save",
    quickDocs: "Docs",
    aiExplainTitle: "AI Explanation",
    close: "Close",
    noOutput: "(No output)",
    ready: "Ready...",
    syntaxSay: "Print text",
    syntaxSet: "Variable",
    syntaxRepeat: "Loop",
    syntaxCheck: "If check",
    syntaxEnd: "Close block",
    login: "Login",
    logout: "Logout",
    welcomeUser: "Hi, ",
    files: "Files",
    newFile: "New File",
    deleteFile: "Delete",
    importJs: "Import JS",
    importJsDesc: "Paste JavaScript code to convert it to NanoLang.",
    convert: "Convert",
    converting: "Converting...",
    tutorialStart: "Start Tour",
    tourStep1: "File Explorer",
    tourContent1: "Manage multiple files here. Click '+' to create a new one.",
    tourStep2: "Editor",
    tourContent2: "Write your NanoLang code here. AI can help you!",
    tourStep3: "Run & Export",
    tourContent3: "Run your code instantly or export it as JavaScript.",
    tourStep4: "AI Tools",
    tourContent4: "Use this input to ask the AI to write code for you.",
    next: "Next",
    finish: "Finish",
    cancel: "Cancel",
  },
  ja: {
    heroTag: "世界で一番シンプルなプログラミング言語",
    heroTitle: "プログラミングを",
    heroTitleAccent: "超・簡単に",
    heroDesc: "NanoLangは初心者のために作られました。英語に近いコマンドを書くだけで、JavaScriptに変換され、すぐに実行できます。",
    startBtn: "今すぐ始める",
    githubBtn: "GitHubを見る",
    featExecTitle: "瞬時に実行",
    featExecDesc: "コンパイラのインストールは不要。ブラウザで書いて、その場で結果を確認できます。",
    featTranspileTitle: "JSへの変換",
    featTranspileDesc: "シンプルなNanoコードが、リアルタイムでJavaScriptに変換される様子を見ることができます。",
    featAiTitle: "AIアシスタント",
    featAiDesc: "困ったらAIに聞いてみましょう。コードを書いてくれたり、意味を解説してくれます。",
    editorTitle: "Nano IDE",
    loadExample: "サンプル",
    askAiPlaceholder: "AIに依頼...",
    runCode: "実行",
    running: "実行中...",
    inputLabel: "編集中のファイル",
    explainCode: "解説",
    generatedJs: "変換されたJS",
    terminal: "ターミナル",
    downloadJs: "JS出力",
    downloadNano: "保存",
    quickDocs: "ドキュメント",
    aiExplainTitle: "AIによる解説",
    close: "閉じる",
    noOutput: "(出力なし)",
    ready: "準備完了...",
    syntaxSay: "文字を表示",
    syntaxSet: "変数を作る",
    syntaxRepeat: "繰り返し",
    syntaxCheck: "条件チェック",
    syntaxEnd: "ブロック終了",
    login: "ログイン",
    logout: "ログアウト",
    welcomeUser: "ようこそ、",
    files: "ファイル一覧",
    newFile: "新規作成",
    deleteFile: "削除",
    importJs: "JSから変換",
    importJsDesc: "JavaScriptコードを貼り付けると、NanoLangに変換します。",
    convert: "変換する",
    converting: "変換中...",
    tutorialStart: "ツアー開始",
    tourStep1: "ファイル管理",
    tourContent1: "ここで複数のファイルを管理できます。「+」で新規作成します。",
    tourStep2: "エディタ",
    tourContent2: "ここでコードを書きます。AIアシストも利用可能です。",
    tourStep3: "実行と出力",
    tourContent3: "コードをすぐに実行したり、JSとして書き出せます。",
    tourStep4: "AIツール",
    tourContent4: "ここにやりたいことを書くと、AIがコードを生成してくれます。",
    next: "次へ",
    finish: "完了",
    cancel: "キャンセル",
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('ja');

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};