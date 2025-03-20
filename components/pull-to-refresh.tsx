"use client";
import { ArrowDown, LoaderCircle } from "lucide-react";
import { useEffect } from "react";
import { renderToString } from "react-dom/server";
import PullToRefresh from "pulltorefreshjs";

export const PullToRefreshElement = () => {
  useEffect(() => {
    const standalone = window.matchMedia("(display-mode: standalone)").matches;

    if (standalone || true) {
      PullToRefresh.init({
        instructionsPullToRefresh: "Puxe para baixo para atualizar",
        distReload: 70,
        instructionsReleaseToRefresh: "Solte para atualizar",
        instructionsRefreshing: "Atualizando",
        iconRefreshing: renderToString(
          <LoaderCircle className="mx-auto animate-spin" />,
        ),
        iconArrow: renderToString(<ArrowDown className="mx-auto" />),
        onRefresh() {
          window.location.reload();
        },
      });
    }
  }, []);

  return <></>;
};
