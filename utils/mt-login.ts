export const config = {
  grant_type: "authorization_code",
  client_id: "projeto-template-integracao",
  redirect_uri: `${process.env.BASE_URL}/login`,

  url_token:
    "https://dev.login.mt.gov.br/auth/realms/mt-realm/protocol/openid-connect/token",
  url_userInfo:
    "https://dev.login.mt.gov.br/auth/realms/mt-realm/protocol/openid-connect/userinfo",

  url_login: `https://dev.login.mt.gov.br/auth/realms/mt-realm/protocol/openid-connect/auth?client_id=projeto-template-integracao&redirect_uri=${process.env.BASE_URL}/login&response_type=code`,
  url_logout: `https://dev.login.mt.gov.br/auth/realms/mt-realm/protocol/openid-connect/logout?client_id=projeto-template-integracao&redirect_uri=${process.env.BASE_URL}/login&response_type=code`,
};
