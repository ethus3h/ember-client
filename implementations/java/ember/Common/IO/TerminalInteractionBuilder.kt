package ember.Common.IO

import ember.Common.Exception.NoTerminalFoundException

import java.io.Console

/**
 * Created by elliot on 14.11.12.
 * Talk to a user on System.console and get yes/no input working
 */
class TerminalInteractionBuilder {

    var hasTerminal: Boolean = false
    private var yes: String? = null
    private var no: String? = null
    var term: Console? = null

    @Throws(NoTerminalFoundException::class)
    internal fun getYes() {
        this.yes = this.ask("What key will you use to say \"Yes\"? ")
    }

    @Throws(NoTerminalFoundException::class)
    private fun getNo() {
        this.no = this.ask("What key will you use to say \"No\"? ")
    }

    fun testForTerminal() {
        this.term = System.console()
        if (this.term == null) {
            this.hasTerminal = false
        } else {
            this.hasTerminal = true
        }
    }


    @Throws(NoTerminalFoundException::class)
    fun start() {
        this.testForTerminal()
        this.getInputTraits()

    }

    @Throws(NoTerminalFoundException::class)
    fun getInputTraits() {
        if (this.hasTerminal) {
            this.getYes()
            this.getNo()
        } else {
            throw NoTerminalFoundException()
        }
    }

    fun say(s: String) {
        println(s)
    }

    @Throws(NoTerminalFoundException::class)
    fun ask(q: String): String {
        if (this.hasTerminal) {
            return this.term!!.readLine(q)
        }
        throw NoTerminalFoundException()
    }
}
