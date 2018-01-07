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
import java.nio.file.Path;
import java.nio.file.Paths;

/**
 * Return a Document for working with in Java from an Ember language document
 */
public class Parser {
    /**
     * Given a path (stored as a string) to a file accessible to the Java VM, return a Document object representing that file's contents parsed as Ember language document
     * @param path
     * @return
     * @throws IOException
     */
    public Document parseFileFromStringPath(String path) throws IOException {
        return parseFile(Paths.get(path));
    }

    /**
     * Given a path (stored as a byte array) to a file accessible to the Java VM, return a Document object representing that file's contents parsed as Ember language document
     * @param path
     * @return
     * @throws IOException
     */
    public Document parseFileFromBinaryPath(byte[] path) throws IOException {
        // TODO: Test this on a variety of filenames to make sure the Path object points to the right thing.
        return parseBytes(Files.readAllBytes(Paths.get(new String(path, StandardCharsets.ISO_8859_1))));
    }

    /**
     * Given a path (java.nio.file.Path) to a file accessible to the Java VM, return a Document object representing that file's contents parsed as Ember language document
     * @param path
     * @return
     * @throws IOException
     */
    public Document parseFile(Path path) throws IOException {
        return parseBytes(Files.readAllBytes(path));
    }

    /**
     * Given a string stored by Java (Java strings are UTF-16), return a Document object representing that string parsed as Ember language document
     * @param input
     * @return
     * @throws IOException
     */
    public Document parseString(String input) throws IOException {
        return parseBytes(input.getBytes(StandardCharsets.UTF_8));
    }

    /**
     * Given a bite array of UTF-8 text, return a Document object representing that string parsed as Ember language document
     * @param input
     * @return
     * @throws IOException
     */
    public Document parseBytes(byte[] input) throws IOException {
        Runtime rt = Runtime.getRuntime();
        String[] commands = {"../../p6/parseDocument","-get t"};
        Process process = rt.exec(commands);

        // Read stdout of command
        byte[] stdout = IOUtils.toByteArray(process.getInputStream());

        return null;
    }
}
