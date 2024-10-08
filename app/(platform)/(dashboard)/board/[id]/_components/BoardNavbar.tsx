import { Board } from "@prisma/client";
import BoardOptions from "./BoardOptions";
import BoardTitleForm from "./BoardTitleForm";

type BoardNavbarProps = {
  data: Board;
};
const BoardNavbar = async ({ data }: BoardNavbarProps) => {
  return (
    <div className="w-full h-14 z-[40] bg-black/50 sticky top-0 flex items-center px-6 gap-x-4 text-white ">
      <BoardTitleForm data={data} />

      <div className="ml-auto">
        <BoardOptions id={data.id} />
      </div>
    </div>
  );
};

export default BoardNavbar;
