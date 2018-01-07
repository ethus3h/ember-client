package ember.Common.Process

import ember.Client.Session.Session
import ember.Common.Process.EmberProcess

/**
 * Created by elliot on 14.11.01.
 */
class Greeter : EmberProcess {
    override fun run() {
        println("Hello, World!")
    }

    @Throws(Exception::class)
    override fun start(cmd: String, s: Session, vararg args: Any) {
        println("Hello, World!")
    }

    override fun processSignalHandler(signal: Int?) {

    }

    override fun pause() {

    }

    override fun resume() {

    }

    override fun terminate() {

    }

    override fun kill() {

    }
}
