import { Bell } from "lucide-react";
import type { DataViewItem } from "@renderer/types";

export default function OverviewManage() {
  const dataItems: DataViewItem[] = [
    {
      label: "账号总数",
      value: 4,
      note: "登录 1 失效 3"
    },
    {
      label: "总粉丝数",
      value: 0
    },
    {
      label: "总作品数",
      value: 3
    },
    {
      label: "总阅读(播放)量",
      value: 0
    },
    {
      label: "总收益",
      value: 0
    }
  ];

  return (
    <section className="p-5 bg-primary/5">
      <div className="bg-base-100 p-5 rounded-box flex flex-col gap-7 w-full">
        <h3 className="font-semibold text-xl inline-flex items-center gap-2">
          数据概览
          <span className="font-normal text-sm text-base-content">
            数据更新于 2025-03-23 08:12:12
          </span>
        </h3>
        <div className="flex flex-row justify-evenly w-full">
          {dataItems.map((item) => (
            <DataItem key={item.label} label={item.label} value={item.value} note={item.note} />
          ))}
        </div>
      </div>
      <div className="bg-base-100 p-5 rounded-box mt-7 flex flex-col gap-5">
        <h3 className="inline-flex gap-2">
          <Bell /> 消息通知
        </h3>
        <p>消息...</p>
        <p>消息...</p>
      </div>
    </section>
  );
}

type DataItemProps = DataViewItem;

function DataItem({ label, value, note }: DataItemProps) {
  return (
    <div className="h-32 w-52 place-items-center place-content-center bg-base-300 rounded-box">
      <h3>{label}</h3>
      <p className="font-bold text-2xl py-2">{value}</p>
      {note && <p>{note}</p>}
    </div>
  );
}
