export const config = {
  grant_type: "authorization_code",
  client_id: process.env.MT_LOGIN_CLIENT_ID,
  redirect_uri: `${process.env.BASE_URL}/login`,

  url_token:
    process.env.MT_LOGIN_URL + "/realms/mt-realm/protocol/openid-connect/token",
  url_userInfo:
    process.env.MT_LOGIN_URL +
    "/realms/mt-realm/protocol/openid-connect/userinfo",

  url_login:
    process.env.MT_LOGIN_URL +
    `/realms/mt-realm/protocol/openid-connect/auth?client_id=${process.env.MT_LOGIN_CLIENT_ID}&redirect_uri=${process.env.BASE_URL}/login&response_type=code`,
  url_logout:
    process.env.MT_LOGIN_URL +
    `/realms/mt-realm/protocol/openid-connect/logout?client_id=${process.env.MT_LOGIN_CLIENT_ID}&redirect_uri=${process.env.BASE_URL}/login&response_type=code`,
};
