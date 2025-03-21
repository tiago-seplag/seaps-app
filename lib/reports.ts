import axios from "axios";

const reports = async (id: string) => {
  await axios
    .get(process.env.REPORT_URL + "/reports/checklist?id=" + id, {
      responseType: "blob",
      headers: {
        Authorization: document.cookie,
      },
      paramsSerializer: {
        indexes: true,
      },
    })
    .then((value) => {
      const _url = window.URL.createObjectURL(value.data);
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
