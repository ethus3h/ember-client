package ember.Common.DataProcessor

import org.apache.commons.codec.binary.Hex

class DataProcessor {

    fun bin2hex(md5bytes: ByteArray): String {
        val encoder = Hex()
        return encoder.encodeHexString(md5bytes)
    }

    fun dec2hex(n: Long): String {
        return java.lang.Long.toHexString(n).toLowerCase()
    }

}