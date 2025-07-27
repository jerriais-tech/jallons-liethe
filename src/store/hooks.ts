import { bindActionCreators, ActionCreatorsMapObject } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "./index";

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();

import { useMemo } from "react";

export function useActions<A, M extends ActionCreatorsMapObject<A>>(
  actionCreators: M
) {
  const dispatch = useDispatch();
  return useMemo(
    () => bindActionCreators(actionCreators, dispatch),
    [dispatch]
  );
}
