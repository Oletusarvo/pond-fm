export const customUploadConfig = {
  endpoint: process.env.CUSTOM_UPLOAD_API,
  secret: process.env.URL_SIGN_SECRET,
  client: {
    id: process.env.LOCAL_UPLOAD_CLIENT_ID,
  },
};
