import type { typedataProf } from "@/store/userStore";
import { BookType, Eye, Users, Video } from "lucide-react";

interface Props {
  data: typedataProf | null;
}

const CardProf = ({ data }: Props) => {
  const cards = [
    {
      title: "Vidéos",
      value: data?.videos ?? 0,
      icon: <Video />,
      color: "from-indigo-500 to-blue-500",
    },
    {
      title: "Vues",
      value: data?.totalViews ?? 0,
      icon: <Eye />,
      color: "from-orange-400 to-yellow-500",
    },
    {
      title: "Abonnés",
      value: data?.followers?.length ?? 0,
      icon: <Users />,
      color: "from-pink-500 to-rose-500",
    },
    {
      title: "Quiz",
      value: data?.quiz ?? 0,
      icon: <BookType />,
      color: "from-cyan-500 to-teal-500",
    },
  ];

  return (
    <div className="flex w-full items-center space-x-4">
      {cards.map((card, i) => (
        <div
          key={i}
          className={`rounded-2xl ${card.color} w-full p-[1px] shadow-md transition`}
        >
          <div className="flex flex-col gap-2 rounded-2xl bg-white p-4 dark:bg-gray-900">
            <div className="flex items-center justify-between text-sm text-gray-500">
              {card.title}
              <span className="opacity-70">{card.icon}</span>
            </div>

            <div className="text-2xl font-bold">{card.value}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CardProf;