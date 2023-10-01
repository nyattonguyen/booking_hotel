import { Select, Option, Input, Button } from "@material-tailwind/react";
import { useEffect, useRef, useState } from "react";
import moment from "moment";
import Datepicker from "react-tailwindcss-datepicker";
import { Link } from "react-router-dom";

export default function Search() {
  const [selectedOption1, setSelectedOption1] = useState("");
  const [selectedOption2, setSelectedOption2] = useState("");
  const selectedOptionRefAera = useRef(null);
  const selectedOptionRefRoom = useRef(null);

  const [isActive1, setIsActive1] = useState(true);
  const [isActive2, setIsActive2] = useState(true);

  const [dateNow, setDateNow] = useState();

  const handleChangeOption1 = (e) => {
    const select = e.target;
    selectedOptionRefAera.current = select;
    setSelectedOption1(selectedOptionRefAera.current.textContent);
    if (selectedOption1 !== "") {
      setIsActive1(false);
    }
  };
  const handleChangeOption2 = (e) => {
    const select = e.target;
    selectedOptionRefAera.current = select;
    setSelectedOption2(selectedOptionRefAera.current.textContent);
    if (selectedOption2 !== "") {
      setIsActive2(false);
    }
  };

  useEffect(() => {
    const now = moment();
    setDateNow(now.format("DD/MM/YYYY"));
  }, []);
  const [dateCheckinChechout, setDateCheckinChechout] = useState({
    startDate: new Date(),
    endDate: new Date().setMonth(11),
  });

  const timePresent = moment().format("HH:mm");
  const handleChangeValueDate = (e) => {
    const selectedOption = e;
    const startDate = moment(selectedOption.startDate).format("DD/MM/YYYY");
    if (startDate < dateNow) {
      alert("Ngày bắt đầu không được nhỏ hơn ngày hiện tại");
      setDateCheckinChechout("");
    } else if (startDate === dateNow && timePresent > "11:00") {
      alert("Vui lòng đặt phỏng trước 11h");
      moment(startDate).add(1, "day");
      console.log(moment(startDate).add(1, "day"));
      setDateCheckinChechout();
    } else {
      setDateCheckinChechout(e);
    }
  };

  return (
    <div className="flex w-auto mr-72 ml-72 flex-row gap-6 justify-center text-black">
      <Select
        color="white"
        label={isActive1 ? "Chọn địa điểm đến" : ""}
        className="select-label bg-blue-gray-50 text-black text-shadow-white"
        onClick={handleChangeOption1}
      >
        <Option>Material Tailwind HTML</Option>
        <Option>Material Tailwind React</Option>
        <Option>Material Tailwind Vue</Option>
        <Option>Material Tailwind Angular</Option>
        <Option>Material Tailwind Svelte</Option>
      </Select>
      <div className="bg-[#bdbdbd] w-full rounded-xl border-solid border-black border-1 ">
        <Datepicker
          primaryColor={"rose"}
          value={dateCheckinChechout}
          onChange={handleChangeValueDate}
          showShortcuts={true}
        />
      </div>
      <Select
        label={isActive2 ? "Chọn phòng" : ""}
        ref={selectedOptionRefRoom}
        onClick={handleChangeOption2}
        className="select-label bg-blue-gray-50 text-black text-shadow-white"
      >
        <Option value="1">1</Option>
        <Option value="2">2</Option>
        <Option value="3">3</Option>
        <Option value="4">4</Option>
        <Option value="...">...</Option>
      </Select>
      <Link href="#">
        <Button className="bg-black">Tìm</Button>
      </Link>
    </div>
  );
}
