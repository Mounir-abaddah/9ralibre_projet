import { Google, Microsoft } from "developer-icons";

type OauthType = {
  text_1: string;
  text_2: string;
};
const OAuth = ({ text_1, text_2 }: OauthType) => {
  const handleClick = ()=>{
    const apiUrl = import.meta.env.VITE_OAUTH_URL;
    window.location.href = apiUrl
  }
  return (
    <div className="w-full">
      <div className="flex w-full flex-col-reverse justify-around gap-3 md:flex-row lg:flex-row ">
        <div onClick={handleClick} className="hover:inset-shadow-md flex w-full cursor-pointer items-center gap-2 rounded-md border p-2 font-medium transition-all duration-300 hover:bg-slate-50 dark:border-gray-300">
          <Google size={19}/>
          <hr className="h-6 rounded-md border-1" />
          <p>{text_1}</p>
        </div>
        <div className="hover:inset-shadow-md flex w-full cursor-pointer items-center gap-2 rounded-md border bg-black p-2 font-medium text-white transition-all duration-300">
          <Microsoft size={19} />
          <hr className="h-6 rounded-md border-1" />
          <p>{text_2}</p>
        </div>
      </div>
      <div className="mt-3 flex w-full items-center justify-around gap-4">
        <hr className="w-full" />
        <h6 className="font-semibold">OU</h6>
        <hr className="w-full" />
      </div>
    </div>
  );
};

export default OAuth;
