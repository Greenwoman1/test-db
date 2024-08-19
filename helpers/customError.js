class CustomError extends Error {
  constructor(message = "Internal Server Error", status = 500) {
    super(message);
    this.status = status;
  }
}

const createError = (message, status, res) => {
  return res.status(status).json({ message: message }).end(); // new CustomError(message, status);
};

module.exports = createError;