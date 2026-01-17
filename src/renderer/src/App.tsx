import { MemoryRouter, Navigate, Route, Routes } from "react-router-dom";
import Layout from "./components/layout";
import Account from "./components/Account";
import OverviewManage from "./components/Manage/OverviewManage";
import Publish from "./components/Publish";
import AccountCenter from "./components/AccountCenter";

function App() {
  // const ipcHandle = (): void => window.electron.ipcRenderer.send("ping");

  return (
    <MemoryRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/" element={<Layout />}>
          <Route path="dashboard" element={<OverviewManage />} />
          <Route path="accounts" element={<Account />} />
          <Route path="center" element={<AccountCenter />} />
          <Route
            path="content"
            element={<p className="p-5">Under developing</p>}
          />
          <Route path="publisher" element={<Publish />} />
        </Route>
      </Routes>
    </MemoryRouter>
  );
}

export default App;
