import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";

export default function Layout() {
	return (
		<div className="h-full overflow-hidden bg-base-300" data-theme="light">
			<main className="h-screen grid  grid-cols-[auto_1fr]">
				<Sidebar />
				<Outlet />
			</main>
		</div>
	);
}
