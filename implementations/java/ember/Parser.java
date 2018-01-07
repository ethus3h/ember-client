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
        return null;
    }
}
