package ember;

import ember.Client.Session.Session;
import ember.Common.Exception.CommandExecutionError;
import org.w3c.dom.*;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Paths;

/**
 * Created by elliot on 14.11.27.
 */
public class Parser {
    public Document parseFile(String path) throws IOException {
        return parseBytes(Files.readAllBytes(Paths.get(path)));
    }
    public Document parseString(String input) {
        return parseBytes(input.getBytes(StandardCharsets.UTF_8));
    }
    public Document parseBytes(byte[] input) {
        getoutRuntime rt = Runtime.getRuntime();
        String[] commands = {"system.exe","-get t"};
        Process proc = rt.exec(commands);

        BufferedReader stdInput = new BufferedReader(new
                InputStreamReader(proc.getInputStream()));

        BufferedReader stdError = new BufferedReader(new
                InputStreamReader(proc.getErrorStream()));

// read the output from the command
        System.out.println("Here is the standard output of the command:\n");
        String s = null;
        while ((s = stdInput.readLine()) != null) {
            System.out.println(s);
        }

// read any errors from the attempted command
        System.out.println("Here is the standard error of the command (if any):\n");
        while ((s = stdError.readLine()) != null) {
            System.out.println(s);
        }
        return null;
    }
}
