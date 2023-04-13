export function requireAuthentication(gssp) {
  return async (context) => {
    const { req, res } = context;
    const token = req.cookies.token;

    if (!token) {
      return {
        redirect: {
          destination: "/",
        },
      };
    }

    return await gssp(context);
  };
}
