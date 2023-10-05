import {
  SET_DATE_CHECK_IN_OUT,
  SET_ORDER_ITEM,
  SET_ORDER_NOTE,
} from "./Constains";

export const setDateCheckInOut = (payload) => ({
  type: SET_DATE_CHECK_IN_OUT,
  payload,
});
export const setOrderItem = (payload) => ({
  type: SET_ORDER_ITEM,
  payload,
});
export const setOrderNote = (payload) => ({
  type: SET_ORDER_NOTE,
  payload,
});
