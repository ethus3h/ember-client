;;; GNU Guix is free software; you can redistribute it and/or modify it
;;; under the terms of the GNU General Public License as published by
;;; the Free Software Foundation; either version 3 of the License, or (at
;;; your option) any later version.
;;;
;;; GNU Guix is distributed in the hope that it will be useful, but
;;; WITHOUT ANY WARRANTY; without even the implied warranty of
;;; MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
;;; GNU General Public License for more details.
;;;
;;; You should have received a copy of the GNU General Public License
;;; along with GNU Guix.  If not, see <http://www.gnu.org/licenses/>.

(define-module (dce dce)
  #:use-module (guix packages)
  #:use-module (guix download)
  #:use-module (guix build-system gnu)
  #:use-module (guix licenses)
  #:use-module (gnu packages vim))

(define-public ember-shared-error-notify
  (package
    (name "ember-shared-error-notify")
    (version "1.1.4.473")
    (source (origin
              (method url-fetch)
              (uri (string-append "http://web.archive.org/web/20200311033244if_/https://gitlab.com/ethus3h/ember-shared/-/archive/v" version "/ember-shared-v" version ".tar.gz"))
              (sha256
               (base32
                "0ww34r0xgbi997j1iwrph8b1dcrnlgqb11p1qyxv0qm7rw05ali6"))))
    (build-system gnu-build-system)
    (arguments '(#:phases (modify-phases %standard-phases (delete 'configure))))
    (inputs `(("xxd" ,xxd)))
    (synopsis "ember-shared error-notify script")
    (description "Guess what GNU Hello prints!")
    (home-page "https://www.gnu.org/software/hello/")
    (license agpl3+)))
