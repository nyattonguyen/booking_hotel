import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
  Button,
  Textarea,
} from "@material-tailwind/react";
import { actions, useStore } from "../../context/order";
import { formatPrice } from "../../common/formatPrice";
import { useEffect, useMemo, useState } from "react";
import { debounce } from "lodash";
function CheckIcon() {
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

export function Order() {
  const [listOrder, dispatch] = useStore();
  const totalPrice = useMemo(() => {
    console.log("render lai");
    return listOrder.orderItems.reduce((acc, item) => {
      if (
        !isNaN(item.quantity) ||
        !isNaN(item.price) ||
        item.quantity !== undefined ||
        item.price !== undefined
      )
        return acc + item.price * item.quantity;
    }, 0);
  }, [listOrder]);
  const [note, setNote] = useState("");
  const debouncedDispatch = debounce((note) => {
    dispatch(actions.setOrderNote(note));
  }, 500);
  const handleChaneNote = (e) => {
    setNote(e.target.value);
    debouncedDispatch(e.target.value);
    console.log(e.target.value);
    console.log({ listOrder });
  };
  useEffect(() => {
    console.log(note);
  }, [note]);
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
          className="flex justify-center gap-1 text-7xl font-norma"
        >
          {formatPrice(totalPrice)} <span className="self-end text-4xl"></span>
        </Typography>
        <Typography variant="h4" className="">
          {listOrder.dateCheckin} - {listOrder.dateCheckout}
        </Typography>
      </CardHeader>
      <CardBody className="p-0 max-h-max[600px]">
        <ul className="flex flex-col gap-4">
          {listOrder.orderItems.map((item) => (
            <li className="flex items-center gap-4">
              <span className="rounded-full border border-white/20 bg-cyan-400 mb-2 text-white p-1">
                <CheckIcon />
              </span>
              <Typography className="font-bold">
                {item.name}: {item.quantity} * {item.price}
              </Typography>
            </li>
          ))}
        </ul>
        <div className="flex w-full flex-col gap-6">
          <Textarea
            color="blue"
            label="Ghi chú"
            className="text-base h-auto"
            onChange={handleChaneNote}
          />
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
