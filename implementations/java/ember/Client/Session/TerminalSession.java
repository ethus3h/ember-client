package ember.Client.Session;

import ember.ember.Client.Context;
import ember.ember.Client.TerminalInterfaceOperator;

/**
 * Created by elliot on 14.11.27.
 */
public class TerminalSession extends Session{

    public TerminalSession() {
        super();
        this.context = new Context("terminal");
        TerminalInterfaceOperator a = new TerminalInterfaceOperator(this);
        a.interactOnTerminal();
    }
}
