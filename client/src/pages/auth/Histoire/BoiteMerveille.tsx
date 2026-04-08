import { useEffect, useState } from "react";
import HTMLFlipBook from "react-pageflip";
import Boite from "/boite_a_merveille.jpg"
const BoiteMerveille = () => {
  const [text, setText] = useState("");

  const splitTextIntoPages = (text: string, maxLength = 1030) => {
  const sentences = text.split(/(?<=[.!?])/);
  const pages: string[] = [];
  let current = "";

  sentences.forEach((sentence) => {
    if ((current + sentence).length > maxLength) {
      pages.push(current);
      current = sentence;
    } else {
      current += sentence;
    }
  });

  if (current) pages.push(current);

  return pages;
};

const pages = splitTextIntoPages(text);

  useEffect(() => {
    fetch("/book/boite.txt")
      .then((res) => res.text())
      .then((data) => setText(data));
  }, []);


  return (
  <div className="flex justify-center p-6">
    <HTMLFlipBook
      width={450}
      height={650}
      showCover
      className="shadow-2xl"
    >
      {/* COVER */}
      <div>
        <img src={Boite} alt="Boite" className="size-full object-contain"/>
      </div>

      {pages.map((page, i) => (
        <div
          key={i}
          className="flex flex-col justify-between bg-[#fdfaf5] p-8"
        >
          <div className="flex-1 overflow-hidden">
            <p className="text-justify text-[15px] leading-7">
              {page}
            </p>
          </div>

          <div className="text-center text-xs text-gray-400">
            — {i + 1} —
          </div>
        </div>
      ))}
    </HTMLFlipBook>
  </div>
)

}

export default BoiteMerveille