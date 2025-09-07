import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import type { ReactElement } from 'react';
import Login from './pages/Login';
import Local from './pages/Local';
import Private from './pages/Private';
import Saved from './pages/Saved';
import PrivateMessages from './pages/PrivateMessages';
import Chat from './pages/Chat';

function RequireLogin({ children }: { children: ReactElement }) {
  // use sessionStorage so each browser tab can maintain its own auth state
  const loggedIn =
    typeof window !== 'undefined' && sessionStorage.getItem('ic_logged_in') === '1';
  const loc = useLocation();
  if (!loggedIn) {
    return <Navigate to="/login" state={{ from: loc }} replace />;
  }
  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/local" element={<RequireLogin><Local /></RequireLogin>} />
        <Route path="/saved" element={<RequireLogin><Saved /></RequireLogin>} />
        <Route path="/private" element={<RequireLogin><Private /></RequireLogin>} />
        <Route path="/private/messages" element={<RequireLogin><PrivateMessages /></RequireLogin>} />
        <Route
          path="/private/chat/:chatId"
          element={
            <RequireLogin>
              <Chat />
            </RequireLogin>
          }
        />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
