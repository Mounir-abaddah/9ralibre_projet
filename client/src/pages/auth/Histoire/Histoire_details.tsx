import { useParams } from "react-router-dom";

const histoiresMap: Record<string, string> = {
  Boite: "https://heyzine.com/flip-book/a29fb4c790.html?hideToolbar=1",
  Antigone: "https://heyzine.com/flip-book/d19b8bf726.html",
  DJC: "https://heyzine.com/flip-book/fd828a0a01.html",
  Candide: "https://heyzine.com/flip-book/2b63a2c507.html",
  Honore: "https://heyzine.com/flip-book/23a415e6ac.html",
};

const Histoire_details = () => {
  const { histoire } = useParams();

  const src = histoire ? histoiresMap[histoire] : null;

  if (!src) {
    return <div className="mt-10 text-center">Histoire non trouvée</div>;
  }

  return (
    <div>
      <iframe
        allowFullScreen
        allow="clipboard-write"
        scrolling="no"
        className="h-screen w-full"
        id="Iframe"
        src={src}
      />
    </div>
  );
};

export default Histoire_details;