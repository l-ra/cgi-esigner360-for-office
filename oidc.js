
function oidcClient(){
    return {
        "realm": "cgi.esigner360.eu",
        "auth-server-url": "https://auth.cgi.esigner360.eu/auth/",
        "ssl-required": "external",
        "resource": "for-office-dev",
        "public-client": true,
        "confidential-port": 0
      }
}

function oidcMeta(){
    return {
        "issuer": "https://auth.cgi.esigner360.eu/auth/realms/cgi.esigner360.eu",
        "authorization_endpoint": "https://auth.cgi.esigner360.eu/auth/realms/cgi.esigner360.eu/protocol/openid-connect/auth",
        "token_endpoint": "https://auth.cgi.esigner360.eu/auth/realms/cgi.esigner360.eu/protocol/openid-connect/token",
        "introspection_endpoint": "https://auth.cgi.esigner360.eu/auth/realms/cgi.esigner360.eu/protocol/openid-connect/token/introspect",
        "userinfo_endpoint": "https://auth.cgi.esigner360.eu/auth/realms/cgi.esigner360.eu/protocol/openid-connect/userinfo",
        "end_session_endpoint": "https://auth.cgi.esigner360.eu/auth/realms/cgi.esigner360.eu/protocol/openid-connect/logout",
        "jwks_uri": "https://auth.cgi.esigner360.eu/auth/realms/cgi.esigner360.eu/protocol/openid-connect/certs",
        "check_session_iframe": "https://auth.cgi.esigner360.eu/auth/realms/cgi.esigner360.eu/protocol/openid-connect/login-status-iframe.html",
        "grant_types_supported": [
          "authorization_code",
          "implicit",
          "refresh_token",
          "password",
          "client_credentials"
        ],
        "response_types_supported": [
          "code",
          "none",
          "id_token",
          "token",
          "id_token token",
          "code id_token",
          "code token",
          "code id_token token"
        ],
        "subject_types_supported": [
          "public",
          "pairwise"
        ],
        "id_token_signing_alg_values_supported": [
          "PS384",
          "ES384",
          "RS384",
          "HS256",
          "HS512",
          "ES256",
          "RS256",
          "HS384",
          "ES512",
          "PS256",
          "PS512",
          "RS512"
        ],
        "id_token_encryption_alg_values_supported": [
          "RSA-OAEP",
          "RSA-OAEP-256",
          "RSA1_5"
        ],
        "id_token_encryption_enc_values_supported": [
          "A256GCM",
          "A192GCM",
          "A128GCM",
          "A128CBC-HS256",
          "A192CBC-HS384",
          "A256CBC-HS512"
        ],
        "userinfo_signing_alg_values_supported": [
          "PS384",
          "ES384",
          "RS384",
          "HS256",
          "HS512",
          "ES256",
          "RS256",
          "HS384",
          "ES512",
          "PS256",
          "PS512",
          "RS512",
          "none"
        ],
        "request_object_signing_alg_values_supported": [
          "PS384",
          "ES384",
          "RS384",
          "HS256",
          "HS512",
          "ES256",
          "RS256",
          "HS384",
          "ES512",
          "PS256",
          "PS512",
          "RS512",
          "none"
        ],
        "response_modes_supported": [
          "query",
          "fragment",
          "form_post"
        ],
        "registration_endpoint": "https://auth.cgi.esigner360.eu/auth/realms/cgi.esigner360.eu/clients-registrations/openid-connect",
        "token_endpoint_auth_methods_supported": [
          "private_key_jwt",
          "client_secret_basic",
          "client_secret_post",
          "tls_client_auth",
          "client_secret_jwt"
        ],
        "token_endpoint_auth_signing_alg_values_supported": [
          "PS384",
          "ES384",
          "RS384",
          "HS256",
          "HS512",
          "ES256",
          "RS256",
          "HS384",
          "ES512",
          "PS256",
          "PS512",
          "RS512"
        ],
        "claims_supported": [
          "aud",
          "sub",
          "iss",
          "auth_time",
          "name",
          "given_name",
          "family_name",
          "preferred_username",
          "email",
          "acr"
        ],
        "claim_types_supported": [
          "normal"
        ],
        "claims_parameter_supported": true,
        "scopes_supported": [
          "openid",
          "offline_access",
          "profile",
          "email",
          "address",
          "phone",
          "roles",
          "web-origins",
          "microprofile-jwt"
        ],
        "request_parameter_supported": true,
        "request_uri_parameter_supported": true,
        "require_request_uri_registration": true,
        "code_challenge_methods_supported": [
          "plain",
          "S256"
        ],
        "tls_client_certificate_bound_access_tokens": true,
        "revocation_endpoint": "https://auth.cgi.esigner360.eu/auth/realms/cgi.esigner360.eu/protocol/openid-connect/revoke",
        "revocation_endpoint_auth_methods_supported": [
          "private_key_jwt",
          "client_secret_basic",
          "client_secret_post",
          "tls_client_auth",
          "client_secret_jwt"
        ],
        "revocation_endpoint_auth_signing_alg_values_supported": [
          "PS384",
          "ES384",
          "RS384",
          "HS256",
          "HS512",
          "ES256",
          "RS256",
          "HS384",
          "ES512",
          "PS256",
          "PS512",
          "RS512"
        ],
        "backchannel_logout_supported": true,
        "backchannel_logout_session_supported": true
      }
}