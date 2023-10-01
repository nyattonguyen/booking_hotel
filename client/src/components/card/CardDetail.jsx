import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Button,
  Dialog,
} from "@material-tailwind/react";
import { Link } from "react-router-dom";
import { Carousel } from "flowbite-react";
import { ListRoom } from "../room/ListRoom";
import { Order } from "../order/Order";
import { useState } from "react";
import { Modal } from "@mui/material";
import Navbar from "../home/Navbar";

export function CardDetail() {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(!open);
  return (
    <>
      <Navbar />
      <div className="w-full h-fit bg-blue-600 relative flex justify-center">
        <Card className="w-full max-w-6xl h-[30rem]  flex-row top-10">
          <CardHeader
            shadow={false}
            floated={false}
            className="m-0 w-3/6 shrink-0 rounded-r-none"
          >
            <Carousel pauseOnHover>
              <img
                alt="..."
                src="https://flowbite.com/docs/images/carousel/carousel-1.svg"
              />
              <img
                alt="..."
                src="https://flowbite.com/docs/images/carousel/carousel-2.svg"
              />
              <img
                alt="..."
                src="https://flowbite.com/docs/images/carousel/carousel-3.svg"
              />
              <img
                alt="..."
                src="https://flowbite.com/docs/images/carousel/carousel-4.svg"
              />
              <img
                alt="..."
                src="https://flowbite.com/docs/images/carousel/carousel-5.svg"
              />
            </Carousel>
          </CardHeader>
          <CardBody>
            <Typography variant="h6" color="gray" className="mb-4 uppercase">
              Start Hotel
            </Typography>
            <Typography variant="h4" color="blue-gray" className="mb-2">
              Lyft launching cross-platform service this week
            </Typography>
            <Typography color="gray" className="mb-8 font-normal">
              Like so many organizations these days, Autodesk is a company in
              transition. It was until recently a traditional boxed software
              company selling licenses. Yet its own business model disruption is
              only part of the story
            </Typography>
            <div className="flex bg-cyan-500  rounded-xl w-[8rem] justify-center align-middle float-right">
              <Button
                onClick={handleOpen}
                variant="text"
                className="flex items-center gap-2 text-white"
              >
                Đặt
              </Button>
            </div>
          </CardBody>
        </Card>
      </div>
      <Modal
        onClick={handleOpen}
        className="flex justify-center"
        open={open}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Order />
      </Modal>
      <div className="flex justify-center mt-24 overflow-hidden">
        <ListRoom />
      </div>
    </>
  );
}
