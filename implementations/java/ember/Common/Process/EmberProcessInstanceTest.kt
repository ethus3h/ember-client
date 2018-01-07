package ember.Common.Process

import org.junit.Test

/**
 * Created by elliot on 14.11.01.
 */
class EmberProcessInstanceTest {
    @Test
    @Throws(Exception::class)
    fun testCreateProcess() {
        val args: Array<String>? = null
        val e = ProcessManager()
        val a = e.start("Common.Process.Greeter", *args)
        org.junit.Assert.assertTrue(a.pid is Int)
    }

    @Test
    @Throws(Exception::class)
    fun testCreateProcessNoArgs() {
        val e = ProcessManager()
        val a = e.start("Common.Process.Greeter")
        org.junit.Assert.assertTrue(a.pid is Int)
    }
}
