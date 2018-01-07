package ember.Common.Process

import ember.Client.Session.Session
import ember.Common.Exception.*

import java.lang.reflect.InvocationTargetException
import java.lang.Thread


/**
 * Created by elliot on 14.11.01.
 */
class EmberProcessInstance : Runnable {
    private val args: Array<String>
    private val target: String
    var pid: Int? = null
    var session: Session? = null
    var e: Exception? = null
    var pm: ProcessManager? = null
    private var c: Class<*>? = null
    private val o: Any? = null

    @Throws(Exception::class)
    constructor(e: ProcessManager, c: String, args: Array<String>) {
        EmberProcessInstance(null as Session?, c, args)
    }

    @Throws(Exception::class)
    constructor(e: ProcessManager, c: String) {
        EmberProcessInstance(e, c, null)
    }

    @Throws(Exception::class)
    constructor(s: Session, c: String, args: Array<String>) {
        this.session = s
        this.target = c
        this.args = args
        if (this.session == null) {
            this.pm = null
        } else {
            this.pm = s.pm

        }
        this.start()
    }

    @Throws(Exception::class, classRunMethodMissingException::class)
    fun start() {
        Thread(this).start()
        if (this.e != null) {
            throw this.e
        }
    }

    override fun run() {
        try {
            this.execute(Class.forName("ember." + this.target), this.target, this.session, *this.args)
        } catch (e: Exception) {
            this.e = e
        }

    }

    fun passArgumentsAndBegin(s: Session, pm: ProcessManager, args: Array<String>) {

    }

    @Throws(IllegalAccessException::class, InstantiationException::class, classNotRunnableException::class, classRunMethodMissingException::class, classIllegalAccessException::class, classInvocationTargetException::class)
    private fun execute(c: Class<*>, target: String, s: Session?, vararg args: Any) {
        this.c = c
        var i: Int? = 0
        var argsLength: Int? = 0
        if (args != null) {
            argsLength = args.size
        }
        val argTypes = arrayOfNulls<Class<*>>(argsLength)
        if (args != null) {
            //Need to make sure that argTypes matches the arguments to pass to start
            argTypes[0] = Session::class.java
            for (o in args) {
                if (o != null) {
                    argTypes[i] = o.javaClass
                } else {
                    argTypes[i] = null
                }
                i++
            }
        }
        try {
            c.getDeclaredMethod("start", *argTypes).invoke(this.c!!.newInstance(), this.session, args)
        } catch (x: NoSuchMethodException) {
            throw classRunMethodMissingException()
        } catch (x: IllegalAccessException) {
            throw classIllegalAccessException()
        } catch (x: InvocationTargetException) {
            throw classInvocationTargetException()
        }

    }
}
