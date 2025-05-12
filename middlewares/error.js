let error = {
  e400: (req, res, err) => {
    res.status(400).send(
      JSON.stringify({
        title: "Error 400",
        message: err.mensaje,
      })
    );
  },
  e401: (req, res, err) => {
    res.status(401).send(
      JSON.stringify({
        title: "Error 401 Authorization Required",
        message: err.mensaje,
      })
    );
  },
  e403: (req, res, err) => {
    console.log(err);
    res.status(403).send(
      JSON.stringify({
        title: "Error 403 Forbidden",
        message: err.mensaje,
      })
    );
  },
  e404: (req, res) => {
    res.status(404).send(
      JSON.stringify({
        title: "Error 404 Not Found",
        message: "The resource you are looking for does not exist.",
      })
    );
  },
  e500: (req, res, err) => {
    res.status(500).send(
      JSON.stringify({
        title: "Error 500 Internal Server",
        message: err.mensaje,
      })
    );
  },
};

export default error;
