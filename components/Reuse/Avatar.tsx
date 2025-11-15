interface singleProp {
  name: string;
}

interface multiProp {
  name: string[];
}

export function SingleAvatar({ name }: singleProp) {
  const getInitials = (fullname: string) => {
    const names = fullname
      .trim()
      .split(" ")
      .filter((n) => n.length > 0);

    if (names.length === 0) return "?";
    if (names.length === 1) return names[0][0].toUpperCase();

    return (names[0][0] + names[names.length - 1][0]).toUpperCase();
  };

  const initials = getInitials(name);

  return (
    <div className="w-10 h-10 text-sm bg-primary-400  rounded-full flex items-center justify-center text-white font-semibold shadow-lg">
      {initials}
    </div>
  );
}

export function BigSingleAvatar({ name }: singleProp) {
  const getInitials = (fullname: string) => {
    const names = fullname
      .trim()
      .split(" ")
      .filter((n) => n.length > 0);

    if (names.length === 0) return "?";
    if (names.length === 1) return names[0][0].toUpperCase();

    return (names[0][0] + names[names.length - 1][0]).toUpperCase();
  };

  const initials = getInitials(name);

  return (
    <div className="w-30 h-30 text-lg bg-primary-400  rounded-full flex items-center justify-center text-white font-semibold shadow-2xl">
      {initials}
    </div>
  );
}

export function MultiAvatar({ name }: multiProp) {
  const getInitials = (fullname: string) => {
    const names = fullname
      .trim()
      .split(" ")
      .filter((n) => n.length > 0);
    if (names.length === 0) return "?";
    if (names.length === 1) return names[0][0].toUpperCase();
    return (names[0][0] + names[names.length - 1][0]).toUpperCase();
  };

  const getColorClass = (index: number) => {
    const colors = [
      "bg-blue-500",
      "bg-purple-500",
      "bg-pink-500",
      "bg-green-500",
      "bg-yellow-500",
      "bg-red-500",
      "bg-indigo-500",
      "bg-teal-500",
    ];
    return colors[index % colors.length];
  };

  return (
    <div className="flex -space-x-2">
      {name.map((person, index) => {
        const initials = getInitials(person);
        return (
          <div
            key={index}
            className={`w-8 h-8 text-xs ${getColorClass(
              index
            )} rounded-full flex items-center justify-center text-white font-semibold shadow-md border-2 border-white`}
          >
            {initials}
          </div>
        );
      })}
    </div>
  );
}
{
}
