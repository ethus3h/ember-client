package ember.Client;

import ember.ember.Client.ApiClient.ApiClient;
import ember.ember.Common.Exception.NoTerminalFoundException;
import ember.ember.Common.Exception.ZeroLengthInputException;
import ember.ember.Common.Process.ProcessManager;
import org.junit.Rule;
import org.junit.Test;
import org.junit.contrib.java.lang.system.StandardOutputStreamLog;

/**
 * Created by elliot on 14.10.29.
 */
public class ClientTest {

    @Test
    public void testCreateClient() throws Exception {
        Client c = new Client();

    }

    @Test
    public void testMain() throws Exception {
        Client c = new Client();
        c.main(new String[]{});
    }

    @Rule
    public final StandardOutputStreamLog log = new StandardOutputStreamLog();
    @Test
    public void testBegin() throws Exception {
        Client c = new Client();
        c.begin();
        org.junit.Assert.assertTrue(c.p instanceof ProcessManager);
        org.junit.Assert.assertTrue(log.getLog().startsWith("Hello! Ember is starting now. Please wait; it may take a little while...\n"));

    }
}
