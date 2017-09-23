#!/usr/bin/env perl6

use v6.c;
use Test;
use Grammar::Tracer;
use Grammar::ErrorReporting;

# This class is by Moritz Lenz. I hope they don't mind me using it
class SymbolTable {
    has @!scopes = {}, ;
    method enter-scope() {
        @!scopes.push({})
    }
    method leave-scope() {
        @!scopes.pop();
    }
    method declare($variable) {
        @!scopes[*-1]{$variable} = True
    }
    method check-declared($variable) {
        for @!scopes.reverse -> %scope {
            return True if %scope{$variable};
        }
        return False;
    }
}

my $*ST = SymbolTable.new;
grammar EM does Grammar::ErrorReporting {
    token TOP {
        <block>
    }
    method block {
        $*ST.enter-scope();
        LEAVE $*ST.leave-scope();
        self.block_wrapped();
    }
    token block_wrapped {
        [
            '{'
            [
                '    '{}
                <terminatedLine>]*
                <unterminatedLine>?
            ]
            '}'
        ]
    }

    token blockContents {
        <lineContents>
    }
    token unterminatedLine {
        <lineContents>
    }
    token terminatedLine {
        <unterminatedLine> \n
    }
    token lineContents {
        <declaration> ||
        <invocation> ||
        <bareDeclaration> ||
        ''
    }

    token declaration {
        [
            <identifier> '=' <value>
        ] ||
        [
            <identifier> ' = ' <value>
        ] ||
        [
            <identifier> ':' [ ' ' || \n ] <value>
        ]
    }
    token invocation {
        <identifier> ' '? <parameterList>
    }
    token bareDeclaration {
        <identifier>
    }

    token identifier {
        [
            [ <type> ' ' ]?
            <escapedString>
            [ ' '? <parameterList> ]?
        ] [ '.' <identifier> ]?
    }
    token reference {
        [ <type> ' ' ]?
        '$'<escapedString>
        [ ' '? <parameterList> ]?
    }
    token value {
        [
            <invocation> ||
            <reference> ||
            <identifier> ||
            <literal>
        ] <value>?
    }
    token parameterList {
        <parenthesizedParameterList> ||
        <regularParameterList> ||
        <emptyParameterList> ||
        <nullParameterList>
    }

    token type {
        'String' |
        \*
    }
    token escapedString {
        [\w|[\\\N]]+
    }
    token literal {
        <block> ||
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
    $*ST = SymbolTable.new;
    if $fail {
        if run-silenced { EM.parse($code, :$rule) } {
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
        if ! run-silenced { EM.parse($code, :$rule) } {
            say EM.parse($code, :$rule);
            fail "Parsing unexpectedly failed.";
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

ok runParserTest('', 'parameterListBody');
ok runParserTest('*', 'parameterListBody');
ok runParserTest('String qux, *', 'parameterListBody');
ok runParserTest('String qux?, *', 'parameterListBody');
ok runParserTest('String qux?', 'parameterListBody');
ok runParserTest('String, *', 'parameterListBody');
ok runParserTest('String, String qux, String', 'parameterListBody');
ok runParserTest('String, String qux?, *', 'parameterListBody');
ok runParserTest('String, String qux?, String', 'parameterListBody');
ok runParserTest('String, String qux?', 'parameterListBody');
ok runParserTest('String, String qux', 'parameterListBody');
ok runParserTest('String?, *', 'parameterListBody');

say 'Testing parenthesizedParameterList';

ok runParserTest('(String, String qux?)', 'parenthesizedParameterList');

say 'Testing parameterList';

ok runParserTest('()', 'parameterList');
ok runParserTest('(*)', 'parameterList');
ok runParserTest('(String, *)', 'parameterList');
ok runParserTest('(String, String qux?, *)', 'parameterList');
ok runParserTest('(String, String qux?)', 'parameterList');
ok runParserTest('(String, String qux)', 'parameterList');
#ok runParserTest('$1$2$qux', 'parameterList');

say 'Testing identifier';

ok runParserTest('foo', 'identifier');
ok runParserTest('foo(String, String qux?, *)', 'identifier');
ok runParserTest('foo(String, String qux?)', 'identifier');

say 'Testing invocation';

ok runParserTest('foo (bar, baz)', 'invocation');
ok runParserTest('foo bar 6 qux', 'invocation');
ok runParserTest('foo bar baz', 'invocation');
ok runParserTest('foo bar', 'invocation');
ok runParserTest('foo qux=6 bar', 'invocation');
ok runParserTest('foo(bar 6 qux)', 'invocation');
ok runParserTest('foo(bar baz)', 'invocation');
ok runParserTest('foo(bar, baz)', 'invocation');
ok runParserTest('foo(bar)', 'invocation');
ok runParserTest('foo(qux=6 bar)', 'invocation');
ok runParserTest('foo(String, String qux?)', 'invocation');
nok runParserTest('foo(bar, baz', 'invocation', True);
nok runParserTest('foo(bar,baz)', 'invocation', True);

say 'Testing value';

ok runParserTest('$1$2$qux', 'value');

say 'Testing lineContents';

ok runParserTest('', 'lineContents');
ok runParserTest('* foo', 'lineContents');
ok runParserTest('foo', 'lineContents');
ok runParserTest('foo()', 'lineContents');
ok runParserTest('foo(bar)', 'lineContents');
ok runParserTest('foo(String, String qux, String baz)', 'lineContents');
ok runParserTest('foo(String, String qux?, *)', 'lineContents');
ok runParserTest('foo(String, String qux?, String baz)', 'lineContents');
ok runParserTest('foo(String, String qux?, String)', 'lineContents');
ok runParserTest('foo(String, String qux?)', 'lineContents');
ok runParserTest('foo(String, String, String)', 'lineContents');
ok runParserTest('foo=5', 'lineContents');
nok runParserTest('String qux?', 'lineContents', True);

say 'Testing TOP';

ok runParserTest('', 'TOP');
ok runParserTest('foo', 'TOP');
ok runParserTest('foo()', 'TOP');
ok runParserTest('foo(bar)', 'TOP');
ok runParserTest('foo=5', 'TOP');

ok runParserTest(Q[String foo(String, String qux?, *):
foo(bar baz)
foo(qux=6 bar)], 'TOP');

ok runParserTest(Q[String foo(String, String qux?, *):
    say $1$2$qux

# Test simple invocation
foo(bar baz) # $1 = bar, $2 is unset, $qux = baz
foo(bar 6 qux) # $1 = bar, $2 = 6, $3 = qux, $qux is unset
foo(qux=baz bar) # $1 = bar, $qux = baz

# Test simple invocation, parenthesis-less style
foo bar baz # $1 = bar, $2 is unset, $qux = baz
foo bar 6 qux # $1 = bar, $2 = 6, $3 = qux, $qux is unset
foo qux=baz bar # $1 = bar, $qux = baz

# Test invocation with "invoke"
routineName="foo"
invoke $routineName bar baz
], 'TOP');

say "Done running tests. Report:";
done-testing;
