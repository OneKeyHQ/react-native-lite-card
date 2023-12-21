package so.onekey.app.wallet.utils

import so.onekey.app.wallet.onekeyLite.NfcConstant
import so.onekey.app.wallet.LoggerManager

object LogUtil {
    @JvmStatic
    fun printLog(tag: String, msg: String) {
        if (NfcConstant.DEBUG) LoggerManager.getInstance()?.logInfo("$tag: $msg")
    }
}
