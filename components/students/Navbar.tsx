import { SingleAvatar } from "../Reuse/Avatar";

export default function StudentsNavbar() {
  return (
    <header className="flex justify-between items-center">
      <aside className="flex gap-1 sm:gap-2 items-center">
        <div className="h-auto w-10 sm:w-12 md:w-[53px]">
          <img
            src="/creatorLogo.svg"
            alt="Creator logo"
            className="w-full h-auto"
          />
        </div>
        <h3 className="text-base sm:text-lg md:text-xl lg:text-[2rem] text-orange-300 font-semibold">
          Ansah Chikeh
        </h3>
      </aside>
      <aside className="bg-neutral-100 flex items-center rounded-2xl px-2 sm:px-3 py-2 sm:py-2.5 text-xs text-neutral-900 gap-2 sm:gap-3 min-h-10 sm:min-h-11">
        <SingleAvatar name="Blessing Ugwu" />

        <div className="md:flex hidden flex-col">
          <p className="font-bold text-sm">Blessing Ugwu</p>
          <p className="text-neutral-700 text-xs">Learner</p>
        </div>
      </aside>
    </header>
  );
}
