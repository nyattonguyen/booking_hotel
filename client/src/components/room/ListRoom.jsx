import {
  Card,
  CardHeader,
  Typography,
  CardBody,
  Select,
  Option,
} from "@material-tailwind/react";
import BungalowIcon from "@mui/icons-material/Bungalow";
import SingleBedIcon from "@mui/icons-material/SingleBed";
import PersonIcon from "@mui/icons-material/Person";
import { useEffect, useState } from "react";
import Datepicker from "react-tailwindcss-datepicker";
import moment from "moment";
const TABLE_HEAD = ["Loại chỗ nghỉ ", "Phù hợp cho", "Giá", ""];

const TABLE_ROWS = [
  {
    id: 1,
    name: "Phòng Tiêu Chuẩn Giường Đôi",
    numberBed: "2",
    amount: 2,
    price: 180000,
  },
  {
    id: 2,
    name: "Phòng Tiêu Chuẩn 4 Người",
    numberBed: "2",
    amount: "3-4",
    price: 300000,
  },
  {
    id: 3,
    name: "Phòng Gia Đình",
    numberBed: "3",
    amount: "6-7",
    price: 600000,
  },
];

export function ListRoom() {
  function formatPrice(price) {
    price = price.toLocaleString("vi", { style: "currency", currency: "VND" });
    // Thêm đơn vị tiền tệ
    return price;
  }
  const [dateNow, setDateNow] = useState();

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
    <div className="block w-3/4">
      <div className=" w-full rounded-xl border-solid border-black border-1 bg-blue-gray-400 h-14 flex justify-center ">
        <div className="mt-2 w-4/5">
          <Datepicker
            primaryColor={"rose"}
            value={dateCheckinChechout}
            onChange={handleChangeValueDate}
            showShortcuts={true}
          />
        </div>
      </div>
      <Card className="h-full ">
        <CardHeader
          floated={false}
          shadow={false}
          className="rounded-none"
        ></CardHeader>
        <CardBody className="overflow-scroll px-0">
          <table className="mt-4 w-full min-w-max table-auto text-left">
            <thead>
              <tr>
                {TABLE_HEAD.map((head) => (
                  <th
                    key={head}
                    className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4 "
                  >
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal leading-none opacity-70 font-semibold text-lg"
                    >
                      {head}
                    </Typography>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {TABLE_ROWS.map(
                ({ id, name, numberBed, amount, price }, index) => {
                  const isLast = index === TABLE_ROWS.length - 1;
                  const classes = isLast
                    ? "p-4"
                    : "p-4 border-b border-blue-gray-50";

                  return (
                    <tr key={id}>
                      <td className={classes}>
                        <div className="flex items-center gap-3">
                          <BungalowIcon></BungalowIcon>
                          <div className="flex flex-col">
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-normal"
                            >
                              {name}
                            </Typography>
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-normal opacity-70"
                            >
                              {numberBed}
                              <SingleBedIcon></SingleBedIcon>Giường lớn
                            </Typography>
                          </div>
                        </div>
                      </td>
                      <td className={classes}>
                        <div className="flex flex-col">
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal"
                          >
                            {amount} <PersonIcon />
                          </Typography>
                        </div>
                      </td>
                      <td className={classes}>
                        <div className="flex flex-col">
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal text-lg"
                          >
                            VND {price}
                          </Typography>
                        </div>
                      </td>
                      <td className={classes}>
                        <Select variant="standard" label="Chọn phòng">
                          <Option>1 ({formatPrice(price * 1)})</Option>
                          <Option>2 ({formatPrice(price * 2)})</Option>
                          <Option>3 ({formatPrice(price * 3)})</Option>
                          <Option>4 ({formatPrice(price * 4)})</Option>
                        </Select>
                      </td>
                    </tr>
                  );
                }
              )}
            </tbody>
          </table>
        </CardBody>
      </Card>
    </div>
  );
}
