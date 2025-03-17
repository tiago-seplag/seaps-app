import axios from "axios";

const reports = async (id: string) => {
  if (process.env.REACT_APP_NODE_ENV === "development") {
    axios
      .get("reports/" + id)
      .then((res) => console.log(res.data))
      .catch((e) => console.log(e));
  }
  await axios
    .get("http://172.16.146.58:8080/reports/checklist?id=" + id, {
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
        window.open(_url, "Axios data", "width=820,height=800")?.focus();
      }
    })
    .catch((err) => {
      console.log(err);
    });
};

export { reports };
