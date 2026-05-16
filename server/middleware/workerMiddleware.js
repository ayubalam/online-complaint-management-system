const workerOnly = (req, res, next) => {
  if (
    req.user &&
    req.user.role === "worker"
  ) {
    next();
  } else {
    res.status(403).json({
      message:
        "Worker access only",
    });
  }
};

module.exports = {
  workerOnly,
};