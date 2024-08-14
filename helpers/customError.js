class CustomError extends Error {
  constructor(message = "Internal Server Error", status = 500) {
    super(message);
    this.status = status;
  }
}

const createError = (message, status) => {
  return new CustomError(message, status);
};

module.exports = createError;