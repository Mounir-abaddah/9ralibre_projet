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
      <div className="flex w-full justify-around lg:flex-row md:flex-row flex-col-reverse gap-3 ">
        <div onClick={handleClick} className="flex cursor-pointer w-full items-center gap-2 rounded-md border p-2 font-medium transition-all duration-300 hover:bg-slate-50 hover:inset-shadow-md">
          <Google size={19}/>
          <hr className="h-6 rounded-md border-1" />
          <p>{text_1}</p>
        </div>
        <div className="flex cursor-pointer bg-black text-white w-full items-center gap-2 rounded-md border p-2 font-medium transition-all duration-300 hover:inset-shadow-md">
          <Microsoft size={19} />
          <hr className="h-6 rounded-md border-1" />
          <p>{text_2}</p>
        </div>
      </div>
      <div className="flex w-full items-center justify-around gap-4 mt-3">
        <hr className="w-full" />
        <h6 className="font-semibold">OU</h6>
        <hr className="w-full" />
      </div>
    </div>
  );
};

export default OAuth;
