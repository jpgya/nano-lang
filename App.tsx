import React, { useState } from 'react';
import { ViewState } from './types';
import { INITIAL_CODE } from './constants';
import { LandingPage } from './components/LandingPage';
import { CodeEditor } from './components/CodeEditor';
import { LanguageProvider } from './contexts/LanguageContext';
import { AuthProvider } from './contexts/AuthContext';

function AppContent() {
  const [viewState, setViewState] = useState<ViewState>(ViewState.LANDING);

  return (
    <>
      {viewState === ViewState.LANDING && (
        <LandingPage onStart={() => setViewState(ViewState.EDITOR)} />
      )}
      {viewState === ViewState.EDITOR && (
        <CodeEditor 
          initialCode={INITIAL_CODE} 
          onBack={() => setViewState(ViewState.LANDING)}
        />
      )}
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <AppContent />
      </LanguageProvider>
    </AuthProvider>
  );
}

export default App;