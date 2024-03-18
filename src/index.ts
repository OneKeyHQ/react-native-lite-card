import {
  Linking,
  NativeEventEmitter,
  NativeModules,
  Platform,
} from 'react-native';

import type { CallbackResult, CardInfo, PromiseResult } from './types';

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

  getLiteInfo() {
    return new Promise<PromiseResult<CardInfo>>((resolve) => {
      OKLiteManager.getLiteInfo(this.convertToPromise(resolve));
    });
  }

  checkNFCPermission() {
    return new Promise<PromiseResult<boolean>>((resolve) => {
      OKLiteManager.checkNFCPermission(this.convertToPromise(resolve));
    });
  }

  setMnemonic(mnemonic: string, pwd: string, overwrite = false) {
    return new Promise<PromiseResult<boolean>>((resolve) => {
      OKLiteManager.setMnemonic(
        mnemonic,
        pwd,
        overwrite,
        this.convertToPromise(resolve)
      );
    });
  }

  getMnemonicWithPin(pwd: string) {
    return new Promise<PromiseResult<string>>((resolve) => {
      OKLiteManager.getMnemonicWithPin(pwd, this.convertToPromise(resolve));
    });
  }

  changePin(oldPin: string, newPin: string) {
    return new Promise<PromiseResult<boolean>>((resolve) => {
      OKLiteManager.changePin(oldPin, newPin, this.convertToPromise(resolve));
    });
  }

  reset() {
    return new Promise<PromiseResult<boolean>>((resolve) => {
      OKLiteManager.reset(this.convertToPromise(resolve));
    });
  }

  convertToPromise<T>(
    resolve: (value: PromiseResult<T> | PromiseLike<PromiseResult<T>>) => void
  ) {
    return (...result: CallbackResult<T>) => {
      resolve({ error: result[0], data: result[1], cardInfo: result[2] });
    };
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
