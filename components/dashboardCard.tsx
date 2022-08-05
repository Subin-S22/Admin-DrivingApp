import Image from "next/image";
import { useRouter } from "next/router";
import { DashBoardDetail } from "../pages";
import { sidebarRoute } from "../utils/helpers";

interface Props {
  info: DashBoardDetail;
}

function DashboardCard({ info }: Props) {
  const navigate = useRouter();
  return (
    <div
      className="rounded-xl shadow-lg w-full md:w-[45%] xl:w-[30%] 2xl:w-1/5 self-start p-2 md:p-8 flex justify-center
     items-center gap-2 m-2 bg-gray-50 cursor-pointer"
      onClick={() => sidebarRoute(info.name, navigate)}
    >
      <div className="w-32 h-32 relative rounded-full overflow-hidden">
        <Image src={info.image} layout="fill" />
      </div>
      <div>
        <h3 className="text-xl md:text-2xl font-Patua">{info.name}</h3>
      </div>
    </div>
  );
}

export default DashboardCard;
