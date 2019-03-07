const AWS = require('aws-sdk');
const querystring = require('querystring');
const { Expo } = require('expo-server-sdk');


AWS.config.update({
  region: "us-west-2",
  endpoint: "https://dynamodb.us-west-2.amazonaws.com"
});

const expo = new Expo()


const postNotifications = (data, tokens) => {
  const messages = tokens.map(token => {
    return {
      to: token,
      sound: 'default',
      body: 'Poke',
      data,
    }
  })

  console.log('Trying to send the push buddy');

  // expo.chunkPushNotifications(messages).map(expo.sendPushNotificationsAsync, expo)
  return Promise.all(
    expo.chunkPushNotifications(messages).map(expo.sendPushNotificationsAsync, expo)
  )
}

async function sendPoke(params) {
  const docClient = new AWS.DynamoDB.DocumentClient();

  _ = await docClient.get(params).promise()
    .then(async function (data) {
      // data.Item = {'expo-push-token': xxx, 'username': xxx}

      _ = await postNotifications({ 
        some: 'data' 
      }, [
        data.Item['expo-push-token'],
      ])
        .then(() => console.log('Success!'))
        .catch(err => console.log('ERR', err))
    })
    .catch((err) => {
      console.log(`DynamoDB GET failed with: ${err}`);
    });

  console.log('Sent Poke');
}


exports.handler = async (event, context) => {
  // console.log(event);

  const params = querystring.parse(event.body);
  console.log(`Query Parameters :`);
  console.log(params)
  console.log(`Event Body:`);
  console.log(event.body);
  console.log(`Username: ${event.body['username']}`);

  const queryParams = {
    TableName: 'poke-snap',
    Key: {
      username: JSON.parse(event.body)['username']//params['username']//event.body['username']//params['user_id']
    }
  }

  const response = {
    statusCode: 200,
    body: JSON.stringify({
      username: event.body['username'], 
      body: event.body, 
      params: params
    }),
  };

  _ = await sendPoke(queryParams)


  return response;
};
