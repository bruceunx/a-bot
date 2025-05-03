import AccountMenu from "./AccountMenu";

export default function Account() {
  return (
    <section id="body" className="h-full grid  grid-cols-[auto_1fr]">
      <AccountMenu />
      <div className="p-2">账号中心</div>
    </section>
  );
}
