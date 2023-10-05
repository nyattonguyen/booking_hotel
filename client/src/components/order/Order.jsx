import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
  Button,
  Textarea,
  Alert,
} from "@material-tailwind/react";
import { actions, useStore } from "../../context/order";
import { formatPrice } from "../../common/formatPrice";
import { useEffect, useMemo, useState } from "react";
import { debounce } from "lodash";
import clientAxios from "../../api/index";
import { Modal } from "@mui/material";

export function CheckIcon() {
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
export function Icon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="h-6 w-6"
    >
      <path
        fillRule="evenodd"
        d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
        clipRule="evenodd"
      />
    </svg>
  );
}

export function Order(props) {
  const [listOrder, dispatch] = useStore();
  console.log("ass", props.open);
  const [note, setNote] = useState("");
  const [open, setOpen] = useState(props.open);
  console.log(open);
  const [showAlert, setShowAlert] = useState(false);
  const [idOrder, setIdOrder] = useState("");
  const debouncedDispatch = debounce((e) => {
    setNote(e);
    dispatch(actions.setOrderNote(e));
  }, 800);

  const handleChaneNote = (e) => {
    debouncedDispatch(e.target.value);
  };
  useEffect(() => {}, [open]);

  const totalPrice = useMemo(() => {
    return listOrder.orderItems.reduce((acc, item) => {
      if (
        !isNaN(item.quantity) ||
        !isNaN(item.price) ||
        item.quantity !== undefined ||
        item.price !== undefined
      )
        return acc + item.price * item.quantity;
    }, 0);
  }, [listOrder.quantity, listOrder.price]);

  const handleSubmit = () => {
    console.log("co du chua", listOrder);

    const allowSubmit = listOrder;

    if (allowSubmit) {
      clientAxios
        .post("/order", listOrder)
        .then((res) => {
          setIdOrder(res.data.newOrder._id);
          setShowAlert(true);
        })
        .catch((err) => console.log(err));
    } else {
      alert(
        "Vui lòng nhập giá trị cho tất cả các trường hoặc để trống trường Ghi chú."
      );
    }
  };
  return (
    <>
      <Modal
        open={open}
        // onClose={false}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Card
          id="modal-modal-title"
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
              {formatPrice(totalPrice)}{" "}
              <span className="self-end text-4xl"></span>
            </Typography>
            <Typography variant="h4" className="">
              {listOrder.dateCheckin} - {listOrder.dateCheckout}
            </Typography>
          </CardHeader>
          <CardBody
            className="p-0 max-h-max[600px]"
            id="modal-modal-description"
          >
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
              onClick={handleSubmit}
            >
              Xác nhận
            </Button>
          </CardFooter>
        </Card>
      </Modal>
      {showAlert && (
        <Alert
          open={true}
          className="max-w-screen-md bg-blue-700 h-28"
          icon={<Icon />}
          onClose={() => setShowAlert(false)}
        >
          <Typography variant="h5" color="white">
            Booking thành công
          </Typography>
          <Typography color="white" className="mt-2 font-normal">
            Đơn hàng {idOrder}
          </Typography>
        </Alert>
      )}
    </>
  );
}
