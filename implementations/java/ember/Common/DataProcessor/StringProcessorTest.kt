package ember.Common.DataProcessor

import ember.Common.Exception.ZeroLengthInputException
import org.junit.Test

/**
 * Created by elliot on 14.11.01.
 */
class StringProcessorTest {
    @Test
    @Throws(Exception::class)
    fun testNewStringProcessor() {
        val p = StringProcessor()


    }

    @Test
    @Throws(Exception::class, ZeroLengthInputException::class)
    fun testRemoveLastCharacter() {
        val p = StringProcessor()
        val s = "Doom!?"
        org.junit.Assert.assertEquals(p.removeLastCharacter(s), "Doom!")

    }

    @Test(expected = ZeroLengthInputException::class)
    @Throws(Exception::class, ZeroLengthInputException::class)
    fun testRemoveLastCharacterZero() {
        val p = StringProcessor()
        val s = ""
        org.junit.Assert.assertEquals(p.removeLastCharacter(s), "")
    }

    @Test
    @Throws(Exception::class, ZeroLengthInputException::class)
    fun testRemoveLastCharacterLenOne() {
        val p = StringProcessor()
        val s = "?"
        org.junit.Assert.assertEquals(p.removeLastCharacter(s), "")

    }

}
