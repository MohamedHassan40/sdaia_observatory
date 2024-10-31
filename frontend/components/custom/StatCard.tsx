import Link from "next/link";
import React from "react";

const StatCard = ({ item }: any) => {
  return (
    <li className="flex flex-col items-center gap-4 py-4 w-full bg-muted/40 rounded-lg  mx-auto">
      <div className="flex flex-col items-center justify-between h-full gap-4 w-full p-4 max-w-[80%]">
        <div className="flex flex-col items-center gap-2">
          <div className="flex flex-row items-center gap-2">
            <span className="font-medium text-lg">{item.name}</span>
          </div>
          <span className="font-semibold text-lg text-center text-foreground">
            {item.value}
          </span>
          <span className="font-light text-muted-foreground text-sm leading-relaxed text-center">
            {item.details}
          </span>
        </div>
        <Link
          href={item.link || "#"}
          className="text-md text-blue-400 hover:underline"
          target="_blank"
        >
          View More
        </Link>
      </div>
    </li>
  );
};

export default StatCard;
