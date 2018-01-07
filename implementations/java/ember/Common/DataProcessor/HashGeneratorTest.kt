package ember.Common.DataProcessor

import org.junit.Assert
import org.junit.Test

import java.security.MessageDigest

class HashGeneratorTest {

    @org.junit.Test
    @Throws(Exception::class)
    fun testCreateHashGenerator() {
        val h = HashGenerator()


    }

    @Test
    @Throws(Exception::class)
    fun testCreateMD5Sum() {
        val h = HashGenerator()
        h.md5("Hello, World!".toByteArray(charset("UTF-8")))

    }

    @Test
    @Throws(Exception::class)
    fun testBin2hex() {
        val md5bytes = MessageDigest.getInstance("MD5").digest("Hello, World!".toByteArray(charset("UTF-8")))
        val h = HashGenerator()
        val md5 = h.bin2hex(md5bytes)
        Assert.assertEquals("65a8e27d8879283831b664bd8b7f0ad4", md5)
    }

    @Test
    @Throws(Exception::class)
    fun testMd5Sum() {
        val h = HashGenerator()
        Assert.assertEquals("65a8e27d8879283831b664bd8b7f0ad4", h.md5("Hello, World!".toByteArray(charset("UTF-8"))))
    }

    @Test
    @Throws(Exception::class)
    fun testCreateSHA() {
        val h = HashGenerator()
        val sha = h.sha("Hello, World!".toByteArray(charset("UTF-8")))
        Assert.assertEquals("0a0a9f2a6772942557ab5355d76af442f8f65e01", sha)
    }

    @Test
    @Throws(Exception::class)
    fun testCreateS29() {
        val h = HashGenerator()
        val s29 = h.s29("Hello, World!".toByteArray(charset("UTF-8")))
        Assert.assertEquals("374d794a95cdcfd8b35993185fef9ba368f160d8daf432d08ba9f1ed1e5abe6cc69291e0fa2fe0006a52570ef18c19def4e617c33ce52ef0a6e5fbe318cb0387", s29)
    }

    @Test
    @Throws(Exception::class)
    fun testCreateCRC() {
        val h = HashGenerator()
        val crc = h.crc("Hello, World!".toByteArray(charset("UTF-8")))
        Assert.assertEquals("ec4ac3d0", crc)
    }
}