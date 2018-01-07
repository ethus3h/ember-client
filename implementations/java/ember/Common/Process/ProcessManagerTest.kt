package ember.Common.Process

import ember.Common.Exception.classNotRunnableException
import org.junit.Test

/**
 * Created by elliot on 14.11.01.
 */
class ProcessManagerTest {
    @Test
    @Throws(Exception::class)
    fun testCreateProcessManager() {
        val p = ProcessManager()

    }

    @Test
    @Throws(Exception::class)
    fun testAddProcess() {
        val p = ProcessManager()
        p.start("Common.Process.Greeter")
    }

    @Test
    @Throws(Exception::class)
    fun testAddProcessWithArg() {
        val p = ProcessManager()
        p.start("Common.Process.Greeter", "Doom")
    }

    @Test
    @Throws(Exception::class)
    fun testGetNewestPid() {
        val p = ProcessManager()
        org.junit.Assert.assertTrue(p.getNewestPid() is Int)
        org.junit.Assert.assertTrue(p.getNewestPid() == -1)
    }

    @Test
    @Throws(Exception::class)
    fun testGetNewestPidAfter() {
        val p = ProcessManager()
        p.start("Common.Process.Greeter", "Doom")
        org.junit.Assert.assertTrue(p.getNewestPid() is Int)
        org.junit.Assert.assertTrue(p.getNewestPid() == 0)
    }

    @Test
    @Throws(Exception::class)
    fun testIsRunnable() {
        val p = ProcessManager()
        p.checkRunnable(Greeter::class.java)
    }

    @Test(expected = classNotRunnableException::class)
    @Throws(Exception::class)
    fun testAddProcessNotRunnable() {
        val p = ProcessManager()
        p.start("Common.Process.ProcessManager")
    }
}
