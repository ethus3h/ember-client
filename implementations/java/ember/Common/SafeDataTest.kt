package ember.Common

import ember.Common.Exception.CorruptedSafeDataException
import org.junit.Assert
import org.junit.Test

class SafeDataTest {

    @Test
    @Throws(Exception::class)
    fun testNewSafeData() {
        val d = SafeData("Hello, World!".toByteArray(charset("UTF-8")))
    }

    @Test
    @Throws(Exception::class)
    fun testSDLength() {
        val d = SafeData("Hello, World!".toByteArray(charset("UTF-8")))
        Assert.assertEquals(d.length.toLong(), "Hello, World!".length.toLong())
    }

    @Test
    @Throws(Exception::class)
    fun testSDmd5() {
        val d = SafeData("Hello, World!".toByteArray(charset("UTF-8")))
        Assert.assertEquals("65a8e27d8879283831b664bd8b7f0ad4", d.md5)

    }

    @Test
    @Throws(Exception::class)
    fun testSDsha() {
        val d = SafeData("Hello, World!".toByteArray(charset("UTF-8")))
        Assert.assertEquals("0a0a9f2a6772942557ab5355d76af442f8f65e01", d.sha)

    }

    @Test
    @Throws(Exception::class)
    fun testSDs29() {
        val d = SafeData("Hello, World!".toByteArray(charset("UTF-8")))
        Assert.assertEquals("374d794a95cdcfd8b35993185fef9ba368f160d8daf432d08ba9f1ed1e5abe6cc69291e0fa2fe0006a52570ef18c19def4e617c33ce52ef0a6e5fbe318cb0387", d.s29)


    }

    @Test
    @Throws(Exception::class)
    fun testSDcrc() {
        val d = SafeData("Hello, World!".toByteArray(charset("UTF-8")))
        Assert.assertEquals("ec4ac3d0", d.crc)


    }

    @Test
    @Throws(Exception::class, CorruptedSafeDataException::class)
    fun testSDCheck() {
        val d = SafeData("Hello, World!".toByteArray(charset("UTF-8")))
        d.check()
    }

    @Test
    @Throws(Exception::class)
    fun testSDNukeMD5() {
        val d = SafeData("Hello, World!".toByteArray(charset("UTF-8")))
        d.nukemd5()
    }

    @Test
    @Throws(Exception::class)
    fun testSDNukeSHA() {
        val d = SafeData("Hello, World!".toByteArray(charset("UTF-8")))
        d.nukesha()
    }

    @Test
    @Throws(Exception::class)
    fun testSDNukeS29() {
        val d = SafeData("Hello, World!".toByteArray(charset("UTF-8")))
        d.nukes29()
    }

    @Test
    @Throws(Exception::class)
    fun testSDNukeCRC() {
        val d = SafeData("Hello, World!".toByteArray(charset("UTF-8")))
        d.nukecrc()
    }

    @Test(expected = CorruptedSafeDataException::class)
    @Throws(Exception::class, CorruptedSafeDataException::class)
    fun testSDCkMD5() {
        val d = SafeData("Hello, World!".toByteArray(charset("UTF-8")))
        d.nukemd5()
        d.check()
    }

    @Test(expected = CorruptedSafeDataException::class)
    @Throws(Exception::class, CorruptedSafeDataException::class)
    fun testSDCkMD5i() {
        val d = SafeData("Hello, World!".toByteArray(charset("UTF-8")))
        d.nukemd5()
        d.checkmd5()
    }

    @Test(expected = CorruptedSafeDataException::class)
    @Throws(Exception::class, CorruptedSafeDataException::class)
    fun testSDCkSHA() {
        val d = SafeData("Hello, World!".toByteArray(charset("UTF-8")))
        d.nukesha()
        d.check()
    }

    @Test(expected = CorruptedSafeDataException::class)
    @Throws(Exception::class, CorruptedSafeDataException::class)
    fun testSDCkSHAi() {
        val d = SafeData("Hello, World!".toByteArray(charset("UTF-8")))
        d.nukesha()
        d.checksha()
    }

    @Test(expected = CorruptedSafeDataException::class)
    @Throws(Exception::class, CorruptedSafeDataException::class)
    fun testSDCkS29() {
        val d = SafeData("Hello, World!".toByteArray(charset("UTF-8")))
        d.nukes29()
        d.check()
    }

    @Test(expected = CorruptedSafeDataException::class)
    @Throws(Exception::class, CorruptedSafeDataException::class)
    fun testSDCkS29i() {
        val d = SafeData("Hello, World!".toByteArray(charset("UTF-8")))
        d.nukes29()
        d.checks29()
    }

    @Test(expected = CorruptedSafeDataException::class)
    @Throws(Exception::class, CorruptedSafeDataException::class)
    fun testSDCkCRC() {
        val d = SafeData("Hello, World!".toByteArray(charset("UTF-8")))
        d.nukecrc()
        d.check()
    }

    @Test(expected = CorruptedSafeDataException::class)
    @Throws(Exception::class, CorruptedSafeDataException::class)
    fun testSDCkCRCi() {
        val d = SafeData("Hello, World!".toByteArray(charset("UTF-8")))
        d.nukecrc()
        d.checkcrc()
    }
}