const express = require('express');
const path = require('path');
const QRCode = require('qrcode');
const crypto = require('crypto');
const presentationDefinition = require('./presentationDefinitionMock.json');

const app = express();
const PORT = 3000;

var nonce, state;

app.set('view engine', 'ejs');

app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));

app.get('/verifier/generate-auth-request-qr', async (req, res) => {
  try {
    const presentation_definition = JSON.stringify(presentationDefinition);
    nonce = crypto.randomBytes(16).toString('base64');
    state = crypto.randomBytes(16).toString('base64');

    const authorizationRequest = `OPENID4VP://authorize?client_id=https%3A%2F%2Fclient.example.org%2Fcb&presentation_definition=${presentation_definition}&response_type=vp_token&response_mode=direct_post&nonce=${nonce}&state=${state}&response_uri=/verifier/vp-response HTTP/1.1`;
    const qrCodeData = await QRCode.toDataURL(authorizationRequest);

    res.render('index', { title: 'Home', qrCodeData });
  } catch (error) {
    console.error('Error generating QR code:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.post('/verifier/vp-response', (req, res) => {
  console.log('vp response:', req);

  if (req.query.nonce !== nonce) {
    res.status(400).json({
      message: `Nonce is not matching with the one sent in request: generated value - ${nonce} & passed value - ${req.query.nonce}`,
    });
  } else if (req.query.state !== state) {
    res.status(400).json({
      message: `State value is not matching with the one sent in request: generated value - ${state} & passed value - ${req.query.state}`,
    });
  } else {
    res.status(200).json({
      message: 'Verifiable presentation is received successfully',
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
