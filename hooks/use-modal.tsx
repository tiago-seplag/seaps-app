/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";

export const useModal = (defaultVisible = false) => {
  const [visible, setVisible] = useState(defaultVisible);

  const show = () => setVisible(true);
  const hide = () => setVisible(false);

  const toggle = (nextVisible: any) => {
    if (typeof nextVisible !== "undefined") {
      setVisible(nextVisible);
    } else {
      setVisible((previousVisible) => !previousVisible);
    }
  };

  return { hide, show, toggle, visible };
};
