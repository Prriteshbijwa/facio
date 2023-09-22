import {Button, Linking, PermissionsAndroid, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import WebView from 'react-native-webview';

const App = () => {
  const [hasCameraPermission, setHasCameraPermission] = useState(false);

  const requestCameraPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'Camera Permission',
          message: 'We need your camera permission to do something cool!',
        },
      );

      console.log(granted);

      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        setHasCameraPermission(true);
      } else if (granted === PermissionsAndroid.RESULTS.DENIED) {
        alert('Camera permission denied. Please enable it in app settings.');
      } else if (granted === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
        alert(
          'Camera permission denied with "Never ask again" selected. Please enable it in app settings.',
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  const openAppSettings = () => {
    Linking.openSettings();
  };

  let html = `<!DOCTYPE html>
  <html lang="en">
  
  <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>FACEIO Integration Boilerplate</title>
      <style>
          .container {
              text-align: center;
          }
  
          button {
              padding: 10px 20px;
              font-size: 18px;
          }
      </style>
  </head>
  
  <body>
      <div class="container">
          <h1>FACEIO Integration Boilerplate</h1><br>
          <button onclick="enrollNewUser()" title="Enroll a new user on this FACEIO application">Enroll New User</button>
          <button onclick="authenticateUser()"
              title="Authenticate a previously enrolled user on this application">Authenticate User</button>
      </div>
      <div id="faceio-modal"></div>
      <script src="https://cdn.faceio.net/fio.js"></script>
      <script type="text/javascript">
          // Initialize the library first with your application Public ID.
          // Grab your public ID from the Application Manager on the FACEIO console at: https://console.faceio.net/
          const faceio = new faceIO("fioa535c"); // Replace with your application Public ID
          function enrollNewUser() {
            
              // Start the facial enrollment process
              faceio.enroll({
                  "locale": "auto", // Default user locale
                  "userConsent": false, // Set to true if you have already collected user consent
                  "payload": {
                      /* The payload we want to associate with this particular user
                      * which is forwarded back to us on each of his future authentication...
                      */
                      "whoami": "yogesh", // Example of dummy ID linked to this particular user
                      "email": "badgujaryogesh12341@gmail.com"
                  }
              }).then(userInfo => {
                  // User Successfully Enrolled!
                  console.log(userInfo);
                  // handle success, save the facial ID, redirect to dashboard...
              }).catch(errCode => {
                  // handle enrollment failure. Visit:
                  // https://faceio.net/integration-guide#error-codes
                  // for the list of all possible error codes
                  handleError(errCode);
                  // If you want to restart the session again without refreshing the current TAB. Just call:
                  faceio.restartSession();
                  // restartSession() let you enroll the same user again (in case of failure)
                  // without refreshing the entire page.
                  // restartSession() is available starting from the PRO plan and up, so think of upgrading your app
                  // for user usability.
              });
          }
          function authenticateUser() {
              // Start the facial authentication process (Identify a previously enrolled user)
              faceio.authenticate({
                  "locale": "auto" // Default user locale
              }).then(userData => {
                  console.log("Success, user recognized")
                  // Grab the facial ID linked to this particular user which will be same
                  // for each of his successful future authentication. FACEIO recommend
                  // that your rely on this ID if you plan to uniquely identify
                  // all enrolled users on your backend for example.
                  console.log("Linked facial Id: " + userData.facialId)
                  // Grab the arbitrary data you have already linked (if any) to this particular user
                  // during his enrollment via the payload parameter the enroll() method takes.
                  console.log("Associated Payload: " + JSON.stringify(userData.payload))
                  // {"whoami": 123456, "email": "john.doe@example.com"} set via enroll()
              }).catch(errCode => {
                  // handle authentication failure. Visit:
                  // https://faceio.net/integration-guide#error-codes
                  // for the list of all possible error codes
                  handleError(errCode);
                  alert(JSON.stringify(errCode))
                  // If you want to restart the session again without refreshing the current TAB. Just call:
                  faceio.restartSession();
                  // restartSession() let you authenticate the same user again (in case of failure) 
                  // without refreshing the entire page.
                  // restartSession() is available starting from the PRO plan and up, so think of upgrading your app
                  // for user usability.
              });
          }
          function handleError(errCode) {
              // Log all possible error codes during user interaction..
              // Refer to: https://faceio.net/integration-guide#error-codes
              // for a detailed overview when these errors are triggered.
              switch (errCode) {
                  case fioErrCode.PERMISSION_REFUSED:
                      alert("Access to the Camera stream was denied by the end user");
                      break;
                  case fioErrCode.NO_FACES_DETECTED:
                      alert("No faces were detected during the enroll or authentication process");
                      break;
                  case fioErrCode.UNRECOGNIZED_FACE:
                      alert("Unrecognized face on this application's Facial Index");
                      break;
                  case fioErrCode.MANY_FACES:
                      alert("Two or more faces were detected during the scan process");
                      break;
                  case fioErrCode.FACE_DUPLICATION:
                      alert("User enrolled previously (facial features already recorded). Cannot enroll again!");
                      break;
                  case fioErrCode.MINORS_NOT_ALLOWED:
                      alert("Minors are not allowed to enroll on this application!");
                      break;
                  case fioErrCode.PAD_ATTACK:
                      alert("Presentation (Spoof) Attack (PAD) detected during the scan process");
                      break;
                  case fioErrCode.FACE_MISMATCH:
                      alert("Calculated Facial Vectors of the user being enrolled do not matches");
                      break;
                  case fioErrCode.WRONG_PIN_CODE:
                      alert("Wrong PIN code supplied by the user being authenticated");
                      break;
                  case fioErrCode.PROCESSING_ERR:
                      alert("Server side error");
                      break;
                  case fioErrCode.UNAUTHORIZED:
                      alert("Your application is not allowed to perform the requested operation (eg. Invalid ID, Blocked, Paused, etc.). Refer to the FACEIO Console for additional information");
                      break;
                  case fioErrCode.TERMS_NOT_ACCEPTED:
                      alert("Terms & Conditions set out by FACEIO/host application rejected by the end user");
                      break;
                  case fioErrCode.UI_NOT_READY:
                      alert("The FACEIO Widget could not be (or is being) injected onto the client DOM");
                      break;
                  case fioErrCode.SESSION_EXPIRED:
                      alert("Client session expired. The first promise was already fulfilled but the host application failed to act accordingly");
                      break;
                  case fioErrCode.TIMEOUT:
                      alert("Ongoing operation timed out (eg, Camera access permission, ToS accept delay, Face not yet detected, Server Reply, etc.)");
                      break;
                  case fioErrCode.TOO_MANY_REQUESTS:
                      alert("Widget instantiation requests exceeded for freemium applications. Does not apply for upgraded applications");
                      break;
                  case fioErrCode.EMPTY_ORIGIN:
                      alert("Origin or Referer HTTP request header is empty or missing");
                      break;
                  case fioErrCode.FORBIDDDEN_ORIGIN:
                      alert("Domain origin is forbidden from instantiating fio.js");
                      break;
                  case fioErrCode.FORBIDDDEN_COUNTRY:
                      alert("Country ISO-3166-1 Code is forbidden from instantiating fio.js");
                      break;
                  case fioErrCode.SESSION_IN_PROGRESS:
                      alert("Another authentication or enrollment session is in progress");
                      break;
                  case fioErrCode.NETWORK_IO:
                  default:
                      alert("Error while establishing network connection with the target FACEIO processing node");
                      break;
              }
          }
      </script>
  </body>
  
  </html>`;

  return (
    <View style={{flex: 1,marginTop:'20%'}}>
      <Button
        title="Request camera permission"
        onPress={requestCameraPermission}
      />
      {hasCameraPermission ? (
        <WebView
          source={{
            html: html,
          }}
        />
      ) : (
        <View>
          <Button title="Open App Settings" onPress={openAppSettings} />
        </View>
      )}
    </View>
  );
};

export default App;