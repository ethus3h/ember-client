package ember.Common.IO

import ember.Common.Exception.NoTerminalFoundException
import org.junit.Test

import java.io.Console

/**
 * Created by elliot on 14.11.11.
 */
class TerminalInteractionBuilderTest {
    @Test
    @Throws(Exception::class)
    fun testCreateConsoleInteractionBuilder() {
        val b = TerminalInteractionBuilder()

    }

    @Test
    @Throws(Exception::class)
    fun testGetTerminal() {
        val b = TerminalInteractionBuilder()
        b.testForTerminal()


    }

    @Test
    @Throws(Exception::class)
    fun testTerminalValueReturned() {
        val b = TerminalInteractionBuilder()
        b.testForTerminal()
        org.junit.Assert.assertEquals(b.hasTerminal, false)

    }

    @Test(expected = NoTerminalFoundException::class)
    @Throws(Exception::class)
    fun testStart() {
        val b = TerminalInteractionBuilder()
        b.start()
    }

    @Test
    @Throws(Exception::class)
    fun testSay() {
        val b = TerminalInteractionBuilder()
        b.say("Hello, World!")

    }

    @Test(expected = NoTerminalFoundException::class)
    @Throws(Exception::class)
    fun testAsk() {
        val b = TerminalInteractionBuilder()
        b.ask("Hello, World? ")

    }

    @Test(expected = NoTerminalFoundException::class)
    @Throws(Exception::class)
    fun testGetYes() {
        val b = TerminalInteractionBuilder()
        b.getYes()

    }

    @Test(expected = NoTerminalFoundException::class)
    @Throws(Exception::class)
    fun testGetNo() {
        val b = TerminalInteractionBuilder()
        b.getYes()

    }

    @Test(expected = NoTerminalFoundException::class)
    @Throws(Exception::class)
    fun testGetInputTraits() {
        val b = TerminalInteractionBuilder()
        b.getInputTraits()

    }
}
