const AWS = require('aws-sdk');
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

async function requestHandler(request) {
  const queryParams = {
    TableName: 'poke-snap',
    Key: {
      username: request['username']//params['username']//event.body['username']//params['user_id']
    }
  };

  await sendPoke(queryParams);

  const response = {
    statusCode: 200,
    body: JSON.stringify({request}),
  };

  return response;
}


exports.handler = async (event, context) => {

  requestHandler(JSON.parse(event.body));

  return response;
};
