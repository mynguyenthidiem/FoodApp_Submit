import { getAuth, GoogleAuthProvider, signInWithCredential } from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

const WEB_CLIENT_ID = '152923343218-ardsn2ahhngvmbcqpt2dvge2b53ioc9i.apps.googleusercontent.com';

GoogleSignin.configure({
  webClientId: WEB_CLIENT_ID,
  offlineAccess: false,
});

export async function signInWithGoogle() {
  await GoogleSignin.hasPlayServices({
    showPlayServicesUpdateDialog: true,
  });

  try {
    await GoogleSignin.signOut();
  } catch (e) {
  }

  const result = await GoogleSignin.signIn();

  const idToken = result.data?.idToken ?? result.idToken;

  if (!idToken) {
    throw new Error("Can not get Google Token");
  }

  const credential = GoogleAuthProvider.credential(idToken);
  return signInWithCredential(getAuth(), credential);
}