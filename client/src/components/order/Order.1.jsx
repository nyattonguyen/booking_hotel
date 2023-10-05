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
import { memo, useMemo, useState } from "react";
import { debounce } from "lodash";
import clientAxios from "../../api/index";
import { Modal } from "@mui/material";
import { CheckIcon, Icon } from "./Order";

export function Order({ open, onModal }) {
  console.log(open);
  const [listOrder, dispatch] = useStore();

  const [note, setNote] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [idOrder, setIdOrder] = useState("");
  const debouncedDispatch = debounce((e) => {
    setNote(e);
    dispatch(actions.setOrderNote(e));
  }, 800);

  const handleChaneNote = (e) => {
    debouncedDispatch(e.target.value);
  };

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
        onClose={onModal}
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
export default memo(Order);
