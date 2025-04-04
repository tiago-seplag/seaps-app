import axios from "axios";

const reports = async (id: string) => {
  await axios
    .get("/api/reports/" + id, {
      responseType: "blob",
    })
    .then((value) => {
      const blob = new Blob([value.data], { type: "text/html" });
      const _url = window.URL.createObjectURL(blob);
      if (_url) {
        window
          .open(
            _url,
            "Axios data",
            window.innerWidth > MOBILE_BREAKPOINT ? "width=820,height=800" : "",
          )
          ?.focus();
      }
    })
    .catch((e) => console.log(e));
};

export { reports };

const MOBILE_BREAKPOINT = 768;
