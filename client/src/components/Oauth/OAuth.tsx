import { Google, Microsoft } from "developer-icons";

type OauthType = {
  text_1: string;
  text_2: string;
};
const OAuth = ({ text_1, text_2 }: OauthType) => {
  return (
    <div className="w-full">
      <div className="flex w-full justify-around">
        <div className="flex cursor-pointer items-center gap-2 rounded-md border p-2 font-medium transition-all duration-300 hover:bg-slate-50 hover:inset-shadow-md">
          <Google size={19} />
          <hr className="h-6 rounded-md border-1" />
          <p className="hidden md:block lg:block">{text_1}</p>
        </div>
        <div className="flex cursor-pointer items-center gap-2 rounded-md border p-2 font-medium transition-all duration-300 hover:bg-slate-50 hover:inset-shadow-md">
          <Microsoft size={19} />
          <hr className="h-6 rounded-md border-1" />
          <p className="hidden md:block lg:block">{text_2}</p>
        </div>
      </div>
      <div className="flex w-full items-center justify-around gap-4">
        <hr className="w-full" />
        <h6 className="font-semibold">OU</h6>
        <hr className="w-full" />
      </div>
    </div>
  );
};

export default OAuth;
