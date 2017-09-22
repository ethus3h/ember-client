#!/usr/bin/env perl6

use v6.c;
use Test;
use Grammar::Tracer;

grammar EM {
    token TOP {
        <block>
    }
    token unterminatedLine {
        " "* <lineContents>
    }
    token terminatedBlock {
        <block> \n
    }
    token block {
        [<line>]* <unterminatedLine>?
    }

    token line {
        <unterminatedLine> \n
    }
    token lineContents {
        <declaration> |
        <invocation> |
        ''
    }

    token declaration {
        [
            <identifier> [ \= <value> ]?
        ] |
        [
            <identifier> ' ' \= ' ' <value>
        ]
    }
    token invocation {
        <identifier> ' '? <parameterList>
    }

    token identifier {
        [ <type> ' ' ]?
        <escapedString>
        [ ' '? <parameterList> ]?
    }
    token value {
        <literal> |
        <identifier> |
        <invocation>
    }
    token parameterList {
        <nullParameterList> |
        <emptyParameterList> |
        <regularParameterList> |
        <parenthesizedParameterList>
    }

    token type {
        'String' |
        \*
    }
    token escapedString {
        [\w|[\\\N]]+
    }
    token literal {
        <number>
    }
    token nullParameterList {
        ''
    }
    token emptyParameterList {
        \( \)
    }
    token regularParameterList {
        <parameterListBody>
    }
    token parenthesizedParameterList {
        \( <parameterListBody> \)
    }

    token number {
        \d+
    }
    token parameterListBody {
        <parameter>* % ', '
    }

    token parameter {
        <optionalParameter> || <requiredParameter>
    }

    token optionalParameter {
        [
            <type> |
            <identifier>
        ] \?
    }
    token requiredParameter {
        <declaration> |
        [ <type> | <identifier> | <value> ]
    }
}

sub run-silenced (&code) {
    temp $*OUT = temp $*ERR = class {
        BEGIN {
            ::?CLASS.^add_method: $_, my method (*@) {} for qw/say put print print-nl/
        }
    }.new;
    code;
}

sub runParserTest(Str $code, Str $rule, Bool $fail = False) {
    if $fail {
        if ! run-silenced { EM.parse($code, :$rule) } {
            say EM.parse($code, :$rule);
            fail "Parsing failed.";
        }
        else {
            return True;
        }
    }
    else {
        if run-silenced { EM.parse($code, :$rule) } {
            say EM.parse($code, :$rule);
            fail "Parsing unexpectedly succeeded.";
        }
        else {
            return True;
        }
    }
}

say 'Testing optionalParameter';

ok runParserTest('String qux?', 'optionalParameter');

say 'Testing parameter';

ok runParserTest('*', 'parameter');
ok runParserTest('String qux?', 'parameter');
nok runParserTest('String qux?,', 'parameter', True);

say 'Testing parameterListBody';

ok runParserTest('String, String qux?, String', 'parameterListBody');
ok runParserTest('String, String qux?', 'parameterListBody');
ok runParserTest('', 'parameterListBody');
ok runParserTest('*', 'parameterListBody');
ok runParserTest('String qux, *', 'parameterListBody');
ok runParserTest('String qux?, *', 'parameterListBody'); #
ok runParserTest('String qux?', 'parameterListBody');
ok runParserTest('String, *', 'parameterListBody');
ok runParserTest('String, String qux, String', 'parameterListBody');
ok runParserTest('String, String qux?, *', 'parameterListBody'); #
ok runParserTest('String, String qux?', 'parameterListBody');
ok runParserTest('String, String qux', 'parameterListBody');
ok runParserTest('String?, *', 'parameterListBody');

say 'Testing parenthesizedParameterList';

ok runParserTest('(String, String qux?)', 'parenthesizedParameterList');

say 'Testing parameterList';

ok runParserTest('(String, String qux?)', 'parameterList');
ok runParserTest('()', 'parameterList');
ok runParserTest('(*)', 'parameterList');
ok runParserTest('(String, *)', 'parameterList');
ok runParserTest('(String, String qux?, *)', 'parameterList');
ok runParserTest('(String, String qux?)', 'parameterList');
ok runParserTest('(String, String qux)', 'parameterList');

say 'Testing identifier';

ok runParserTest('foo(String, String qux?)', 'identifier');
ok runParserTest('foo', 'identifier');
ok runParserTest('foo(String, String qux?, *)', 'identifier');

say 'Testing invocation';

ok runParserTest('foo(String, String qux?)', 'invocation');
ok runParserTest('foo (bar, baz)', 'invocation');
ok runParserTest('foo bar 6 qux', 'invocation');
ok runParserTest('foo bar baz', 'invocation');
ok runParserTest('foo bar', 'invocation');
ok runParserTest('foo qux=6 bar', 'invocation');
ok runParserTest('foo(bar 6 qux)', 'invocation');
ok runParserTest('foo(bar baz)', 'invocation');
ok runParserTest('foo(bar, baz', 'invocation');
ok runParserTest('foo(bar, baz)', 'invocation');
ok runParserTest('foo(bar,baz)', 'invocation');
ok runParserTest('foo(bar)', 'invocation');
ok runParserTest('foo(qux=6 bar)', 'invocation');

say 'Testing lineContents';

ok runParserTest('', 'lineContents');
ok runParserTest('* foo', 'lineContents');
ok runParserTest('foo', 'lineContents');
ok runParserTest('foo()', 'lineContents');
ok runParserTest('foo(bar)', 'lineContents');
ok runParserTest('foo(String, String qux, String baz)', 'lineContents');
ok runParserTest('foo(String, String qux?, String baz)', 'lineContents');
ok runParserTest('foo(String, String qux?, *)', 'lineContents');
ok runParserTest('foo=5', 'lineContents');
ok runParserTest('String qux?', 'lineContents');
ok runParserTest('foo(String, String qux?)', 'lineContents');
ok runParserTest('foo(String, String, String)', 'lineContents');
ok runParserTest('foo(String, String qux?, String)', 'lineContents');

say 'Testing TOP';

ok runParserTest('', 'TOP');
ok runParserTest('foo', 'TOP');
ok runParserTest('foo()', 'TOP');
ok runParserTest('foo(bar)', 'TOP');
ok runParserTest('foo=5', 'TOP');

say "Done running tests. Report:";
done-testing;
# my $m = EM.parse(Q[String foo(String, String qux?, *):
# foo(bar baz)
# foo(qux=6 bar)]);
# my $n = Q[    say $!par[1]$!par[2]$qux
# 
# # Test simple invocation
# foo(bar baz)
# foo(bar 6 qux) # qux is 6, param 0 is bar, param 1 is 6, and param 2 is qux
# foo(qux=6 bar) # qux is still 6, but now parameter 0 is 6 and 1 is bar
# 
# # Test simple invocation, parenthesis-less style
# foo bar baz
# foo bar 6 qux # qux is 6, param 0 is bar, param 1 is 6, and param 2 is qux
# foo qux=6 bar # qux is still 6, but now parameter 0 is 6 and 1 is bar
# 
# # Test invocation with "invoke"
# routineName="foo"
# invoke $routineName bar baz
# ];
# say $m;
