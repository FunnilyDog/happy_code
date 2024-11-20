export const ajax = (
  url: string,
  method: "GET" | "POST",
  options: {
    header: Record<string, any>;
    data: Record<string, any>;
  }
) => {
  return new Promise((resolve, reject) => {
    const { header, data } = options;
    const request = new XMLHttpRequest();

    if (header && typeof header === "object") {
      Object.keys(header).forEach((key: string) => {
        request.setRequestHeader(key, header[key]);
      });
    }

    if (method === "GET") {
      let query = "";
      if (data && typeof data === "object") {
        Object.keys(data).map((item, index) => {
          query = `${index == 0 ? "?" : "&"}${query}item=${data[item]}`;
        });
      }
      request.open("GET", `${url}${query}`);
      request.send();
    }

    if (method === "POST") {
      request.open("POST", url);
      request.send({
        ...data
      } as XMLHttpRequestBodyInit);
    }

    request.onreadystatechange = () => {
      if (request.readyState === 4) {
        if (
          (request.status >= 200 && request.status < 300) ||
          request.status === 304
        ) {
          resolve(request.responseText);
        } else {
          reject(request.responseText);
        }
      }
    };
  });
};
