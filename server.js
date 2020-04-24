const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const app = express();

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Origin, Accept');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'POST, PUT, DELETE, GET, OPTIONS'
  );
  next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/api/test', (req,res)=>{
  res.json({message:"get successfully"})
})
app.post('/api/transfer', async (req, res, next) => {
  console.log('sent');
  const token = 'YmZlOGM5NTMwZDMyYTljYjZlNjk5MDg4';
  const spDeposit = 'SP50220000475';
  const spDebit = 'SP30210000482';
  axios
    .post(
      'https://api.sunabar.gmo-aozora.com/personal/v1/transfer/spaccounts-transfer',
      {
        depositSpAccountId: spDeposit,
        debitSpAccountId: spDebit,
        currencyCode: 'JPY',
        paymentAmount: req.body.amount,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'X-Access-Token': token,
        },
      }
    )
    .then((result) => {
    console.log('result', result)
      res
        .status(200)
        .json({
          data: JSON.parse(result.config.data),
          message: 'Request Sent Successfully',
        });
    })
    .catch((error) => {
      res.status(500).json({ errorCode: 500, message: 'request failed' });
    });
});
app.use((error, req, res, next) => {
  const statusCode = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(statusCode).json({ message, data });
});

app.listen(9000);
