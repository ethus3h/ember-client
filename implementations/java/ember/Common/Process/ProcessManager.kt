package ember.Common.Process

import ember.Client.CommandProcessor
import ember.Client.Session.Session
import ember.Common.Exception.classNotRunnableException

import java.util.ArrayList

/**
 * Created by elliot on 14.11.01.
 */
class ProcessManager {
    var newestPid: Int? = -1
    private val processes = ArrayList<EmberProcessInstance>()
    @Throws(Exception::class)
    @JvmOverloads
    fun start(c: String, vararg args: String = null): EmberProcessInstance {
        return this.start(c, null as Session?, *args)
    }

    @Throws(classNotRunnableException::class)
    fun checkRunnable(c: Class<*>) {
        if (!EmberProcess::class.java.isAssignableFrom(c)) {
            throw classNotRunnableException()
        }
    }

    @Throws(Exception::class)
    fun start(cmd: String, s: Session, vararg args: String): EmberProcessInstance {
        this.checkRunnable(Class.forName("ember." + cmd))
        val p = EmberProcessInstance(s, cmd, args)
        this.processes.add(p)
        p.pid = this.processes.indexOf(p)
        this.newestPid = p.pid
        return p
    }
}
