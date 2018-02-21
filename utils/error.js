class APIError extends Error {
  constructor(status, msg) {
    super(msg);
    this.status = status;
    this.message = msg;
  }
}

module.exports = APIError;
