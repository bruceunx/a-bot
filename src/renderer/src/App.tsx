import { MemoryRouter, Navigate, Route, Routes } from "react-router-dom";
import Layout from "./components/layout";
import Account from "./components/Account";
import OverviewManage from "./components/Manage/OverviewManage";
import UserManage from "./components/Manage/UserManage";
import ManageLayout from "./components/Manage/ManageLayout";

function App() {
  // const ipcHandle = (): void => window.electron.ipcRenderer.send("ping");

  return (
    <MemoryRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/manage" replace />} />
        <Route path="/" element={<Layout />}>
          <Route path="manage" element={<ManageLayout />}>
            <Route index element={<OverviewManage />} />
            <Route path="overview" element={<OverviewManage />} />
            <Route path="account" element={<UserManage />} />
          </Route>
          <Route path="account" element={<Account />} />
        </Route>
      </Routes>
    </MemoryRouter>
  );
}

export default App;
