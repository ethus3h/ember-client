package ember.Client.Session;

import ember.ember.Client.CommandProcessor;
import ember.ember.Client.Context;
import ember.ember.Common.Exception.UnknownSessionTypeException;
import ember.ember.Common.Process.ProcessManager;

/**
 * Created by elliot on 14.11.27.
 */
public class Session {
    public CommandProcessor commandProcessor;
    public boolean running = true;
    public Context context;
    public ProcessManager pm = new ProcessManager();

    public Session() {
        this.commandProcessor = new CommandProcessor(this);
    }
    public Session make(Context c) throws UnknownSessionTypeException {
        if(c.context == "terminal") {
            return new TerminalSession();
        }
        else if(c.context == "null") {
            return new NullSession();
        }
        throw new UnknownSessionTypeException();
    }

}
