import { SET_DATE_CHECK_IN_OUT, SET_ORDER_ITEM } from "./Constains";

export const initState = {
  orderItems: [],
  user: "",
  note: "",
  dateCheckin: "",
  dateCheckout: "",
};
export function reducer(state, action) {
  switch (action.type) {
    case SET_DATE_CHECK_IN_OUT:
      console.log("payload", action.payload);
      return {
        ...state,
        dateCheckin: action.payload.startDate,
        dateCheckout: action.payload.endDate,
      };
    case SET_ORDER_ITEM:
      const orderItemIndex = state.orderItems.findIndex(
        (orderItem) => orderItem.roomId === action.payload.roomId
      );

      if (orderItemIndex !== -1) {
        state.orderItems[orderItemIndex].quantity += action.payload.quantity;
      } else {
        state.orderItems.push({
          roomId: action.payload.roomId,
          quantity: action.payload.quantity,
        });
      }
      console.log("payload", action.payload);

      return {
        ...state,
      };
    default:
      throw new Error("Invalid action ");
  }
}