import ListCard from "../components/card/ListCard";
import Header from "../components/home/Header";
import { Sidebar } from "../components/home/Sidebar";
import "../index.css";

export default function Home() {
  return (
    <div className="">
      <Header />
      <div className="flex justify-center row-span-full">
        <Sidebar />
        <ListCard />
      </div>
    </div>
  );
}
