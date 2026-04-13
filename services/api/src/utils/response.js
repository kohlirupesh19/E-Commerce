export function successResponse(data) {
  return {
    success: true,
    data,
    error: null
  };
}

export function failureResponse(error) {
  return {
    success: false,
    data: null,
    error
  };
}
