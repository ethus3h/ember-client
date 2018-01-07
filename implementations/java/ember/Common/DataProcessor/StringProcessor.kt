package ember.Common.DataProcessor

import ember.Common.Exception.ZeroLengthInputException

/**
 * Created by elliot on 14.11.01.
 */
class StringProcessor {
    @Throws(ZeroLengthInputException::class)
    fun removeLastCharacter(s: String): String {
        //from http://stackoverflow.com/questions/7438612/how-to-remove-the-last-character-from-a-string
        if (s.length == 0) {
            throw ZeroLengthInputException()
        }
        return s.substring(0, s.length - 1)
    }
}
