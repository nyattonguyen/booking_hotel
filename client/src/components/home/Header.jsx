import React from "react";
import Navbar from "./Navbar";
import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="bg-[#003b95]">
      <Navbar />
      <div className="p-5 text-center text-zinc-100">
        <h1 className="mb-3">Tìm chỗ nghỉ tiếp theo</h1>
        <h4 className="mb-3">
          Tìm ưu đãi khách sạn, chỗ nghỉ dạng nhà và nhiều hơn nữa...
        </h4>
      </div>
    </header>
  );
}
