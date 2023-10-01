import React from "react";
import { ICard } from "./Card";

export default function ListCard() {
  return (
    <div className="mt-10 w-4/6 ml-10">
      <div className="grid grid-cols-3 gap-3 ">
        <ICard />
        <ICard />
        <ICard />
        <ICard />
        <ICard />
        <ICard />
        <ICard />
        <ICard />
      </div>
    </div>
  );
}
