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
import { useCallback, useEffect, useRef, useState } from "react";
import Datepicker from "react-tailwindcss-datepicker";
import moment from "moment";
import { useStore, actions } from "../../context/order";
const TABLE_HEAD = ["Loại chỗ nghỉ ", "Phù hợp cho", "Giá", ""];

export function ListRoom(props) {
  const rooms = props.room;
  const [state, dispatch] = useStore();

  function formatPrice(price) {
    price = price.toLocaleString("vi", { style: "currency", currency: "VND" });
    return price;
  }
  const [dateNow, setDateNow] = useState();

  useEffect(() => {
    const now = moment();
    setDateNow(now.format("DD/MM/YYYY"));
  }, []);
  const [dateCheckinChechout, setDateCheckinChechout] = useState({
    startDate: "",
    endDate: new Date().setMonth(11),
  });
  const [selectedOption, setSelectedOption] = useState("");
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
      setDateCheckinChechout();
    } else {
      setDateCheckinChechout(e);
      dispatch(actions.setDateCheckInOut(e));
    }
  };

  const [quantity, setQuantity] = useState(null);
  const [roomId, setRoomId] = useState("");
  const handleChangeOption = (e, _id) => {
    setQuantity(e);
    setRoomId();
    const orderItem = {
      roomId: _id,
      quantity: e,
    };
    console.log("aaaa", orderItem);

    if (orderItem.roomId !== "" || quantity !== null) {
      dispatch(actions.setOrderItem(orderItem));
    }
  };

  return (
    <div className="block w-3/4">
      <div className="flex">
        <Typography className="font-medium text-base">Chọn ngày</Typography>
        <Typography className="ml-4 font-medium text-base text-red-600">
          Hãy chọn 1 ngày tuyệt vời
        </Typography>
      </div>
      <div className=" w-full rounded-xl font-semibold border-solid border-black border-1 bg-[#003b95] h-14 flex justify-center ">
        <div className="mt-2 w-4/5">
          <Datepicker
            containerClassName="relative font-semibold"
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
                      className=" leading-none opacity-70 font-semibold text-lg"
                    >
                      {head}
                    </Typography>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rooms?.map(
                ({ _id, name, numberBed, amount, price, stock }, index) => {
                  const isLast = index === rooms.length - 1;
                  const classes = isLast
                    ? "p-4"
                    : "p-4 border-b border-blue-gray-50";

                  return (
                    <tr key={_id}>
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
                              className="opacity-70 font-semibold"
                            >
                              {numberBed}
                              <SingleBedIcon></SingleBedIcon>Giường lớn
                            </Typography>
                          </div>
                        </div>
                      </td>
                      <td className={classes}>
                        <div className="flex ">
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-semibold text-base mr-1"
                          >
                            {amount}
                          </Typography>
                          <PersonIcon />
                        </div>
                      </td>
                      <td className={classes}>
                        <div className="flex flex-col">
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal text-lg"
                          >
                            {stock === "Còn phòng"
                              ? formatPrice(price)
                              : "Hết phòng"}
                          </Typography>
                        </div>
                      </td>
                      <td className={classes}>
                        <Select
                          variant="standard"
                          label="Chọn phòng"
                          onChange={(e) => handleChangeOption(e, _id)}
                        >
                          <Option value="1">
                            1 ({formatPrice(price * 1)})
                          </Option>
                          <Option value="2">
                            2 ({formatPrice(price * 2)})
                          </Option>
                          <Option value="3">
                            3 ({formatPrice(price * 3)})
                          </Option>
                          <Option value="4">
                            4 ({formatPrice(price * 4)})
                          </Option>
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
