import { useEffect, useState } from "react";
import ListCard from "../components/card/ListCard";
import Header from "../components/home/Header";
import { Sidebar } from "../components/home/Sidebar";
import "../index.css";
import clientAxios from "../api";

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
        <ListCard listHotel={listHotel} />
      </div>
    </div>
  );
}
