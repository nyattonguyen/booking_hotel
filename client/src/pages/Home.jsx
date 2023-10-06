import { useEffect, useState } from "react";
import ListCard from "../components/card/ListCard";
import Header from "../components/home/Header";
import { Sidebar } from "../components/home/Sidebar";
import clientAxios from "../api";
import "../index.css";
import LoadingCard from "./LoadingCard";

export default function Home() {
  const [listCategory, setListCategory] = useState([]);
  const [listHotel, setListHotel] = useState([]);

  useEffect(() => {
    clientAxios
      .get("/category")
      .then((res) => {
        setListCategory(res.data.categories);
      })
      .catch((err) => console.log(err));

    clientAxios
      .get("/hotel")
      .then((res) => {
        setListHotel(res.data.hotels);
      })
      .catch((err) => console.log(err));
    return () => {
      setListCategory();
      setListHotel();
    };
  }, []);
  return (
    <div className="">
      <Header />
      <div className="flex justify-center row-span-full">
        <Sidebar listCategory={listCategory} />
        {listHotel ? <ListCard listHotel={listHotel} /> : <LoadingCard />}
      </div>
    </div>
  );
}
