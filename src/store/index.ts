import { configureStore } from "@reduxjs/toolkit";
import { rememberReducer, rememberEnhancer } from "redux-remember";

import courses from "./courses";
import deck, { deckActions } from "./deck";

const store = configureStore({
  reducer: rememberReducer({ courses, deck }),
  enhancers: (getDefaultEnhancers) =>
    getDefaultEnhancers().concat(
      rememberEnhancer(window.localStorage, ["deck"])
    ),
});

const midnight = new Date();
midnight.setHours(0, 0, 0, 0);
store.dispatch(deckActions.updateStatsForTime(midnight.getTime()));

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store;

export default store;
