import Settings from "@/components/creatorSettings/SettingsNavSetup";

export default function page() {
  return (
    <>
      <h1 className="font-semibold mt-10 lg:text-[2.5rem] leading-12 text-neutral-900 text-base">
        Settings
      </h1>

      <div className="mt-10">
        <Settings />
      </div>
    </>
  );
}
