package ember.Common.DataProcessor

import org.junit.Assert
import org.junit.Test

import java.security.MessageDigest

/**
 * Created by PermissionGiver on 8/16/14.
 */
class DataProcessorTest {
    @Test
    @Throws(Exception::class)
    fun testBin2hex() {
        val bytes = MessageDigest.getInstance("MD5").digest("Hello, World!".toByteArray(charset("UTF-8")))
        val d = DataProcessor()
        val hex = d.bin2hex(bytes)
        Assert.assertEquals("65a8e27d8879283831b664bd8b7f0ad4", hex)
    }

    @Test
    @Throws(Exception::class)
    fun testLong2hex() {
        val d = DataProcessor()
        val n = 3510043186L
        Assert.assertEquals("d1370232", d.dec2hex(n))
    }

    @Test
    @Throws(Exception::class)
    fun testLong2hexC() {
        val d = DataProcessor()
        val n = 3510043186L
        Assert.assertNotEquals("D1370232", d.dec2hex(n))
    }

    @Test
    @Throws(Exception::class)
    fun testInt2hex() {
        val d = DataProcessor()
        val n = 35100431
        Assert.assertEquals("217970f", d.dec2hex(n.toLong()))
    }
}
