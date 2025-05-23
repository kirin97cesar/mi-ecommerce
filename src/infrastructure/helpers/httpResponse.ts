export const successResponse = ({ data, message, statusCode = 200 } : { 
  data: any,
  message: string, 
  statusCode: number 
}) => ({
    statusCode,
    body: {
      success: true,
      message,
      data,
    },
  });
  
export const errorResponse = ({ message, statusCode = 500, code = 'ERROR', params}: {
  message: string, 
  statusCode: number, 
  code: string,
  params?: any
}) => ({
  statusCode,
  body: {
    success: false,
    error: {
      message,
      code,
    },
    payload: params
  },
});
  