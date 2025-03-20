const reports = async (id: string) => {
  return window
    .open(
      "/reports?id=" + id,
      id,
      window.innerWidth > MOBILE_BREAKPOINT ? "width=820,height=800" : "",
    )
    ?.focus();
};

export { reports };

const MOBILE_BREAKPOINT = 768;
