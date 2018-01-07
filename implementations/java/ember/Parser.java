package ember;

import ember.Client.Session.Session;
import ember.Common.Exception.CommandExecutionError;
import org.apache.commons.io.IOUtils;
import org.w3c.dom.*;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Paths;

/**
 * Return a Document for working with in java from a ember larnguage document
 */
public class Parser {
    public Document parseFile(String path) throws IOException {
        return parseBytes(Files.readAllBytes(Paths.get(path)));
    }
    public Document parseString(String input) throws IOException {
        return parseBytes(input.getBytes(StandardCharsets.UTF_8));
    }
    public Document parseBytes(byte[] input) throws IOException {
        Runtime rt = Runtime.getRuntime();
        String[] commands = {"../../p6/parseDocument","-get t"};
        Process process = rt.exec(commands);

        // Read stdout of command
        byte[] stdout = IOUtils.toByteArray(process.getInputStream());

        return null;
    }
}
