import error from "./error.js";

export let isAuthenticated = (req, res, next) => {
  if (req.session.user) {
    return next();
  } else {
    res.clearCookie("connect.sid", {
      path: "/",
      httpOnly: true,
      secure: false,
    });
  }
  error.e401(req, res, {
    message: "Unauthorized. Please log in.",
  });
};
