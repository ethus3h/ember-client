#!/usr/bin/env perl6

use v6.c;
use Test;
use Grammar::Tracer;
use Grammar::ErrorReporting;

# Main grammar
(
    grammar EM does Grammar::ErrorReporting {
        token TOP {
            <block>
        }
        token block {
            [
                '( ' ~ ' )' "bar"
            ] ||
            "foo"
        }
    }
);

# Test suite
(
    nok runParserTest('foo(bar, baz', 'invocation', True);
    ok runParserTest(Q[@makeParseFail], 'TOP');

    say "Done running tests. Report:";
    done-testing;
);

# Testing support code
(
    sub run-silenced (&code) {
        temp $*OUT = temp $*ERR = class {
            BEGIN {
                ::?CLASS.^add_method: $_, my method (*@) {} for qw/say put print print-nl/
            }
        }.new;
        code;
    }

    sub runParserTest(Str $code, Str $rule, Bool $fail = False) {
        try {
            CATCH {
                default {
                    if $fail {
                        say "Parsing threw an exception as expected."
                    }
                }
            }
            if $fail {
                if run-silenced { EM.parse($code, :$rule) } {
                #if EM.parse($code, :$rule) {
                    say EM.parse($code, :$rule);
                    say "Parsing unexpectedly succeeded.";
                    # Return success status because this is being called by the test runner, which if $fail is True should be set to expect this to fail.
                    return True;
                }
                else {
                    fail "Parsing failed as expected.";
                }
            }
            else {
                #if ! run-silenced { EM.parse($code, :$rule) } {
                if ! EM.parse($code, :$rule) {
                    say EM.parse($code, :$rule);
                    fail "Parsing unexpectedly failed.";
                }
                else {
                    return True;
                }
            }
        }
    }
);
