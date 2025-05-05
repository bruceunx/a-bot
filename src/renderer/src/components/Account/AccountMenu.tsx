import { Search } from "lucide-react";

export default function AccountMenu() {
  return (
    <div className="flex flex-col w-56 gap-1 bg-base-200 p-2">
      <div id="menu-part" className="flex flex-col gap-2 w-full items-start">
        <div className="flex flex-row items-center justify-between gap-1">
          <label className="input rounded-box w-40">
            <input type="text" placeholder="搜索账号" />
            <Search />
          </label>
          <button type="button" className="btn btn-primary">
            搜索
          </button>
        </div>
        <div className="flex flex-row items-center justify-between gap-1">
          <select defaultValue="全部分组" className="select w-40 rounded-box">
            <option>分组1</option>
            <option>分组2</option>
          </select>
          <button type="button" className="btn">
            刷新
          </button>
        </div>
      </div>
      <div id="accounts-list">
        <ul>
          <p>account1</p>
          <p>account2</p>
        </ul>
      </div>
    </div>
  );
}
