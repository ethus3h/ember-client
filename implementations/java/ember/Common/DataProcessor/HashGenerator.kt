package ember.Common.DataProcessor

import java.security.MessageDigest
import java.security.NoSuchAlgorithmException
import java.util.zip.CRC32
import java.util.zip.Checksum

/**
 * Created by PermissionGiver on 8/16/14.
 */
class HashGenerator {


    private val dataProcessor = DataProcessor()

    @Throws(NoSuchAlgorithmException::class)
    fun md5(data: ByteArray): String {
        val md = MessageDigest.getInstance("MD5")
        val md5bytes = md.digest(data)
        return dataProcessor.bin2hex(md5bytes)
    }

    fun bin2hex(md5bytes: ByteArray): String {
        return dataProcessor.bin2hex(md5bytes)
    }

    @Throws(NoSuchAlgorithmException::class)
    fun sha(data: ByteArray): String {
        val md = MessageDigest.getInstance("SHA-1")
        val shabytes = md.digest(data)
        return dataProcessor.bin2hex(shabytes)
    }

    @Throws(NoSuchAlgorithmException::class)
    fun s29(data: ByteArray): String {
        val md = MessageDigest.getInstance("SHA-512")
        val s29bytes = md.digest(data)
        return dataProcessor.bin2hex(s29bytes)
    }

    @Throws(NoSuchAlgorithmException::class)
    fun crc(data: ByteArray): String {
        /* help from http://www.java-examples.com/generate-crc32-checksum-byte-array-example */
        val checksum = CRC32()
        checksum.update(data, 0, data.size)
        val lngChecksum = checksum.value
        return dataProcessor.dec2hex(lngChecksum)
    }
}
