interface Props {
  header: string;
  text?: string;
}

export default function AuthFormHeader({ header, text }: Props) {
  return (
    <div className="flex flex-col items-center gap-6">
      <h3 className="font-semibold lg:text-[1.5rem] text-center text-xs leading-8 text-primary-400">
        {header}
      </h3>
      {text?.length && (
        <p className="leading-[20%] lg:text-base text-[0.5rem] font-normal text-neutral-900">
          {text}
        </p>
      )}
    </div>
  );
}
