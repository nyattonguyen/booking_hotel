import { format } from "date-fns";
import catchAsyncError from "../middleware/catchAsyncErrors.js";
import { OrderModel, RoomModel } from "../models/index.js";
import ErrorHandler from "../utills/errorHandle.js";
import moment from "moment/moment.js";
export const createOrder = catchAsyncError(async (req, res, next) => {
  const {
    orderItems,
    status,
    payment,
    note,
    dateCheckin,
    dateCheckout,
    hotel,
  } = req.body;

  const dateCheckoutFM = moment(dateCheckout);
  const dateCheckinFM = moment(dateCheckin);
  let totalDays = 0;
  if (dateCheckinFM.isValid() && dateCheckoutFM.isValid()) {
    totalDays = dateCheckoutFM.diff(dateCheckinFM, "days");
  }
  let totalPrice = 0;
  for (const orderItem of orderItems) {
    const room = await RoomModel.findById(orderItem.roomId);
    if (!room) return next(new ErrorHandler("Room not found", 404));
    totalPrice += orderItem.quantity * room.price * totalDays;
  }
  totalPrice = parseFloat(totalPrice);
  const newOrder = await OrderModel.create({
    orderItems,
    status,
    payment,
    totalPrice,
    note,
    hotel,
    dateCheckin: dateCheckinFM,
    dateCheckout: dateCheckoutFM,
    user: req.user._id,
  });

  res.status(200).json({
    success: true,
    newOrder,
  });
});

export const getAllOrder = catchAsyncError(async (req, res, next) => {
  const orders = await OrderModel.find({});
  res.status(200).json({
    message: "Get all order successfully...",
    orders,
  });
});
export const getOneOrder = catchAsyncError(async (req, res, next) => {
  const order = await OrderModel.findById(req.params.id).populate(
    "user",
    "name email"
  );
  if (!order) return next(new ErrorHandler("Order not found", 404));

  res.status(200).json({
    success: true,
    message: "get single order successfully",
    order,
  });
});

export const myOrders = catchAsyncError(async (req, res, _next) => {
  const orders = await OrderModel.find({ user: req.params.id }).populate(
    "hotel"
  );

  res.status(200).json({
    message: "get my orders successfully",
    orders,
    success: true,
  });
});
export const updateStatusOrder = catchAsyncError(async (req, res, next) => {
  const order = await OrderModel.findById(req.params.id);

  if (!order) return next(new ErrorHandler("Order not found", 404));
  if (order.status == "Successed") {
    return next(new ErrorHandler("You have already delivered this order", 400));
  }
  if (order.status === "Confirm") {
    order.status = "Successed";
  } else if (order.status === "Pending...") {
    order.status = "Confirm";
  }
  await order.save({ new: true });
  res.status(200).json({
    success: true,
    order,
  });
});
export const cancelOrder = catchAsyncError(async (req, res, next) => {
  const order = await OrderModel.findById(req.params.id);

  if (!order) return next(new ErrorHandler("Order not found", 404));
  if (order.status == "Pending...") {
    order.status = "Cancel";
  } else if (order.status !== "Pending...") {
    return next(new ErrorHandler("You have already shipping this order", 400));
  }

  order.status = await order.save({ new: true });
  res.status(200).json({
    success: true,
    order,
  });
});
export const calculateMonthlyRevenue = catchAsyncError(
  async (req, res, next) => {
    const pipeline = [
      {
        $match: {
          status: "Successed",
        },
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m",
              date: { $toDate: "$createdAt" },
            },
          },
          revenue: {
            $sum: {
              $toDouble: {
                $ifNull: [{ $toDouble: "$totalPrice" }, 0],
              },
            },
          },
        },
      },
      {
        $sort: {
          _id: 1,
        },
      },
    ];

    const monthlyRevenue = await OrderModel.aggregate(pipeline);

    res.status(200).json({
      success: true,
      monthlyRevenue,
    });
  }
);

export const calculateMonthlyRevenueByHotelId = catchAsyncError(
  async (req, res, next) => {
    const { hotelId } = req.params;

    const pipeline = [
      {
        $match: {
          hotel: hotelId,
          status: "Successed",
        },
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m",
              date: { $toDate: "$createdAt" },
            },
          },
          revenue: {
            $sum: {
              $toDouble: {
                $ifNull: [{ $toDouble: "$totalPrice" }, 0],
              },
            },
          },
        },
      },
      {
        $sort: {
          _id: 1,
        },
      },
    ];

    const monthlyRevenue = await OrderModel.aggregate(pipeline);

    res.status(200).json({
      success: true,
      monthlyRevenue,
    });
  }
);

