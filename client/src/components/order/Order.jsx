import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
  Button,
  Textarea,
} from "@material-tailwind/react";
import { useStore } from "../../context/order";

function CheckIcon() {
  const [state, dispatch] = useStore();
  console.log({ state });

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2}
      stroke="currentColor"
      className="h-3 w-3"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4.5 12.75l6 6 9-13.5"
      />
    </svg>
  );
}

const LIST_ORDER = [
  {
    id: 1,
    name: "Phòng Tiêu Chuẩn Giường Đôi",
    quanlity: 2,
    price: 180000,
  },
  {
    id: 2,
    name: "Phòng Tiêu Chuẩn 4 Người",
    quanlity: 1,
    price: 300000,
  },
];
const totalPrice = LIST_ORDER.reduce((acc, item) => {
  return acc + item.price * item.quanlity;
}, 0);
export function Order() {
  return (
    <Card
      color="white"
      variant="gradient"
      className="w-full max-w-[30rem] h-auto max-h-[600px] p-8 bg-blue-gray-50 mt-5"
    >
      <CardHeader
        floated={false}
        shadow={false}
        color="transparent"
        className="m-0 mb-8 rounded-s-2xl border-b border-white/10 pb-8 text-center"
      >
        <Typography
          variant="small"
          color="black"
          className="font-normal uppercase text-lg"
        >
          Bill
        </Typography>
        <Typography
          variant="h1"
          color="black"
          className="mt-6 flex justify-center gap-1 text-7xl font-normal"
        >
          <span className="mt-2 text-4xl">VND</span>
          {totalPrice} <span className="self-end text-4xl"></span>
        </Typography>
      </CardHeader>
      <CardBody className="p-0">
        <ul className="flex flex-col gap-4">
          {LIST_ORDER.map((item) => (
            <li className="flex items-center gap-4">
              <span className="rounded-full border border-white/20 bg-cyan-400 mb-2 text-white p-1">
                <CheckIcon />
              </span>
              <Typography className="font-bold">
                {item.name}: {item.quanlity} * {item.price}
              </Typography>
            </li>
          ))}
        </ul>
        <div className="flex w-full flex-col gap-6">
          <Textarea color="blue" label="Ghi chú" className="text-base" />
        </div>
      </CardBody>
      <CardFooter className="mt-12 p-0 ">
        <Button
          size="lg"
          color="white"
          className="hover:scale-[1.02] focus:scale-[1.02] active:  -100"
          ripple={false}
          fullWidth={true}
        >
          Xác nhận
        </Button>
      </CardFooter>
    </Card>
  );
}
