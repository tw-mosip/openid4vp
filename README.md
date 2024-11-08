# openid4vp

**Description**: This is a Mock server implementing the protocols of OpenId4VP spec.

### Command to Start the Mock server

```
node app.js // execute this command in the root folder
```

### This exposes two end-points:
- Refer to app.js file for the below end-points.

### 1. /verifier/generate-auth-request-qr:

- This end-point can be used to generate the QR code with the Verifier's Authorization Request to
  fetch the Verifiable Credentials from the Wallet.
- Here configure the **response_uri** field of the **Authorization Request** with the actual
  end-point where we would like to receive the response. Here Localhost won't be accessible from the
  physical device, recommended using ngrok [https://ngrok.com/docs/getting-started/]  to generate a
  corresponding mapping url for the Localhost.

**Ex:**

```javascript
    const authorizationRequest = 
    "https://client.example.org/universal-link?
    response_type=vp_token
    &response_mode=direct_post
    &client_id=https%3A%2F%2Fclient.example.org%2Fcb
    &client_id_scheme=redirect_uri
    &redirect_uri=https%3A%2F%2Fclient.example.org%2Fcb
    &presentation_definition=...
    &nonce=n-0S6_WzA2Mj
    &client_metadata=%7B%22vp_formats%22:%7B%22jwt_vp_json%22:%
    7B%22alg%22:%5B%22EdDSA%22,%22ES256K%22%5D%7D,%22ldp
    _vp%22:%7B%22proof_type%22:%5B%22Ed25519Signature201
    8%22%5D%7D%7D%7D"
  ```

### 2. /verifier/vp-response:

- This is the response_uri end-point which is used to listen to the Verifiable Presentation response
  shared by the wallet and return the response back to the wallet to notify whether this server has
  received the response or not.
- It just receives the Verifiable Presentation response in the request body and returns
  the response but doesn't perform any validations on the received data. 

