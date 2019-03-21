var webPush = require('web-push');
var pushSubscription = {
  "endpoint": "https://android.googleapis.com/gcm/send/frKI-n-cG_g:APA91bHvt8GlR6yflC2CYk9yuF_0YNDxd3e_X1f9RshuXWQuYydURB8ydgbuX7WEH1GqeOllbDSfS0IN4TbMErsy-EVEY0CuZFdD51HvCAOvHxbleDqZr3vaMfTCm3oL8HqNq4clxAri",
  "keys": {
    "p256dh": "BJFYuDkqd39cNuXW0XBMxCUqvgqGONm1iZfIArUvlPbPtRTamHTkjlPvQo4xqxDKKnusLUd6fKwWrDV+d0GvqbA=",
    "auth": "R1Zv5V/bCGshAylgfuO59Q=="
  }
};
var payload = 'Here is a payload!';
var options = {
  gcmAPIKey: 'AAAADTtTafk:APA91bFpG-CnFMLEGrrHgA4Z_stXuRIGZnAWf9knKtf-151dKuRWVEM9wGkFBjcnNLs4qT02sPA4TuBXjlZ5CUjDEYlEA9kJJc2vEBoYlPbVrd7flLpQArm86jBZNNUSRummKbVLCt0K',
  TTL: 60
};
webPush.sendNotification(
    pushSubscription,
    payload,
    options
);