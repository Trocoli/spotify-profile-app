require("dotenv").config(); // get variables from env files
const express = require("express");
const queryString = require("query-string");
const axios = require("axios");

const app = express();
const port = 8888;

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URL = process.env.REDIRECT_URL;

// app.METHOD(PATH, HANDLER);

app.get("/", (req, res) => {
  const data = {
    name: "Ygorrrrrr",
    isAwesome: true,
  };
  res.json(data);
});

const generateRandomString = (length) => {
  // func to generate random string for security measures when dealing with access keys.
  let text = "";
  const possible =
    "ABCDEFGHIJKLMNOPQRSTUVXWYZabcdefghijklmnopqrstuvxwyz0123456789";
  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

const stateKey = "spotify_auth_state";

app.get("/login", (req, res) => {
  const state = generateRandomString(16);
  res.cookie(stateKey, state);

  const scope = ["user-read-private", "user-read-email", "user-top-read"].join(
    " "
  );

  const queryParams = queryString.stringify({
    client_id: CLIENT_ID,
    response_type: "code",
    redirect_uri: REDIRECT_URL,
    state,
    scope,
  });
  res.redirect(`https://accounts.spotify.com/authorize?${queryParams}`);
});

app.get("/callback", (req, res) => {
  const code = req.query.code || null;

  axios({
    method: "post",
    url: "https://accounts.spotify.com/api/token",
    data: queryString.stringify({
      grant_type: "authorization_code",
      code: code,
      redirect_uri: REDIRECT_URL,
    }),
    headers: {
      "content-type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${new Buffer.from(
        `${CLIENT_ID}:${CLIENT_SECRET}`
      ).toString("base64")}`,
    },
  })
    .then((response) => {
      if (response.status === 200) {
        const { access_token, refresh_token, expires_in } = response.data;

        const queryParams = queryString.stringify({
          access_token,
          refresh_token,
          expires_in,
        });

        // redirect to react app
        res.redirect(`http://localhost:3000/?${queryParams}`);

        //pass along tokens and query params

        // const {refresh_token} = response.data;
        // axios.get(`http://localhost:8888/refresh_token?refresh_token=${refresh_token}`)
        //.then(response => {
        //     res.send(`<pre>${JSON.stringify(response.data, null, 2)}</pre>`);
        // }).catch(err => res.send(err)) // testing of the refresh_topken api that we created

        // axios
        //   .get("http://api.spotify.com/v1/me", {
        //     headers: {
        //       Authorization: `${token_type} ${access_token}`,
        //     },
        //   })
        //   .then((response) => {
        //     res.send(`<pre>${JSON.stringify(response.data, null, 2)}</pre>`);
        //   })
        //   .catch((err) => {
        //     res.send(err);
        //   });
      } else {
        res.redirect(
          `/?${queryString.stringify({
            error: "invalid_token",
          })}`
        );
      }
      //   if (response.status === 200) {

      //     res.send(`<pre>${JSON.stringify(response.data, null, 2)}</pre>`);
      //   } else {
      //     res.send(response);
      //   }
    })
    .catch((err) => {
      res.send(err);
    });
});

app.get("/refresh_token", (req, res) => {
  const { refresh_token } = req.query;

  axios({
    method: "post",
    url: "https://accounts.spotify.com/api/token",
    data: queryString.stringify({
      grant_type: "refresh_token",
      refresh_token: refresh_token,
    }),
    headers: {
      "content-type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${new Buffer.from(
        `${CLIENT_ID}:${CLIENT_SECRET}`
      ).toString("base64")}`,
    },
  })
    .then((response) => {
      res.send(response.data);
    })
    .catch((err) => {
      res.send(err);
    });
});

app.listen(port, () => {
  console.log("express app liseting!");
});
