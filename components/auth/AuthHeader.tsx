export default function AuthFormHeader({
  header,
  text,
}: {
  header: string;
  text?: string;
}) {
  return (
    <div className="text-center space-y-2 sm:space-y-3">
      <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold leading-tight text-primary-400 px-2">
        {header}
      </h1>
      <p className="text-xs sm:text-sm md:text-base text-neutral-900 px-2">
        {text}
      </p>
    </div>
  );
}
