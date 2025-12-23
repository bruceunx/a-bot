import { MemoryRouter, Navigate, Route, Routes } from "react-router-dom";
import Layout from "./components/layout";
import Account from "./components/Account";
import OverviewManage from "./components/Manage/OverviewManage";
import ManageLayout from "./components/Manage/ManageLayout";
import Publish from "./components/Publish";

function App() {
	// const ipcHandle = (): void => window.electron.ipcRenderer.send("ping");

	return (
		<MemoryRouter>
			<Routes>
				<Route path="/" element={<Navigate to="/manage/dashboard" replace />} />
				<Route path="/" element={<Layout />}>
					<Route path="manage" element={<ManageLayout />}>
						<Route index element={<OverviewManage />} />
						<Route path="dashboard" element={<OverviewManage />} />
					</Route>
					<Route path="accounts" element={<Account />} />
					<Route path="content" element={<p>AI studio</p>} />
					<Route path="publisher" element={<Publish />} />
				</Route>
			</Routes>
		</MemoryRouter>
	);
}

export default App;