export const calculateWeeklyRevenueByHotel = catchAsyncError(
  async (req, res, next) => {
    const pipeline = [
      {
        $match: {
          status: "Successed",
        },
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%u", // Thay đổi định dạng ngày tháng thành %Y-%W
              date: { $toDate: "$createdAt" },
            },
          },
          revenue: {
            $sum: {
              $toDouble: {
                $ifNull: [{ $toDouble: "$totalPrice" }, 0],
              },
            },
          },
        },
      },
      {
        $sort: {
          _id: 1,
        },
      },
    ];

    const weeklyRevenue = await OrderModel.aggregate(pipeline);
    const currentWeek = moment().week();
    const weeklyRevenueByHotel = weeklyRevenue.find(
      (item) => item._id === currentWeek
    );

    res.status(200).json({
      success: true,
      weeklyRevenueByHotel,
    });
  }
);
export const calculateWeeklyRevenue = catchAsyncError(
  async (req, res, next) => {
    const pipeline = [
      {
        $match: {
          status: "Successed",
        },
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%u", // Thay đổi định dạng ngày tháng thành %Y-%W
              date: { $toDate: "$createdAt" },
            },
          },
          revenue: {
            $sum: {
              $toDouble: {
                $ifNull: [{ $toDouble: "$totalPrice" }, 0],
              },
            },
          },
        },
      },
      {
        $sort: {
          _id: 1,
        },
      },
    ];

    const monthlyRevenue = await OrderModel.aggregate(pipeline);

    res.status(200).json({
      success: true,
      monthlyRevenue,
    });
  }
);

export const calculateDaylyRevenue = catchAsyncError(async (req, res, next) => {
  const { date } = req.body;

  const currentDate = new Date();
  const currentMonth = moment(currentDate).format("YYYY-MM");

  const pipeline = [
    {
      $match: {
        status: "Successed",
        createdAt: {
          $gte: new Date(date),
          $lt: new Date(date + " 23:59:59"),
        },
      },
    },
    {
      $group: {
        _id: {
          $dateToString: {
            format: "%Y-%m-%d",
            date: { $toDate: "$createdAt" },
          },
        },
        revenue: {
          $sum: {
            $toDouble: {
              $ifNull: [{ $toDouble: "$totalPrice" }, 0],
            },
          },
        },
      },
    },
    {
      $sort: {
        _id: 1,
      },
    },
    {
      $lookup: {
        from: "days",
        localField: "_id",
        foreignField: "date",
        as: "days",
        pipeline: [
          {
            $match: {
              month: currentMonth,
            },
          },
        ],
      },
    },
    {
      $project: {
        _id: true,
        revenue: true,
        days: true,
      },
    },
  ];

  const monthlyRevenue = await OrderModel.aggregate(pipeline);

  res.status(200).json({
    success: true,
    monthlyRevenue,
  });
});
// const calculateDaylyRevenueByHotelId = catchAsyncError(
//   async (req, res, next) => {
//     const { date, hotelId } = req.params;

//     const currentDate = new Date();
//     const currentMonth = moment(currentDate).format("YYYY-MM");

//     const pipeline = [
//       {
//         $match: {
//           status: "Successed",
//           hotel: hotelId,
//           createdAt: {
//             $gte: new Date(date),
//             $lt: new Date(date + " 23:59:59"),
//           },
//         },
//       },
//       {
//         $group: {
//           _id: {
//             $dateToString: {
//               format: "%Y-%m-%d",
//               date: { $toDate: "$createdAt" },
//             },
//           },
//           revenue: {
//             $sum: {
//               $toDouble: {
//                 $ifNull: [{ $toDouble: "$totalPrice" }, 0],
//               },
//             },
//           },
//         },
//       },
//       {
//         $sort: {
//           _id: 1,
//         },
//       },
//     ];

//     const dailyRevenue = await OrderModel.aggregate(pipeline);

//     res.status(200).json({
//       success: true,
//       dailyRevenue,
//     });
//   }
// );
