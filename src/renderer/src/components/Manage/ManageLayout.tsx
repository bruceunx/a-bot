import { Link, Outlet } from "react-router-dom";

export default function ManageLayout() {
  return (
    <section id="body" className="h-full grid  grid-cols-[auto_1fr]">
      <div className="w-48 bg-red-300 flex flex-col">
        <div>
          <Link to="/manage/overview">首页</Link>
        </div>
        <div>
          <Link to="/manage/account">人员管理</Link>
        </div>
      </div>
      <Outlet />
    </section>
  );
}
