import {
  Linking,
  NativeEventEmitter,
  NativeModules,
  Platform,
} from 'react-native';

import { CardErrors } from './types';

import type { Callback, CallbackError, CardInfo } from './types';

const { OKLiteManager } = NativeModules;

export type NfcConnectUiState = {
  code: number;
  message: string;
};

class OnekeyLite {
  UiEventEmitter: NativeEventEmitter | null = null;

  constructor() {
    if (Platform.OS !== 'android') return;
    this.UiEventEmitter = new NativeEventEmitter(OKLiteManager);
  }

  addConnectListener(listener: (event: NfcConnectUiState) => void) {
    this.removeConnectListeners();
    return this.UiEventEmitter?.addListener('nfc_ui_event', listener);
  }

  removeConnectListeners() {
    return this.UiEventEmitter?.removeAllListeners('nfc_ui_event');
  }

  addAccordListener() {
    if (Platform.OS !== 'android') return;
    const eventEmitter = new NativeEventEmitter(OKLiteManager);
    return eventEmitter.addListener('nfc_active_connection', () => {});
  }

  getLiteInfo(result: Callback<CardInfo>) {
    OKLiteManager.getLiteInfo(result);
  }

  checkNFCPermission(result: Callback<boolean>) {
    OKLiteManager.checkNFCPermission(result);
  }

  setMnemonic(
    mnemonic: string,
    pwd: string,
    result: Callback<boolean>,
    overwrite = false
  ) {
    OKLiteManager.setMnemonic(mnemonic, pwd, overwrite, result);
  }

  getMnemonicWithPin(pwd: string, result: Callback<string>) {
    try {
      OKLiteManager.getMnemonicWithPin(
        pwd,
        async (
          error: CallbackError | null,
          data: string | null,
          state: CardInfo | null
        ) => {
          result(error, data ? await data : null, state);
        }
      );
    } catch (error) {
      result({ code: CardErrors.ExecFailure, message: null }, null, null);
    }
  }

  changePin(oldPin: string, newPin: string, result: Callback<boolean>) {
    OKLiteManager.changePin(oldPin, newPin, result);
  }

  reset(result: Callback<boolean>) {
    OKLiteManager.reset(result);
  }

  cancel() {
    if (Platform.OS === 'android') OKLiteManager.cancel();
  }

  intoSetting() {
    if (Platform.OS === 'android') {
      OKLiteManager.intoSetting();
    } else {
      Linking.openSettings();
    }
  }
}

const onekeyLite = new OnekeyLite();
export default onekeyLite;
