const AWS = require('aws-sdk');
const querystring = require('querystring');

const { Expo } = require('expo-server-sdk');

const expo = new Expo()

const postNotifications = (data, tokens) => {
  const messages = tokens.map(token => {
    return {
      to: token,
      sound: 'default',
      body: 'Message Test',
      data,
    }
  })
  
  console.log('trying to send the push buddy');
  
  expo.chunkPushNotifications(messages).map(expo.sendPushNotificationsAsync, expo)
  return Promise.all(
    expo.chunkPushNotifications(messages).map(expo.sendPushNotificationsAsync, expo)
  )
}

exports.handler = async (event, context) => {
    // TODO implement
    console.log(event);
    
    const params = querystring.parse(event.body);
    console.log(params)
    
    const response = {
        statusCode: 200,
        body: JSON.stringify([params['user_id'], 'Hello!', params]),
    };
    
    _ = await postNotifications({ some: 'data' }, [
        'ExponentPushToken[yBe08sIBCL4W1T2I8kGw6Y]',
    ])
    .then(() => console.log('success!'))
    .catch(err => console.log('ERR', err))
    
    return response;
};
