const admin = require('firebase-admin')
const { google } = require('googleapis')
const axios = require('axios')

const MESSAGING_SCOPE = 'https://www.googleapis.com/auth/firebase.messaging'
const SCOPES = [MESSAGING_SCOPE]

const serviceAccount = require('./messanging-fbf79-firebase-adminsdk-kag1v-664f36ff55.json')
const databaseURL = 'https://messanging-fbf79.firebaseio.com'
const URL =
  'https://fcm.googleapis.com/v1/projects/messanging-fbf79/messages:send'
const deviceToken =
  'cjC1mBtCvqs:APA91bHXVsaOOk-FEcSHQXQzli5v_LV-0QVRaIXePqnTcaXWmSHUeCMwBDE2K0CGrb6b-8oech7z_xiyCn1BezgX1clWDqjWgQQBav1DFibdEAyuq6GSe6N_4c3-3EUR2--P9ysEAjB3'

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: databaseURL
})

function getAccessToken() {
  return new Promise(function(resolve, reject) {
    var key = serviceAccount
    var jwtClient = new google.auth.JWT(
      key.client_email,
      null,
      key.private_key,
      SCOPES,
      null
    )
    jwtClient.authorize(function(err, tokens) {
      if (err) {
        reject(err)
        return
      }
      resolve(tokens.access_token)
    })
  })
}

async function init() {
  const body = {
    message: {
      data: { key: 'value' },
      notification: {
        title: 'Notification title',
        body: 'Notification body'
      },
      webpush: {
        headers: {
          Urgency: 'high'
        },
        notification: {
          requireInteraction: 'true'
        }
      },
      token: deviceToken
    }
  }

  try {
    const accessToken = await getAccessToken()
    console.log('accessToken: ', accessToken)
    const { data } = await axios.post(URL, JSON.stringify(body), {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`
      }
    })
    console.log('name: ', data.name)
  } catch (err) {
    console.log('err: ', err.message)
  }
}

init()
