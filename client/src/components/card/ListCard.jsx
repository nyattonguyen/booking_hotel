import React from "react";
import { ICard } from "./Card";

export default function ListCard(props) {
  const listHotel = props.listHotel;
  return (
    <div className="mt-10 w-4/6 ml-10">
      <div className="grid grid-cols-3 gap-3 ">
        {listHotel?.map((item) => (
          <ICard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}
