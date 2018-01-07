package ember.Common


import ember.Common.DataProcessor.HashGenerator
import ember.Common.Exception.CorruptedSafeDataException

import java.security.NoSuchAlgorithmException

/**
 * Created by PermissionGiver on 8/16/14.
 */
class SafeData @Throws(NoSuchAlgorithmException::class)
constructor(var data: ByteArray) {

    var length: Int = 0
    var md5: String
    var sha: String
    var s29: String
    var crc: String

    init {
        length = data.size
        val h = HashGenerator()
        md5 = h.md5(data)
        sha = h.sha(data)
        s29 = h.s29(data)
        crc = h.crc(data)

    }

    fun nukemd5() {
        md5 = ""
    }

    fun nukesha() {
        sha = ""
    }

    fun nukes29() {
        s29 = ""
    }

    fun nukecrc() {
        crc = ""
    }

    @Throws(NoSuchAlgorithmException::class, CorruptedSafeDataException::class)
    fun check() {
        checkmd5()
        checksha()
        checks29()
        checkcrc()
    }

    @Throws(NoSuchAlgorithmException::class, CorruptedSafeDataException::class)
    fun checkmd5() {
        val h = HashGenerator()
        if (this.md5 != h.md5(data)) {
            throw CorruptedSafeDataException()
        }
    }

    @Throws(NoSuchAlgorithmException::class, CorruptedSafeDataException::class)
    fun checksha() {
        val h = HashGenerator()
        if (this.sha != h.sha(data)) {
            throw CorruptedSafeDataException()
        }
    }

    @Throws(NoSuchAlgorithmException::class, CorruptedSafeDataException::class)
    fun checks29() {
        val h = HashGenerator()
        if (this.s29 != h.s29(data)) {
            throw CorruptedSafeDataException()
        }
    }

    @Throws(NoSuchAlgorithmException::class, CorruptedSafeDataException::class)
    fun checkcrc() {
        val h = HashGenerator()
        if (this.crc != h.crc(data)) {
            throw CorruptedSafeDataException()
        }
    }
}
