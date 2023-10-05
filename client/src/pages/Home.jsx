import { useContext, useEffect, useState } from "react";
import ListCard from "../components/card/ListCard";
import Header from "../components/home/Header";
import { Sidebar } from "../components/home/Sidebar";
import clientAxios from "../api";
import "../index.css";

import { actions, useStore } from "../context/order";
import { AuthContext } from "../context";

export default function Home() {
  const [listCategory, setListCategory] = useState([]);
  const [listHotel, setListHotel] = useState([]);
  const { user } = useContext(AuthContext);
  const [currentUser, setCurrentUser] = useState(user.uid);
  const [state, dispatch] = useStore();
  useEffect(() => {
    let currentUserId = user.uid;
    setCurrentUser(user.uid);
    return () => {
      if (currentUserId !== currentUser) {
        setCurrentUser(currentUser);
      }
      dispatch(actions.setCurrentUserId(currentUser));
    };
  }, [currentUser]);

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
