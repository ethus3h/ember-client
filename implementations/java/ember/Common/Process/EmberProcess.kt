package ember.Common.Process

import ember.Client.Session.Session

/**
 * Created by elliot on 14.11.01.
 */
interface EmberProcess {
    /**
     * Send a signal to the process.
     */
    fun processSignalHandler(signal: Int?)

    /**
     * Creating the object, for compatibility with Runnable
     */
    fun run()

    /**
     * Tell the process to start whatever it's supposed to do.
     */
    @Throws(Exception::class)
    fun start(cmd: String, s: Session, vararg args: Any)

    /**
     * Prepare for temporary suspension of execution.
     */
    fun pause()

    /**
     * Recover after suspension of execution.
     */
    fun resume()

    /**
     * Stop execution gracefully
     */
    fun terminate()

    /**
     * Stop execution immediately
     */
    fun kill()

    companion object {
        val state = "running"
    }
}
